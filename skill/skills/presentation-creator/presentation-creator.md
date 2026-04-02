---
name: presentation-creator
description: "Create code walk-through presentation scripts with file:line references and speaker notes. Produces a structured outline where each talking point opens a specific file at a specific line with exact words to say. Use when the user mentions: presentation, talk, demo script, walk-through, slide deck, speaking outline, tech talk, show and tell, or wants to present a codebase or feature to an audience."
---

# Code Walk-Through Presentation Creator

Create presentation scripts that guide a speaker through opening files at specific lines in their editor while narrating with prepared speaker notes. The output is a single markdown document that serves as both teleprompter and file-navigation checklist.

---

## Output Format

{{include:common/output-format.md}}

---

## Workflow

### Step 1: Understand the Subject

Ask or infer:

| Question | Why It Matters |
|----------|---------------|
| What is the feature/system being presented? | Scopes the file exploration |
| Who is the audience? (team, org, conference) | Sets jargon level and depth |
| How long is the talk? | Drives section count and pacing |
| What's the narrative arc? | "What, why, how" vs "problem, solution, demo" vs custom |
| Any must-hit talking points? | Ensures nothing is missed |
| Is there a voice guide or writing style to match? | Keeps SAY blocks consistent with how the speaker actually talks |

### Step 2: Explore the Codebase

Read the relevant source files thoroughly. For each file:
- Note the exact line numbers of key code (declarations, config, entry points, critical logic)
- Identify the "aha" lines -- the ones that make the audience understand
- Find connections between files (imports, state passing, composition patterns)

**Depth matters.** Read every file you might reference. Shallow exploration produces shallow presentations. The speaker notes must reference specific lines, so you need to know what's on them.

**Go past the surface layer.** Config files, manifests, and READMEs are necessary but not sufficient. Drop into implementation source code (the TypeScript, Python, Rust, etc.) to show the audience the real logic. A presentation that only shows config and markdown reads like a sales pitch; one that shows the algorithm behind the config reads like a peer teaching a peer.

### Step 3: Build the Narrative Arc

{{include:domain/narrative-patterns.md}}

### Step 4: Pacing and Time Budgets

{{include:domain/pacing-calibration.md}}

### Step 5: Write the OPEN + SAY Pairs

For each talking point:

1. **Pick the file and lines.** Choose the smallest line range that shows the point. Avoid opening a 200-line file when 10 lines tell the story.

2. **Write the SAY block(s).** Must be:
   - Full sentences in quotes, not bullet points
   - Speakable aloud without sounding robotic
   - Reference specific line numbers ("Line 14 is where...")
   - Include transitions between files ("Now let's look at how this gets used...")
   - Explain WHY, not just WHAT -- the audience can read the code
   - Use multiple consecutive SAY blocks after one OPEN to create natural beats and pauses within a complex point
   - Never describe what's visible on screen; explain what's *behind* it (see Screen/Speaker Complementarity)

3. **Maintain flow.** Minimize file-jumping. Group related files together. When you must jump, use a SAY transition.

### Step 6: Add the Quick Reference

At the end of the document, include a numbered list of every file:line in order. This lets the speaker pre-open tabs or practice the navigation flow.

```markdown
## File Open Sequence (Quick Reference)

1. `path/to/first-file.md:1`
2. `path/to/first-file.md:45`
3. `path/to/second-file.ts:12`
...
```

---

## Screen/Speaker Complementarity

{{include:domain/screen-speaker.md}}

---

## SAY Block Guidelines

{{include:common/say-block-guidelines.md}}

---

## Voice Guide Integration

{{include:domain/voice-guide.md}}
