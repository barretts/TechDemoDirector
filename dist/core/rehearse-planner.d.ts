/**
 * Rehearsal schedule generator using spaced practice principles.
 *
 * Given an event date and talk duration, produces a rehearsal plan
 * with deliberate practice, retrieval practice, and failure drills.
 */
export interface RehearsalSession {
    /** ISO date string (YYYY-MM-DD) */
    date: string;
    /** Days before event */
    daysBefore: number;
    activity: string;
    type: 'build' | 'practice' | 'finalize';
    description: string;
    /** Estimated duration in minutes */
    durationMinutes: number;
}
export interface RehearsePlanResult {
    eventDate: string;
    talkDurationMinutes: number;
    sessions: RehearsalSession[];
    totalPrepMinutes: number;
    warnings: string[];
}
export interface RehearseOptions {
    /** Event date as ISO string (YYYY-MM-DD) or Date */
    eventDate: string;
    /** Talk duration in minutes */
    duration: number;
    /** Include live-coding failure drills */
    liveCoding?: boolean;
}
export declare function generateRehearsalPlan(options: RehearseOptions): RehearsePlanResult;
//# sourceMappingURL=rehearse-planner.d.ts.map