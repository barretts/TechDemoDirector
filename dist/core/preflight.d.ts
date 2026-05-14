/**
 * Pre-call readiness checklist generator.
 *
 * Produces a structured checklist based on talk parameters,
 * drawing from research-backed requirements (audio quality,
 * screen-share mode, captions, notification suppression, etc.).
 */
export interface PreflightOptions {
    /** Is this a remote/video-call presentation? */
    remote?: boolean;
    /** Does the talk include live coding or terminal demos? */
    liveCoding?: boolean;
    /** Duration in minutes */
    duration?: number;
    /** Audience type */
    audience?: 'technical' | 'mixed' | 'non-technical';
    /** Will the presentation be recorded? */
    recorded?: boolean;
}
export interface ChecklistItem {
    category: 'content' | 'tech' | 'privacy' | 'delivery' | 'fallback';
    item: string;
    priority: 'required' | 'recommended' | 'optional';
    rationale: string;
}
export interface PreflightResult {
    checklist: ChecklistItem[];
    summary: Record<string, number>;
}
export declare function generatePreflight(options?: PreflightOptions): PreflightResult;
//# sourceMappingURL=preflight.d.ts.map