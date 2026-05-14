import { type PreflightResult } from '../../core/preflight.js';
export interface PreflightCommandOptions {
    remote?: boolean;
    liveCoding?: boolean;
    duration?: number;
    audience?: 'technical' | 'mixed' | 'non-technical';
    recorded?: boolean;
    json: boolean;
}
/**
 * Generate a pre-call readiness checklist based on talk parameters.
 */
export declare function preflightCommand(options: PreflightCommandOptions): PreflightResult;
//# sourceMappingURL=preflight.d.ts.map