# Presentation Creator

Create code walk-through presentation scripts with file:line OPEN directives and SAY speaker notes.

## Trigger

Use when the user needs to:

- Build a presentation script for a code walk-through or tech talk
- Create a demo script that guides a speaker through opening files at specific lines
- Generate speaker notes paired with file navigation for a live coding demo
- Prepare a show-and-tell, speaking outline, or conference talk

## Routing

This is the Claude platform wrapper. The canonical skill lives in the shared skill directory.

Read these files in order:

1. `presentation-creator/SKILL.md` -- workflow steps, output format, pacing calibration, and constraints

## Voice Guide

If the user provides a voice guide or writing style reference:

- Read it before writing any SAY blocks
- Adapt cadence and vocabulary to the spoken medium
- Preserve register and named anti-patterns from the guide

If no voice guide is provided, default to conversational technical -- senior engineer explaining something to a peer over coffee.

## Boundaries

This wrapper MUST NOT redefine the output format, workflow, or pacing rules. The skill (`SKILL.md`) is the single source of truth.
