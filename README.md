# tech-demo-director

TechDemoDirector publishes an installable, prebuilt `demo-director` CLI runtime and generated tech-demo presentation skills for AI coding tools.

This `main` branch is the stable static release branch. Source development happens on `dev`.

## Install

Run the one-line installer:

```bash
bash <(curl -fsSL https://barretts.github.io/TechDemoDirector/install.sh) --all
```

```powershell
& ([scriptblock]::Create((irm https://barretts.github.io/TechDemoDirector/install.ps1))) -All
```

Or clone the static release and run setup locally:

```bash
git clone https://github.com/barretts/TechDemoDirector.git
cd TechDemoDirector
bash install.sh --all
```

```powershell
git clone https://github.com/barretts/TechDemoDirector.git
cd TechDemoDirector
.\install.ps1 -All
```

## CLI

Run:

```bash
node dist/cli/index.js --help
```

After setup:

```bash
demo-director --help
```

## Installer Flags

- `--skills-only` / `-SkillsOnly` copies skills from `compiled/` without linking the CLI.
- `--compile-only` / `-CompileOnly` is for the source `dev` branch and fails on static `main`.
- `--uninstall` / `-Uninstall` removes installed skill artifacts and unlinks the CLI.
- `--all` / `-All` installs for Claude, Cursor, Windsurf, OpenCode, and Codex.

## Branches

- `main`: static release branch with `dist/`, `compiled/`, installers, public docs, and site files.
- `dev`: canonical source branch with `src/`, `skill/`, TypeScript config, compiler, and development tooling.

To modify CLI source, skill source, fragments, compiler behavior, or release automation, branch from `dev`.

## What It Does

Given a codebase and a talk description, the skill produces a single markdown document that serves as both teleprompter and file-navigation checklist. Each talking point pairs an `**OPEN**` directive (file path + line range) with `**SAY:**` blocks.

## Included Release Artifacts

- `dist/`
- `compiled/claude/`
- `compiled/cursor/`
- `compiled/windsurf/`
- `compiled/opencode/`
- `compiled/codex/`
- `install.sh`
- `install.ps1`
- `site/`
- `docs/`
- `contributions/`

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

## Ecosystem

TechDemoDirector is built on the skill-system-template architecture from [Agentic Skill Mill](https://github.com/barretts/AgenticSkillMill). Related projects:

| Project | Role | Links |
|---------|------|-------|
| **[Agentic Skill Mill](https://github.com/barretts/AgenticSkillMill)** | Parent — defines the fragment-composition, 7-target compiler, and companion-CLI pattern | [agenticskillmill.com](https://agenticskillmill.com) |
| **[AgentThreader](https://github.com/barretts/AgentThreader)** | Sibling — manifest-driven agentic CLI orchestration with contracts and self-healing | [agentthreader.com](https://agentthreader.com) |
| **[AgentHistoric](https://github.com/barretts/AgentHistoric)** | Sibling — MoE persona prompt system with philosophical grounding | [agenthistoric.com](https://agenthistoric.com) |

## License

MIT. See [LICENSE](./LICENSE).
