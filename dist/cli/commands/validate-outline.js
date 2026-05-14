import { validateOutline } from '../../core/validate-outline.js';
/**
 * Validate a presentation outline markdown file.
 * Checks OPEN paths, line ranges, SAY blocks, time budgets, and pairing.
 */
export async function validateOutlineCommand(options) {
    return validateOutline({
        outlinePath: options.outlinePath,
        basedir: options.basedir,
        skipFileChecks: options.skipFileChecks,
    });
}
//# sourceMappingURL=validate-outline.js.map