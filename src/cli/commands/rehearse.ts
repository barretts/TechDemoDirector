import { generateRehearsalPlan, type RehearseOptions, type RehearsePlanResult } from '../../core/rehearse-planner.js';

export interface RehearseCommandOptions {
  eventDate: string;
  duration: number;
  liveCoding?: boolean;
  json: boolean;
}

/**
 * Generate a spaced-practice rehearsal schedule working backward from the event date.
 */
export function rehearseCommand(options: RehearseCommandOptions): RehearsePlanResult {
  return generateRehearsalPlan({
    eventDate: options.eventDate,
    duration: options.duration,
    liveCoding: options.liveCoding,
  });
}
