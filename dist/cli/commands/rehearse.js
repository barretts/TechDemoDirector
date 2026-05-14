import { generateRehearsalPlan } from '../../core/rehearse-planner.js';
/**
 * Generate a spaced-practice rehearsal schedule working backward from the event date.
 */
export function rehearseCommand(options) {
    return generateRehearsalPlan({
        eventDate: options.eventDate,
        duration: options.duration,
        liveCoding: options.liveCoding,
    });
}
//# sourceMappingURL=rehearse.js.map