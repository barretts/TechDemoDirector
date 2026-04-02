import { parseOutline, type OpenDirective } from './outline-parser.js';

/**
 * Extracts the ordered file:line sequence from a presentation outline.
 * Produces the "Quick Reference" list at the end of a presentation.
 */

export interface SequenceEntry {
  index: number;
  filePath: string;
  startLine: number | null;
  endLine: number | null;
  /** Formatted as "path/to/file.ts:10-25" */
  formatted: string;
  outlineLine: number;
}

export interface ExtractSequenceResult {
  entries: SequenceEntry[];
  uniqueFiles: string[];
  totalOpens: number;
  /** Rendered markdown for the Quick Reference section */
  markdown: string;
}

function formatEntry(open: OpenDirective): string {
  let s = open.filePath;
  if (open.startLine !== null) {
    s += `:${open.startLine}`;
    if (open.endLine !== null && open.endLine !== open.startLine) {
      s += `-${open.endLine}`;
    }
  }
  return s;
}

export async function extractSequence(outlinePath: string): Promise<ExtractSequenceResult> {
  const parsed = await parseOutline(outlinePath);

  const entries: SequenceEntry[] = parsed.opens.map((open, i) => ({
    index: i + 1,
    filePath: open.filePath,
    startLine: open.startLine,
    endLine: open.endLine,
    formatted: formatEntry(open),
    outlineLine: open.outlineLine,
  }));

  const uniqueFiles = [...new Set(entries.map((e) => e.filePath))];

  const markdownLines = [
    '## File Open Sequence (Quick Reference)',
    '',
    ...entries.map((e) => `${e.index}. \`${e.formatted}\``),
  ];

  return {
    entries,
    uniqueFiles,
    totalOpens: entries.length,
    markdown: markdownLines.join('\n'),
  };
}
