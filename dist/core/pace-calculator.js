/**
 * Time budget calculator for presentations.
 *
 * Given a total duration and section definitions, computes per-section
 * time allocations with trim/protect guidance.
 */
export function calculatePace(options) {
    const { duration, sections, bufferFraction = 0.1, wpm = 130, } = options;
    const warnings = [];
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
        warnings.push(`Fixed-duration sections (${fixedTotal} min) exceed available time (${available} min after buffer)`);
    }
    const totalWeight = weightedSections.reduce((sum, s) => sum + (s.weight ?? 1), 0);
    const budgets = sections.map((section) => {
        let minutes;
        if (section.fixedMinutes !== undefined) {
            minutes = section.fixedMinutes;
        }
        else if (totalWeight > 0) {
            minutes = Math.round(((section.weight ?? 1) / totalWeight) * Math.max(0, remainingForWeighted) * 10) / 10;
        }
        else {
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
        warnings.push(`Allocated ${allocatedTotal} min + ${bufferMinutes} min buffer = ${allocatedTotal + bufferMinutes} min (target: ${duration} min)`);
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
//# sourceMappingURL=pace-calculator.js.map