// Core domain exports
export { parseOutline, parseOutlineContent } from './core/outline-parser.js';
export type { OpenDirective, SayBlock, Section, ParsedOutline } from './core/outline-parser.js';

export { validateOutline } from './core/validate-outline.js';
export type { ValidationIssue, ValidationResult, ValidateOptions } from './core/validate-outline.js';

export { scanRepo } from './core/scan-repo.js';
export type { FileInfo, RepoScanResult, ScanRepoOptions } from './core/scan-repo.js';

export { extractSequence } from './core/extract-sequence.js';
export type { SequenceEntry, ExtractSequenceResult } from './core/extract-sequence.js';

export { calculatePace } from './core/pace-calculator.js';
export type { SectionInput, SectionBudget, PaceResult, PaceOptions } from './core/pace-calculator.js';

export { generatePreflight } from './core/preflight.js';
export type { PreflightOptions, ChecklistItem, PreflightResult } from './core/preflight.js';

export { generateRehearsalPlan } from './core/rehearse-planner.js';
export type { RehearsalSession, RehearsePlanResult, RehearseOptions } from './core/rehearse-planner.js';

// Cache exports
export { CacheManager } from './cache/cache-manager.js';
export type { CacheEntry, CacheStats, CacheOptions } from './cache/cache-manager.js';

// Error exports
export {
  AppError,
  NotFoundError,
  CommandError,
  CacheError,
  ConfigError,
} from './errors/types.js';

// CLI exports
export { OutputFormatter } from './cli/output-formatter.js';
