import fs from 'fs/promises';
import path from 'path';

/**
 * Scans a repository and produces structured data useful for
 * building a presentation: file tree, LOC, entry points, imports/exports.
 */

export interface FileInfo {
  relativePath: string;
  extension: string;
  lines: number;
  bytes: number;
  isEntryPoint: boolean;
  entryPointReason: string | null;
  exports: string[];
  imports: string[];
}

export interface RepoScanResult {
  root: string;
  totalFiles: number;
  totalLines: number;
  languageBreakdown: Record<string, { files: number; lines: number }>;
  files: FileInfo[];
  entryPoints: FileInfo[];
  /** Files with the most imports from other files — high connectivity = "aha" candidates */
  ahaCandidates: Array<{ file: string; reason: string; score: number }>;
  scannedAt: string;
}

export interface ScanRepoOptions {
  cwd: string;
  /** Max depth for directory traversal */
  maxDepth?: number;
  /** Glob patterns to exclude */
  exclude?: string[];
  /** Only include these extensions (e.g. ['.ts', '.py']) */
  extensions?: string[];
}

const DEFAULT_EXCLUDE = [
  'node_modules', '.git', 'dist', 'build', 'compiled', '.next',
  '__pycache__', '.mypy_cache', 'target', 'vendor', '.skill-cache',
  '.agent', 'coverage', '.turbo', '.cache',
];

const ENTRY_POINT_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /^package\.json$/, reason: 'Node.js manifest' },
  { pattern: /^(index|main|app|server|cli)\.[tjm]sx?$/, reason: 'Common entry point name' },
  { pattern: /^(Cargo|pyproject)\.toml$/, reason: 'Project manifest' },
  { pattern: /^go\.mod$/, reason: 'Go module definition' },
  { pattern: /^(Makefile|Dockerfile|docker-compose\.ya?ml)$/, reason: 'Build/deploy config' },
  { pattern: /^README\.md$/i, reason: 'Documentation entry' },
  { pattern: /\.config\.[tjm]s$/, reason: 'Configuration file' },
];

const SOURCE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.rs', '.go', '.java', '.kt', '.swift',
  '.c', '.cpp', '.h', '.hpp', '.cs', '.rb',
  '.vue', '.svelte', '.astro',
]);

const IMPORT_RE_JS = /(?:import|from)\s+['"]([^'"]+)['"]/g;
const EXPORT_RE_JS = /export\s+(?:default\s+)?(?:function|class|const|let|var|type|interface|enum)\s+(\w+)/g;

const IMPORT_RE_PY = /(?:^from\s+(\S+)\s+import|^import\s+(\S+))/gm;
const IMPORT_RE_GO = /import\s+(?:\(\s*)?(?:"([^"]+)")/g;
const IMPORT_RE_RUST = /(?:use|mod)\s+([a-zA-Z_]\w*(?:::\w+)*)/g;

function extractImports(content: string, ext: string): string[] {
  const imports: string[] = [];
  let re: RegExp;

  switch (ext) {
    case '.ts': case '.tsx': case '.js': case '.jsx': case '.mjs': case '.cjs':
      re = new RegExp(IMPORT_RE_JS.source, 'g');
      break;
    case '.py':
      re = new RegExp(IMPORT_RE_PY.source, 'gm');
      break;
    case '.go':
      re = new RegExp(IMPORT_RE_GO.source, 'g');
      break;
    case '.rs':
      re = new RegExp(IMPORT_RE_RUST.source, 'g');
      break;
    default:
      return imports;
  }

  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const imp = m[1] || m[2];
    if (imp) imports.push(imp);
  }
  return imports;
}

