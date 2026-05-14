/**
 * Parses a presentation outline markdown file and extracts
 * structured data: OPEN directives, SAY blocks, sections, and time budgets.
 */
export interface OpenDirective {
    /** 1-based line number in the outline where this OPEN appears */
    outlineLine: number;
    /** Raw text after **OPEN** */
    raw: string;
    /** Parsed file path */
    filePath: string;
    /** Start line (inclusive), or null if not specified */
    startLine: number | null;
    /** End line (inclusive), or null if not specified / same as start */
    endLine: number | null;
}
export interface SayBlock {
    outlineLine: number;
    text: string;
}
export interface Section {
    outlineLine: number;
    heading: string;
    level: number;
    timeBudgetMinutes: number | null;
    opens: OpenDirective[];
    says: SayBlock[];
}
export interface ParsedOutline {
    filePath: string;
    title: string | null;
    totalDurationMinutes: number | null;
    sections: Section[];
    opens: OpenDirective[];
    says: SayBlock[];
}
export declare function parseOutline(filePath: string): Promise<ParsedOutline>;
export declare function parseOutlineContent(content: string, filePath?: string): ParsedOutline;
//# sourceMappingURL=outline-parser.d.ts.map