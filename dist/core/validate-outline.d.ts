/**
 * Validates a presentation outline markdown file.
 *
 * Checks:
 * - Every OPEN file path exists on disk
 * - Line numbers are within file bounds
 * - SAY blocks are non-empty, full sentences (not bullet lists)
 * - Time budgets sum to declared total duration
 * - No duplicate OPEN at identical file:line
 * - Every OPEN has at least one following SAY
 */
export interface ValidationIssue {
    severity: 'error' | 'warning';
    line: number;
    rule: string;
    message: string;
}
export interface ValidationResult {
    filePath: string;
    valid: boolean;
    issues: ValidationIssue[];
    stats: {
        sections: number;
        opens: number;
        says: number;
        totalTimeBudget: number | null;
        declaredDuration: number | null;
    };
}
export interface ValidateOptions {
    outlinePath: string;
    /** Base directory for resolving relative OPEN paths. Defaults to outline's parent dir. */
    basedir?: string;
    /** Skip filesystem checks (useful when files are on a remote machine) */
    skipFileChecks?: boolean;
}
export declare function validateOutline(options: ValidateOptions): Promise<ValidationResult>;
//# sourceMappingURL=validate-outline.d.ts.map