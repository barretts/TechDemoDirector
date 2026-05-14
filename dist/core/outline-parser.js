import fs from 'fs/promises';
// Matches **OPEN** `path/to/file.ts:10-25` or **OPEN** path/to/file.ts:10
const OPEN_RE = /\*\*OPEN\*\*\s+`?([^`\s]+)`?/;
// Matches **SAY:** "..." or **SAY:** ...
const SAY_RE = /^\*\*SAY:\*\*\s*(.*)/;
// Matches headings: ## Section Name (5 min) or ## Section Name
const HEADING_RE = /^(#{1,6})\s+(.*)/;
// Matches time annotations like (5 min), (2.5 min), (~3 min)
const TIME_RE = /\(~?(\d+(?:\.\d+)?)\s*min(?:utes?)?\)/i;
// Matches file:line or file:startLine-endLine
const FILE_LINE_RE = /^(.+?)(?::(\d+)(?:-(\d+))?)?$/;
function parseFileRef(raw) {
    const m = raw.match(FILE_LINE_RE);
    if (!m)
        return { filePath: raw, startLine: null, endLine: null };
    return {
        filePath: m[1],
        startLine: m[2] ? parseInt(m[2], 10) : null,
        endLine: m[3] ? parseInt(m[3], 10) : (m[2] ? parseInt(m[2], 10) : null),
    };
}
export async function parseOutline(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return parseOutlineContent(content, filePath);
}
export function parseOutlineContent(content, filePath = '<stdin>') {
    const lines = content.split('\n');
    let title = null;
    let totalDuration = null;
    const sections = [];
    const allOpens = [];
    const allSays = [];
    let currentSection = null;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNum = i + 1;
        // Detect headings
        const headingMatch = line.match(HEADING_RE);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const headingText = headingMatch[2].trim();
            // First h1 is the title
            if (level === 1 && title === null) {
                title = headingText;
                const timeMatch = headingText.match(TIME_RE);
                if (timeMatch) {
                    totalDuration = parseFloat(timeMatch[1]);
                }
            }
            // Extract time budget from heading
            let timeBudget = null;
            const timeMatch = headingText.match(TIME_RE);
            if (timeMatch) {
                timeBudget = parseFloat(timeMatch[1]);
            }
            currentSection = {
                outlineLine: lineNum,
                heading: headingText.replace(TIME_RE, '').trim(),
                level,
                timeBudgetMinutes: timeBudget,
                opens: [],
                says: [],
            };
            sections.push(currentSection);
            continue;
        }
        // Detect OPEN directives
        const openMatch = line.match(OPEN_RE);
        if (openMatch) {
            const raw = openMatch[1];
            const parsed = parseFileRef(raw);
            const directive = {
                outlineLine: lineNum,
                raw,
                ...parsed,
            };
            allOpens.push(directive);
            if (currentSection)
                currentSection.opens.push(directive);
            continue;
        }
        // Detect SAY blocks
        const sayMatch = line.match(SAY_RE);
        if (sayMatch) {
            // Collect continuation lines (non-empty lines that follow)
            let text = sayMatch[1];
            while (i + 1 < lines.length) {
                const next = lines[i + 1];
                // Stop at next directive, heading, or blank line
                if (!next.trim() || next.match(OPEN_RE) || next.match(HEADING_RE) || next.match(SAY_RE)) {
                    break;
                }
                text += ' ' + next.trim();
                i++;
            }
            const say = { outlineLine: lineNum, text: text.trim() };
            allSays.push(say);
            if (currentSection)
                currentSection.says.push(say);
        }
    }
    // Try to find total duration from a metadata-like pattern at the top
    if (totalDuration === null) {
        for (const line of lines.slice(0, 20)) {
            const m = line.match(/(?:duration|total|time).*?(\d+(?:\.\d+)?)\s*min/i);
            if (m) {
                totalDuration = parseFloat(m[1]);
                break;
            }
        }
    }
    return {
        filePath,
        title,
        totalDurationMinutes: totalDuration,
        sections,
        opens: allOpens,
        says: allSays,
    };
}
//# sourceMappingURL=outline-parser.js.map