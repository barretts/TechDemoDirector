# Translation Map (Codex, Cursor, Claude, Windsurf)

Use this map to port the presentation-creator skill to different platform surfaces without changing the core workflow.

## Invariant Layer (Never Change)

- Output format: `**OPEN**` + `**SAY:**` structure
- Six-step workflow (understand, explore, build arc, budget time, write pairs, quick reference)
- Pacing calibration table
- Screen/speaker complementarity rules
- SAY block guidelines and anti-patterns
- Trim/protect guidance requirements
- Voice guide integration rules
- Constraints (real files, real line numbers, self-contained document)

## Variable Layer (Platform Wrapper Only)

- How the skill is invoked (slash command, auto-attach rule, workflow trigger, agent mention)
- Where the skill file is located on disk
- Approval or confirmation handling
- Platform-specific UX wording

## Key Format Elements

- File reference: `**OPEN** \`path/to/file.ext:startLine-endLine\``
- Speaker notes: `**SAY:** "Full sentences in quotes"`
- Quick reference: numbered `path:line` list at end of document

Do not rename format directives per platform.

## Porting Checklist

1. Keep the output format byte-identical across platforms.
2. Keep the six-step workflow behavior-identical.
3. Swap only the invocation mechanism and skill discovery path.
4. Keep the same pacing calibration and time budget rules.
5. Keep voice guide integration rules intact.
