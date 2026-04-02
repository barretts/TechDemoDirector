/**
 * Rehearsal schedule generator using spaced practice principles.
 *
 * Given an event date and talk duration, produces a rehearsal plan
 * with deliberate practice, retrieval practice, and failure drills.
 */

export interface RehearsalSession {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Days before event */
  daysBefore: number;
  activity: string;
  type: 'build' | 'practice' | 'finalize';
  description: string;
  /** Estimated duration in minutes */
  durationMinutes: number;
}

export interface RehearsePlanResult {
  eventDate: string;
  talkDurationMinutes: number;
  sessions: RehearsalSession[];
  totalPrepMinutes: number;
  warnings: string[];
}

export interface RehearseOptions {
  /** Event date as ISO string (YYYY-MM-DD) or Date */
  eventDate: string;
  /** Talk duration in minutes */
  duration: number;
  /** Include live-coding failure drills */
  liveCoding?: boolean;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function generateRehearsalPlan(options: RehearseOptions): RehearsePlanResult {
  const { duration, liveCoding = false } = options;
  const eventDate = new Date(options.eventDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const warnings: string[] = [];
  const daysAvailable = daysBetween(today, eventDate);

  if (daysAvailable < 3) {
    warnings.push(`Only ${daysAvailable} days until event — compressed schedule`);
  }

  const sessions: RehearsalSession[] = [];

  if (daysAvailable >= 14) {
    // Full schedule: 2 weeks out
    sessions.push({
      date: formatDate(addDays(eventDate, -14)),
      daysBefore: 14,
      activity: 'Outline + narrative arc',
      type: 'build',
      description: 'Define thesis, audience model, 3 supporting points, and narrative framework (ABT, 3-act, or 5-beat). Pick the "aha" deep-dive.',
      durationMinutes: Math.max(30, duration * 2),
    });

    sessions.push({
      date: formatDate(addDays(eventDate, -12)),
      daysBefore: 12,
      activity: 'Draft presentation script',
      type: 'build',
      description: 'Write all OPEN + SAY pairs. Assign time budgets. Build the Quick Reference sequence.',
      durationMinutes: Math.max(60, duration * 3),
    });

    sessions.push({
      date: formatDate(addDays(eventDate, -10)),
      daysBefore: 10,
      activity: 'Record golden-path fallback',
      type: 'build',
      description: 'Screen-record the full demo flow end-to-end on a clean environment. This becomes the backup.',
      durationMinutes: Math.max(30, duration * 1.5),
    });

    // Spaced practice sessions
    sessions.push({
      date: formatDate(addDays(eventDate, -7)),
      daysBefore: 7,
      activity: 'Rehearsal 1: slow walkthrough + notes',
      type: 'practice',
      description: 'Read through the full script slowly. Mark awkward transitions, missing context, and pacing issues. Fix as you go.',
      durationMinutes: Math.max(30, duration * 2),
    });

    sessions.push({
      date: formatDate(addDays(eventDate, -5)),
      daysBefore: 5,
      activity: 'Rehearsal 2: timed run with pauses',
      type: 'practice',
      description: 'Deliver start-to-end with a timer. Pause after each section to note where you ran long. Target: within 10% of time budget.',
      durationMinutes: Math.max(30, duration * 1.5),
    });

    sessions.push({
      date: formatDate(addDays(eventDate, -3)),
      daysBefore: 3,
      activity: 'Rehearsal 3: no-notes retrieval run',
      type: 'practice',
      description: 'Deliver without reading the script. Retrieval practice strengthens memory better than rereading. Note gaps, then fix.',
      durationMinutes: Math.max(30, duration * 1.5),
    });

    if (liveCoding) {
      sessions.push({
        date: formatDate(addDays(eventDate, -2)),
        daysBefore: 2,
        activity: 'Rehearsal 4: failure drills',
        type: 'practice',
        description: 'Intentionally break the top 3 demo failure modes. Practice: narrate intent → show logs briefly → pivot to recorded clip → resume narrative.',
        durationMinutes: Math.max(20, duration),
      });
    }

    sessions.push({
      date: formatDate(addDays(eventDate, -1)),
      daysBefore: 1,
      activity: 'Fix pacing + cut list',
      type: 'finalize',
      description: 'Review timing data from rehearsals. Cut or compress sections that consistently run long. Protect the "aha" section.',
      durationMinutes: 30,
    });

    sessions.push({
      date: formatDate(addDays(eventDate, -1)),
      daysBefore: 1,
      activity: 'Final dress rehearsal (full stack)',
      type: 'finalize',
      description: 'Full run with real screen-share setup, microphone, camera, and meeting platform. Run the pre-flight checklist.',
      durationMinutes: Math.max(30, duration * 1.5),
    });
  } else if (daysAvailable >= 5) {
    // Compressed: 5-13 days
    sessions.push({
      date: formatDate(addDays(eventDate, -Math.min(daysAvailable, 5))),
      daysBefore: Math.min(daysAvailable, 5),
      activity: 'Outline + draft script',
      type: 'build',
      description: 'Define thesis, narrative arc, and write all OPEN + SAY pairs in one session.',
      durationMinutes: Math.max(60, duration * 3),
    });

    sessions.push({
      date: formatDate(addDays(eventDate, -Math.min(daysAvailable - 1, 3))),
      daysBefore: Math.min(daysAvailable - 1, 3),
      activity: 'Timed rehearsal + golden-path recording',
      type: 'practice',
      description: 'Deliver with timer. Record the golden path as fallback during this run.',
      durationMinutes: Math.max(30, duration * 2),
    });

    sessions.push({
      date: formatDate(addDays(eventDate, -1)),
      daysBefore: 1,
      activity: 'Final dress rehearsal',
      type: 'finalize',
      description: 'Full run with real setup. Fix pacing. Run pre-flight checklist.',
      durationMinutes: Math.max(30, duration * 1.5),
    });
  } else {
    // Emergency: < 5 days
    warnings.push('Emergency timeline — focus on golden-path recording and one timed run');

    sessions.push({
      date: formatDate(today),
      daysBefore: daysAvailable,
      activity: 'Rapid outline + golden-path recording',
      type: 'build',
      description: 'Outline the talk and immediately record the golden-path demo as primary fallback.',
      durationMinutes: Math.max(60, duration * 3),
    });

    if (daysAvailable >= 2) {
      sessions.push({
        date: formatDate(addDays(eventDate, -1)),
        daysBefore: 1,
        activity: 'One timed dress rehearsal',
        type: 'finalize',
        description: 'Single full run. Fix only critical pacing issues. Trust the recording as backup.',
        durationMinutes: Math.max(30, duration * 1.5),
      });
    }
  }

  // Remove sessions scheduled in the past
  const filtered = sessions.filter((s) => new Date(s.date + 'T00:00:00') >= today);
  if (filtered.length < sessions.length) {
    warnings.push(`${sessions.length - filtered.length} session(s) would fall in the past and were skipped`);
  }

  const totalPrep = filtered.reduce((sum, s) => sum + s.durationMinutes, 0);

  return {
    eventDate: formatDate(eventDate),
    talkDurationMinutes: duration,
    sessions: filtered,
    totalPrepMinutes: totalPrep,
    warnings,
  };
}
