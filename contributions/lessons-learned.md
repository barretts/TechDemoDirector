# Lessons Learned

Field observations from real runs. Each lesson is captured by the `/learn` skill
and applied back to fragments/skills by the `/apply` skill.

## Format

Each lesson follows this structure:

```markdown
### <Title>

- **Date:** YYYY-MM-DD
- **Reporter:** <agent or human>
- **Skill:** <which skill was running>
- **Severity:** bug | improvement | insight
- **Context:** <what was happening when this was observed>

#### Observation

<What happened, why it was wrong or suboptimal.>

#### Suggested Fix

<What should change in which fragment or skill.>

- **Applied:** <date> -- <what changed>
```

---

<!-- Add lessons below this line -->

### OpenCode `tools` Field Deprecated in Favor of `permission`

- **Date:** 2026-04-15
- **Reporter:** agent (Cascade + OpenCode)
- **Skill:** tech-demo-director
- **Severity:** bug
- **Context:** OpenCode agent configuration files compiled with `tools: bash, read, write, edit, list, glob, grep` failed validation at load time.

#### Observation

OpenCode deprecated the `tools` frontmatter field. Agents configured with it received: `Invalid input: expected record, received string tools`. The old format was a comma-separated string; the new `permission` field requires a YAML object with explicit allow/deny per capability.

#### Suggested Fix

Compiler should emit `permission` as a nested YAML object instead of `tools` as a flat string. The three relevant permissions are `bash`, `edit`, and `webfetch`.

- **Applied:** 2026-04-15 -- `compile.mjs` already used `permission` in code; stale JSDoc comment on line 140 updated to match.
