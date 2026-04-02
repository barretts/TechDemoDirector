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

export function calculatePace(options: PaceOptions): PaceResult {
  const {
    duration,
    sections,
    bufferFraction = 0.1,
    wpm = 130,
  } = options;

  const warnings: string[] = [];

  if (duration <= 0) {
    warnings.push('Duration must be positive');
    return {
      totalMinutes: duration,
      sections: [],
      bufferMinutes: 0,
      wordsPerMinute: wpm,
      totalWords: 0,
      warnings,
    };
  }

  const bufferMinutes = Math.round(duration * bufferFraction * 10) / 10;
  const available = duration - bufferMinutes;

  // Separate fixed and weighted sections
  const fixedSections = sections.filter((s) => s.fixedMinutes !== undefined);
  const weightedSections = sections.filter((s) => s.fixedMinutes === undefined);

  const fixedTotal = fixedSections.reduce((sum, s) => sum + (s.fixedMinutes || 0), 0);
  const remainingForWeighted = available - fixedTotal;

  if (remainingForWeighted < 0) {
    warnings.push(
      `Fixed-duration sections (${fixedTotal} min) exceed available time (${available} min after buffer)`,
    );
  }

  const totalWeight = weightedSections.reduce((sum, s) => sum + (s.weight ?? 1), 0);

  const budgets: SectionBudget[] = sections.map((section) => {
    let minutes: number;
    if (section.fixedMinutes !== undefined) {
      minutes = section.fixedMinutes;
    } else if (totalWeight > 0) {
      minutes = Math.round(((section.weight ?? 1) / totalWeight) * Math.max(0, remainingForWeighted) * 10) / 10;
    } else {
      minutes = 0;
    }

    const isProtected = section.protect ?? false;
    const trimTarget = isProtected ? 0 : Math.round(minutes * 0.2 * 10) / 10;

    return {
      name: section.name,
      minutes,
      protected: isProtected,
      trimTarget,
      approxWords: Math.round(minutes * wpm),
      approxPairs: Math.max(1, Math.round(minutes / 2)),
    };
  });

  const allocatedTotal = budgets.reduce((sum, b) => sum + b.minutes, 0);
  if (Math.abs(allocatedTotal + bufferMinutes - duration) > 0.5) {
    warnings.push(
      `Allocated ${allocatedTotal} min + ${bufferMinutes} min buffer = ${allocatedTotal + bufferMinutes} min (target: ${duration} min)`,
    );
  }

  if (sections.length > 8) {
    warnings.push('More than 8 sections may overwhelm audience working memory — consider consolidating');
  }

  if (duration < sections.length * 2) {
    warnings.push('Less than 2 minutes per section — consider reducing section count');
  }

  return {
    totalMinutes: duration,
    sections: budgets,
    bufferMinutes,
    wordsPerMinute: wpm,
    totalWords: budgets.reduce((sum, b) => sum + b.approxWords, 0),
    warnings,
  };
}
