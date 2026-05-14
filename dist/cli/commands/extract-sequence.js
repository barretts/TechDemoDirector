import { extractSequence } from '../../core/extract-sequence.js';
/**
 * Extract the ordered file:line sequence from a presentation outline.
 * Produces the "Quick Reference" list.
 */
export async function extractSequenceCommand(options) {
    return extractSequence(options.outlinePath);
}
//# sourceMappingURL=extract-sequence.js.map