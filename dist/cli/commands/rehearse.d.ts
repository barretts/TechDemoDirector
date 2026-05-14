import { type RehearsePlanResult } from '../../core/rehearse-planner.js';
export interface RehearseCommandOptions {
    eventDate: string;
    duration: number;
    liveCoding?: boolean;
    json: boolean;
}
/**
 * Generate a spaced-practice rehearsal schedule working backward from the event date.
 */
export declare function rehearseCommand(options: RehearseCommandOptions): RehearsePlanResult;
//# sourceMappingURL=rehearse.d.ts.map