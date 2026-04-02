import { extractSequence, type ExtractSequenceResult } from '../../core/extract-sequence.js';

export interface ExtractSequenceCommandOptions {
  outlinePath: string;
  json: boolean;
}

/**
 * Extract the ordered file:line sequence from a presentation outline.
 * Produces the "Quick Reference" list.
 */
export async function extractSequenceCommand(
  options: ExtractSequenceCommandOptions,
): Promise<ExtractSequenceResult> {
  return extractSequence(options.outlinePath);
}
