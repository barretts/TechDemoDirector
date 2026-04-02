import { calculatePace, type PaceOptions, type PaceResult } from '../../core/pace-calculator.js';

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
export function paceCommand(options: PaceCommandOptions): PaceResult {
  const sectionInputs = options.sections.split(',').map((s) => {
    const trimmed = s.trim();
    let protect = false;
    let fixed = false;
    let raw = trimmed;

    if (raw.startsWith('!')) {
      protect = true;
      raw = raw.slice(1);
    } else if (raw.startsWith('=')) {
      fixed = true;
      raw = raw.slice(1);
    }

    const parts = raw.split(':');
    const name = parts[0].trim();
    const num = parts[1] ? parseFloat(parts[1]) : 1;

    return {
      name,
      weight: fixed ? undefined : num,
      fixedMinutes: fixed ? num : undefined,
      protect,
    };
  });

  return calculatePace({
    duration: options.duration,
    sections: sectionInputs,
    bufferFraction: options.buffer,
    wpm: options.wpm,
  });
}
