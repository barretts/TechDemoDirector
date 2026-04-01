---
description: Create code walk-through presentation scripts with file:line OPEN directives and SAY speaker notes. Use when the user mentions presentation, talk, demo script, walk-through, slide deck, speaking outline, tech talk, show and tell, or wants to present a codebase or feature to an audience.
---

# Presentation Creator

This workflow creates code walk-through presentation scripts following the **Presentation Creator** skill specification.

Read the canonical skill before generating any presentation:

1. Read `presentation-creator/SKILL.md` for the output format, six-step workflow, pacing calibration, and constraints.

## Routing

Use this workflow for requests involving:

- code walk-through presentations or tech talks
- demo scripts that open files at specific lines with speaker notes
- speaking outlines for teams, orgs, or conferences
- show-and-tell preparation for a codebase or feature

## Voice Guide

If the user provides a voice guide or writing style reference:

- Read it before writing any SAY blocks
- Adapt cadence and vocabulary to the spoken medium
- Preserve register and named anti-patterns

If no voice guide is provided, default to conversational technical -- senior engineer explaining something to a peer over coffee.

## Output Contract

Every presentation script uses `**OPEN**` directives with `path/to/file.ext:startLine-endLine` and `**SAY:**` blocks with full quoted sentences. The document serves as both teleprompter and file-navigation checklist.

## Boundaries

- The skill (`SKILL.md`) is the single source of truth. Do not redefine the output format or workflow here.
- Keep this workflow file as a thin routing layer only.
