# tech-demo-director

Code walk-through presentation skill + companion CLI for AI coding tools. Skills are markdown prompt files composed from shared fragments and compiled to 7 IDE-specific formats.

## Quick Start

```bash
# Install dependencies, build CLI, compile skills, install for detected tools
bash install.sh

# Or target specific tools
bash install.sh --claude
bash install.sh --all

# Uninstall
bash install.sh --uninstall
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

## Architecture

```
Skills (what to do)          CLI Utility (tools to do it with)
  skill/skills/*.md            src/cli/commands/*.ts
  skill/fragments/*.md         src/core/*.ts
          |                            |
          v                            v
  compiled/ (7 IDE formats)    dist/ (npm link -> global CLI)
          |                            |
          +---------> Agent <----------+
```

**Skills** are step-by-step runbooks that agents follow. They reference the CLI by name.

**Fragments** are shared knowledge blocks included by multiple skills via `{{include:...}}` markers. Edit a fragment once, recompile, and every skill gets the update.

**The CLI** (`demo-director`) provides structured JSON commands that skills invoke.

## Project Layout

```
skill/
  build/
    manifest.json       # Declares skills, fragment deps, compilation targets
    compile.mjs         # Compiler: resolves includes, transforms frontmatter
  fragments/
    common/             # Shared rules (output format, SAY block guidelines)
    domain/             # Deep domain knowledge (pacing, voice, narrative patterns)
  skills/
    tech-demo-director/     # The main skill source

src/                    # Companion CLI (TypeScript)
  cli/                  # Commander entry point + commands
  core/                 # Domain logic modules
  cache/                # Two-tier cache (memory + disk)
  errors/               # Typed error hierarchy

compiled/               # Machine-generated, one subdir per IDE target
contributions/          # Field observations from real runs
docs/                   # Research artifacts and reference material
```

## How to Add a Skill

1. Create the source at `skill/skills/<name>/<name>.md` with YAML frontmatter and `{{include:...}}` markers.
2. Register it in `skill/build/manifest.json`.
3. Add the skill name to the `SKILLS` array in `install.sh`.
4. Compile: `npm run compile`

## How to Add a Fragment

1. Create at `skill/fragments/<category>/<name>.md` (no frontmatter).
2. Include in skills with `{{include:<category>/<name>.md}}`.
3. Declare in `manifest.json` under each skill's `fragments` array.

## Development

```bash
npm install              # Install dependencies
npm run build            # Build TypeScript CLI
npm run compile          # Compile skills to all 7 IDE targets
npm run compile:validate # Validate without writing output
npm run compile:watch    # Recompile on change
npm run test             # Run tests
npm run typecheck        # Type-check without emitting
```

## Compilation Targets

| Target | Output path |
|--------|------------|
| `claude` | `compiled/claude/<skill>/SKILL.md` |
| `cursor-rules` | `compiled/cursor/rules/<skill>.mdc` |
| `cursor-skills` | `compiled/cursor/skills/<skill>/SKILL.md` |
| `windsurf-rules` | `compiled/windsurf/rules/<skill>.md` |
| `windsurf-skills` | `compiled/windsurf/skills/<skill>/SKILL.md` |
| `opencode` | `compiled/opencode/<skill>.md` |
| `codex` | `compiled/codex/<skill>/SKILL.md` |

## License

MIT. See [LICENSE](./LICENSE).
