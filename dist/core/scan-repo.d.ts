/**
 * Scans a repository and produces structured data useful for
 * building a presentation: file tree, LOC, entry points, imports/exports.
 */
export interface FileInfo {
    relativePath: string;
    extension: string;
    lines: number;
    bytes: number;
    isEntryPoint: boolean;
    entryPointReason: string | null;
    exports: string[];
    imports: string[];
}
export interface RepoScanResult {
    root: string;
    totalFiles: number;
    totalLines: number;
    languageBreakdown: Record<string, {
        files: number;
        lines: number;
    }>;
    files: FileInfo[];
    entryPoints: FileInfo[];
    /** Files with the most imports from other files — high connectivity = "aha" candidates */
    ahaCandidates: Array<{
        file: string;
        reason: string;
        score: number;
    }>;
    scannedAt: string;
}
export interface ScanRepoOptions {
    cwd: string;
    /** Max depth for directory traversal */
    maxDepth?: number;
    /** Glob patterns to exclude */
    exclude?: string[];
    /** Only include these extensions (e.g. ['.ts', '.py']) */
    extensions?: string[];
}
export declare function scanRepo(options: ScanRepoOptions): Promise<RepoScanResult>;
//# sourceMappingURL=scan-repo.d.ts.map