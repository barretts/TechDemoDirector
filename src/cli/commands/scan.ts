import { scanRepo, type ScanRepoOptions, type RepoScanResult } from '../../core/scan-repo.js';

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
export async function scanRepoCommand(
  options: ScanRepoCommandOptions,
): Promise<RepoScanResult> {
  return scanRepo({
    cwd: options.cwd,
    maxDepth: options.maxDepth,
    extensions: options.extensions,
  });
}
