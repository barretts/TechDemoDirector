import { type RepoScanResult } from '../../core/scan-repo.js';
export interface ScanRepoCommandOptions {
    cwd: string;
    json: boolean;
    maxDepth?: number;
    extensions?: string[];
}
/**
 * Scan a repository and produce structured data for presentation building:
 * file tree, LOC, entry points, imports/exports, and "aha" candidates.
 */
export declare function scanRepoCommand(options: ScanRepoCommandOptions): Promise<RepoScanResult>;
//# sourceMappingURL=scan.d.ts.map