# presentation-creator

Portable skill for AI coding tools that creates code walk-through presentation scripts with file:line OPEN directives and speaker notes.

## What This Repo Contains

- `skill/SKILL.md` -- canonical skill entrypoint (output format, six-step workflow, pacing, constraints)
- `platforms/` -- thin translation layers for Cursor, Claude, Windsurf, Codex, and OpenCode
- `install.sh` -- multi-platform installer

## Install

```bash
bash install.sh
```

No flags auto-detects which tools are installed. Target a specific tool:

```bash
bash install.sh --cursor
bash install.sh --claude
bash install.sh --windsurf
bash install.sh --opencode
bash install.sh --codex
bash install.sh --all
```

Uninstall:

```bash
bash install.sh --uninstall
bash install.sh --cursor --uninstall
```

## What It Does

Given a codebase and a talk description, the skill produces a single markdown document that serves as both teleprompter and file-navigation checklist. Each talking point pairs an `**OPEN**` directive (file path + line range) with `**SAY:**` blocks (full sentences the speaker reads aloud).

The six-step workflow:

1. Understand the subject (audience, duration, narrative arc, voice guide)
2. Explore the codebase (read files, note exact line numbers, find "aha" lines)
3. Build the narrative arc (four pre-built patterns or custom)
4. Assign time budgets (with trim/protect guidance)
5. Write the OPEN + SAY pairs
6. Add the quick reference (numbered file:line list)

## Core Design

The skill is a single markdown document that any AI coding tool can consume. Platform wrappers are thin routing layers that point the tool at the canonical skill without redefining the workflow or output format.

## License

MIT. See [LICENSE](./LICENSE).
