import { parseOutline } from './outline-parser.js';
function formatEntry(open) {
    let s = open.filePath;
    if (open.startLine !== null) {
        s += `:${open.startLine}`;
        if (open.endLine !== null && open.endLine !== open.startLine) {
            s += `-${open.endLine}`;
        }
    }
    return s;
}
export async function extractSequence(outlinePath) {
    const parsed = await parseOutline(outlinePath);
    const entries = parsed.opens.map((open, i) => ({
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
//# sourceMappingURL=extract-sequence.js.map