function extractExports(content: string, ext: string): string[] {
  if (!['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(ext)) return [];
  const exports: string[] = [];
  const re = new RegExp(EXPORT_RE_JS.source, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    if (m[1]) exports.push(m[1]);
  }
  return exports;
}

async function walkDir(
  dir: string,
  root: string,
  exclude: string[],
  maxDepth: number,
  depth: number = 0,
): Promise<string[]> {
  if (depth > maxDepth) return [];

  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const results: string[] = [];
  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;
    if (entry.name.startsWith('.') && entry.name !== '.') continue;

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await walkDir(fullPath, root, exclude, maxDepth, depth + 1);
      results.push(...sub);
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

export async function scanRepo(options: ScanRepoOptions): Promise<RepoScanResult> {
  const {
    cwd,
    maxDepth = 10,
    exclude = DEFAULT_EXCLUDE,
    extensions,
  } = options;

  const root = path.resolve(cwd);
  const allPaths = await walkDir(root, root, exclude, maxDepth);

  const files: FileInfo[] = [];
  const langBreakdown: Record<string, { files: number; lines: number }> = {};

  for (const filePath of allPaths) {
    const ext = path.extname(filePath).toLowerCase();
    const relativePath = path.relative(root, filePath);
    const basename = path.basename(filePath);

    // Filter by extensions if specified
    if (extensions && extensions.length > 0) {
      if (!extensions.includes(ext)) continue;
    }

    let content: string;
    let bytes: number;
    try {
      const stat = await fs.stat(filePath);
      bytes = stat.size;
      // Skip binary / very large files
      if (bytes > 1_000_000) {
        files.push({
          relativePath, extension: ext, lines: 0, bytes,
          isEntryPoint: false, entryPointReason: null,
          exports: [], imports: [],
        });
        continue;
      }
      content = await fs.readFile(filePath, 'utf-8');
    } catch {
      continue;
    }

    const lineCount = content.split('\n').length;

    // Detect entry points
    let isEntryPoint = false;
    let entryPointReason: string | null = null;
    for (const ep of ENTRY_POINT_PATTERNS) {
      if (ep.pattern.test(basename)) {
        isEntryPoint = true;
        entryPointReason = ep.reason;
        break;
      }
    }

    // Extract imports/exports for source files
    const isSource = SOURCE_EXTENSIONS.has(ext);
    const imports = isSource ? extractImports(content, ext) : [];
    const exports = isSource ? extractExports(content, ext) : [];

    files.push({
      relativePath, extension: ext, lines: lineCount, bytes,
      isEntryPoint, entryPointReason, exports, imports,
    });

    // Language breakdown
    if (isSource) {
      if (!langBreakdown[ext]) langBreakdown[ext] = { files: 0, lines: 0 };
      langBreakdown[ext].files++;
      langBreakdown[ext].lines += lineCount;
    }
  }

  // Compute "aha" candidates: files imported by many others
  const importedByCount = new Map<string, number>();
  for (const file of files) {
    for (const imp of file.imports) {
      // Normalize: strip relative path prefixes and extensions
      const normalized = imp.replace(/^\.\//, '').replace(/\.[^.]+$/, '');
      importedByCount.set(normalized, (importedByCount.get(normalized) || 0) + 1);
    }
  }

  // Also score files with many exports (they're hubs)
  const ahaCandidates: Array<{ file: string; reason: string; score: number }> = [];

  for (const file of files) {
    let score = 0;
    const reasons: string[] = [];

    // Score for being imported by others
    const baseName = file.relativePath.replace(/\.[^.]+$/, '');
    const shortName = path.basename(baseName);
    const importCount = importedByCount.get(baseName) || importedByCount.get(shortName) || 0;
    if (importCount >= 2) {
      score += importCount * 2;
      reasons.push(`imported by ${importCount} files`);
    }

    // Score for having many exports (hub module)
    if (file.exports.length >= 3) {
      score += file.exports.length;
      reasons.push(`${file.exports.length} exports`);
    }

    // Score for being an entry point
    if (file.isEntryPoint) {
      score += 3;
      reasons.push(`entry point: ${file.entryPointReason}`);
    }

    // Score for size (larger files are more likely to contain core logic, up to a point)
    if (file.lines >= 50 && file.lines <= 500) {
      score += 1;
      reasons.push(`${file.lines} lines`);
    }

    if (score >= 3) {
      ahaCandidates.push({
        file: file.relativePath,
        reason: reasons.join('; '),
        score,
      });
    }
  }

  ahaCandidates.sort((a, b) => b.score - a.score);

  const entryPoints = files.filter((f) => f.isEntryPoint);
  const totalLines = files.reduce((sum, f) => sum + f.lines, 0);

  return {
    root,
    totalFiles: files.length,
    totalLines,
    languageBreakdown: langBreakdown,
    files,
    entryPoints,
    ahaCandidates: ahaCandidates.slice(0, 20),
    scannedAt: new Date().toISOString(),
  };
}
