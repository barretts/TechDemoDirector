/**
 * Time budget calculator for presentations.
 *
 * Given a total duration and section definitions, computes per-section
 * time allocations with trim/protect guidance.
 */
export interface SectionInput {
    name: string;
    /** Relative weight (1 = normal, 2 = double time, 0.5 = half) */
    weight?: number;
    /** If true, this section's budget is protected from trimming */
    protect?: boolean;
    /** Fixed duration override in minutes (bypasses weight calculation) */
    fixedMinutes?: number;
}
export interface SectionBudget {
    name: string;
    minutes: number;
    protected: boolean;
    /** When over budget, suggested trim amount */
    trimTarget: number;
    /** Approximate word count at ~130 WPM speaking rate */
    approxWords: number;
    /** Number of OPEN+SAY pairs that fit (~2 min each) */
    approxPairs: number;
}
export interface PaceResult {
    totalMinutes: number;
    sections: SectionBudget[];
    bufferMinutes: number;
    wordsPerMinute: number;
    totalWords: number;
    warnings: string[];
}
export interface PaceOptions {
    /** Total talk duration in minutes */
    duration: number;
    /** Section definitions */
    sections: SectionInput[];
    /** Reserve this fraction of total time as buffer (default 0.1 = 10%) */
    bufferFraction?: number;
    /** Speaking rate in words per minute (default 130) */
    wpm?: number;
}
export declare function calculatePace(options: PaceOptions): PaceResult;
//# sourceMappingURL=pace-calculator.d.ts.map