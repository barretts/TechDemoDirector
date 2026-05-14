import { type PaceResult } from '../../core/pace-calculator.js';
export interface PaceCommandOptions {
    duration: number;
    sections: string;
    buffer?: number;
    wpm?: number;
    json: boolean;
}
/**
 * Calculate time budgets for presentation sections.
 * Sections are passed as a comma-separated string: "Intro,Demo:2,Recap:0.5"
 * where the number after the colon is the weight (default 1).
 * Prefix with ! to protect from trimming: "!Demo:2"
 * Prefix with = for fixed minutes: "=Intro:3"
 */
export declare function paceCommand(options: PaceCommandOptions): PaceResult;
//# sourceMappingURL=pace.d.ts.map