import { scanRepo } from '../../core/scan-repo.js';
/**
 * Scan a repository and produce structured data for presentation building:
 * file tree, LOC, entry points, imports/exports, and "aha" candidates.
 */
export async function scanRepoCommand(options) {
    return scanRepo({
        cwd: options.cwd,
        maxDepth: options.maxDepth,
        extensions: options.extensions,
    });
}
//# sourceMappingURL=scan.js.map