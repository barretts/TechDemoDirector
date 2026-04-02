import { validateOutline, type ValidateOptions, type ValidationResult } from '../../core/validate-outline.js';

export interface ValidateOutlineCommandOptions extends ValidateOptions {
  json: boolean;
}

/**
 * Validate a presentation outline markdown file.
 * Checks OPEN paths, line ranges, SAY blocks, time budgets, and pairing.
 */
export async function validateOutlineCommand(
  options: ValidateOutlineCommandOptions,
): Promise<ValidationResult> {
  return validateOutline({
    outlinePath: options.outlinePath,
    basedir: options.basedir,
    skipFileChecks: options.skipFileChecks,
  });
}
