import fs from 'fs/promises';
import path from 'path';
import { parseOutline, type ParsedOutline, type OpenDirective, type SayBlock } from './outline-parser.js';

/**
 * Validates a presentation outline markdown file.
 *
 * Checks:
 * - Every OPEN file path exists on disk
 * - Line numbers are within file bounds
 * - SAY blocks are non-empty, full sentences (not bullet lists)
 * - Time budgets sum to declared total duration
 * - No duplicate OPEN at identical file:line
 * - Every OPEN has at least one following SAY
 */

export interface ValidationIssue {
  severity: 'error' | 'warning';
  line: number;
  rule: string;
  message: string;
}

export interface ValidationResult {
  filePath: string;
  valid: boolean;
  issues: ValidationIssue[];
  stats: {
    sections: number;
    opens: number;
    says: number;
    totalTimeBudget: number | null;
    declaredDuration: number | null;
  };
}

export interface ValidateOptions {
  outlinePath: string;
  /** Base directory for resolving relative OPEN paths. Defaults to outline's parent dir. */
  basedir?: string;
  /** Skip filesystem checks (useful when files are on a remote machine) */
  skipFileChecks?: boolean;
}

export async function validateOutline(options: ValidateOptions): Promise<ValidationResult> {
  const { outlinePath, skipFileChecks = false } = options;
  const basedir = options.basedir || path.dirname(path.resolve(outlinePath));

  const parsed = await parseOutline(outlinePath);
  const issues: ValidationIssue[] = [];

  // 1. Check OPEN paths exist and line numbers are in range
  if (!skipFileChecks) {
    await checkOpenPaths(parsed.opens, basedir, issues);
  }

  // 2. Check SAY blocks are well-formed
  checkSayBlocks(parsed.says, issues);

  // 3. Check time budgets sum correctly
  checkTimeBudgets(parsed, issues);

  // 4. Check for duplicate OPEN at same file:line
  checkDuplicateOpens(parsed.opens, issues);

  // 5. Check every OPEN has a following SAY
  checkOpenSayPairing(parsed, issues);

  // 6. Check outline has at least some content
  if (parsed.opens.length === 0) {
    issues.push({
      severity: 'warning',
      line: 1,
      rule: 'no-opens',
      message: 'Outline contains no **OPEN** directives',
    });
  }

  return {
    filePath: outlinePath,
    valid: issues.filter((i) => i.severity === 'error').length === 0,
    issues,
    stats: {
      sections: parsed.sections.length,
      opens: parsed.opens.length,
      says: parsed.says.length,
      totalTimeBudget: sumTimeBudgets(parsed),
      declaredDuration: parsed.totalDurationMinutes,
    },
  };
}

async function checkOpenPaths(
  opens: OpenDirective[],
  basedir: string,
  issues: ValidationIssue[],
): Promise<void> {
  for (const open of opens) {
    const resolved = path.resolve(basedir, open.filePath);
    try {
      const stat = await fs.stat(resolved);
      if (!stat.isFile()) {
        issues.push({
          severity: 'error',
          line: open.outlineLine,
          rule: 'open-not-file',
          message: `OPEN path is not a file: ${open.filePath}`,
        });
        continue;
      }

      // Check line numbers are in range
      if (open.startLine !== null) {
        const content = await fs.readFile(resolved, 'utf-8');
        const lineCount = content.split('\n').length;
        if (open.startLine > lineCount) {
          issues.push({
            severity: 'error',
            line: open.outlineLine,
            rule: 'open-line-out-of-range',
            message: `Start line ${open.startLine} exceeds file length (${lineCount} lines): ${open.filePath}`,
          });
        }
        if (open.endLine !== null && open.endLine > lineCount) {
          issues.push({
            severity: 'error',
            line: open.outlineLine,
            rule: 'open-line-out-of-range',
            message: `End line ${open.endLine} exceeds file length (${lineCount} lines): ${open.filePath}`,
          });
        }
        if (open.startLine !== null && open.endLine !== null && open.startLine > open.endLine) {
          issues.push({
            severity: 'error',
            line: open.outlineLine,
            rule: 'open-line-inverted',
            message: `Start line (${open.startLine}) > end line (${open.endLine}): ${open.filePath}`,
          });
        }
      }
    } catch {
      issues.push({
        severity: 'error',
        line: open.outlineLine,
        rule: 'open-file-not-found',
        message: `File not found: ${open.filePath} (resolved: ${resolved})`,
      });
    }
  }
}

