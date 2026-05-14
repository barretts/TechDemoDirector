import { type ValidateOptions, type ValidationResult } from '../../core/validate-outline.js';
export interface ValidateOutlineCommandOptions extends ValidateOptions {
    json: boolean;
}
/**
 * Validate a presentation outline markdown file.
 * Checks OPEN paths, line ranges, SAY blocks, time budgets, and pairing.
 */
export declare function validateOutlineCommand(options: ValidateOutlineCommandOptions): Promise<ValidationResult>;
//# sourceMappingURL=validate-outline.d.ts.map