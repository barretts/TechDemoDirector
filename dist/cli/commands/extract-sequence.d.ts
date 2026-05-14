import { type ExtractSequenceResult } from '../../core/extract-sequence.js';
export interface ExtractSequenceCommandOptions {
    outlinePath: string;
    json: boolean;
}
/**
 * Extract the ordered file:line sequence from a presentation outline.
 * Produces the "Quick Reference" list.
 */
export declare function extractSequenceCommand(options: ExtractSequenceCommandOptions): Promise<ExtractSequenceResult>;
//# sourceMappingURL=extract-sequence.d.ts.map