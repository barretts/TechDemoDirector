---
name: presentation-creator
description: Create code walk-through presentation scripts with file:line OPEN directives and SAY speaker notes. Use for presentations, tech talks, demo scripts, speaking outlines, or show-and-tell sessions.
---

# Presentation Creator

This is the Codex platform wrapper. The canonical skill lives in the shared skill directory.

## Routing

Read these files in order:

1. `presentation-creator/SKILL.md` -- workflow steps, output format, pacing calibration, and constraints

## Voice Guide

When creating presentations, if the user provides a voice guide or writing style:

- Read it before writing any SAY blocks
- Adapt cadence and vocabulary to the spoken medium
- Preserve register and named anti-patterns

If the user does not specify, default to conversational technical -- senior engineer explaining something to a peer over coffee.

## Boundaries

This wrapper MUST NOT redefine the output format, workflow, or pacing rules. The skill (`SKILL.md`) is the single source of truth.