function checkSayBlocks(says: SayBlock[], issues: ValidationIssue[]): void {
  for (const say of says) {
    // Empty SAY
    if (!say.text || say.text.trim().length === 0) {
      issues.push({
        severity: 'error',
        line: say.outlineLine,
        rule: 'say-empty',
        message: 'SAY block is empty',
      });
      continue;
    }

    // SAY that looks like bullet points instead of sentences
    if (say.text.trim().startsWith('- ') || say.text.trim().startsWith('* ')) {
      issues.push({
        severity: 'warning',
        line: say.outlineLine,
        rule: 'say-bullet-list',
        message: 'SAY block appears to be bullet points rather than speakable sentences',
      });
    }

    // SAY that is very short (likely incomplete)
    if (say.text.trim().length < 20) {
      issues.push({
        severity: 'warning',
        line: say.outlineLine,
        rule: 'say-too-short',
        message: `SAY block is very short (${say.text.trim().length} chars) — may be incomplete`,
      });
    }
  }
}

function checkTimeBudgets(parsed: ParsedOutline, issues: ValidationIssue[]): void {
  const budgetedSections = parsed.sections.filter((s) => s.timeBudgetMinutes !== null);
  if (budgetedSections.length === 0) return;

  const totalBudget = budgetedSections.reduce((sum, s) => sum + (s.timeBudgetMinutes || 0), 0);

  if (parsed.totalDurationMinutes !== null) {
    const diff = Math.abs(totalBudget - parsed.totalDurationMinutes);
    if (diff > 1) {
      issues.push({
        severity: 'warning',
        line: 1,
        rule: 'time-budget-mismatch',
        message: `Section time budgets sum to ${totalBudget} min but declared duration is ${parsed.totalDurationMinutes} min (diff: ${diff} min)`,
      });
    }
  }
}

function checkDuplicateOpens(opens: OpenDirective[], issues: ValidationIssue[]): void {
  const seen = new Map<string, number>();
  for (const open of opens) {
    const key = `${open.filePath}:${open.startLine ?? 0}-${open.endLine ?? 0}`;
    const prev = seen.get(key);
    if (prev !== undefined) {
      issues.push({
        severity: 'warning',
        line: open.outlineLine,
        rule: 'duplicate-open',
        message: `Duplicate OPEN for ${key} (first at line ${prev})`,
      });
    } else {
      seen.set(key, open.outlineLine);
    }
  }
}

function checkOpenSayPairing(parsed: ParsedOutline, issues: ValidationIssue[]): void {
  // Walk through all opens — each should have at least one SAY after it
  // before the next OPEN or heading
  for (const section of parsed.sections) {
    for (let i = 0; i < section.opens.length; i++) {
      const open = section.opens[i];
      const nextOpen = section.opens[i + 1];

      // Find SAY blocks that follow this OPEN
      const followingSays = section.says.filter((s) => {
        if (s.outlineLine <= open.outlineLine) return false;
        if (nextOpen && s.outlineLine >= nextOpen.outlineLine) return false;
        return true;
      });

      if (followingSays.length === 0) {
        issues.push({
          severity: 'warning',
          line: open.outlineLine,
          rule: 'open-without-say',
          message: `OPEN directive has no following SAY block: ${open.raw}`,
        });
      }
    }
  }
}

function sumTimeBudgets(parsed: ParsedOutline): number | null {
  const budgeted = parsed.sections.filter((s) => s.timeBudgetMinutes !== null);
  if (budgeted.length === 0) return null;
  return budgeted.reduce((sum, s) => sum + (s.timeBudgetMinutes || 0), 0);
}
