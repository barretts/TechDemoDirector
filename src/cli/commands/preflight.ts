import { generatePreflight, type PreflightOptions, type PreflightResult } from '../../core/preflight.js';

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
export function preflightCommand(options: PreflightCommandOptions): PreflightResult {
  return generatePreflight({
    remote: options.remote,
    liveCoding: options.liveCoding,
    duration: options.duration,
    audience: options.audience,
    recorded: options.recorded,
  });
}
