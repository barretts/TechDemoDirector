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
export declare function extractSequence(outlinePath: string): Promise<ExtractSequenceResult>;
//# sourceMappingURL=extract-sequence.d.ts.map