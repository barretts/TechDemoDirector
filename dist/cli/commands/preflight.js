import { generatePreflight } from '../../core/preflight.js';
/**
 * Generate a pre-call readiness checklist based on talk parameters.
 */
export function preflightCommand(options) {
    return generatePreflight({
        remote: options.remote,
        liveCoding: options.liveCoding,
        duration: options.duration,
        audience: options.audience,
        recorded: options.recorded,
    });
}
//# sourceMappingURL=preflight.js.map