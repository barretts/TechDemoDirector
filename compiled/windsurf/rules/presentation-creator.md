---
managed_by: presentation-creator
trigger: manual
description: "\"Create code walk-through presentation scripts with file:line references and speaker notes. Produces a structured outline where each talking point opens a specific file at a specific line with exact words to say. Use when the user mentions: presentation, talk, demo script, walk-through, slide deck, speaking outline, tech talk, show and tell, or wants to present a codebase or feature to an audience.\""
---

# Code Walk-Through Presentation Creator

Create presentation scripts that guide a speaker through opening files at specific lines in their editor while narrating with prepared speaker notes. The output is a single markdown document that serves as both teleprompter and file-navigation checklist.

---

## Output Format

Every presentation uses this structure:

```markdown
# <Title> -- <Duration>-Minute Presentation Script

Each section tells you which file to open, which lines to highlight, and what to say.

---

## 1. Section Name (N min)

### 1a. Sub-topic

**OPEN** `path/to/file.ext:startLine-endLine`

**SAY:** "What to tell the audience while this file is on screen. Reference specific line numbers. Point out the key insight."

### 1b. Next sub-topic

**OPEN** `another/file.ext:lineNumber`

**SAY:** "Transition naturally from the previous point..."
```

**Rules for the format:**
- `**OPEN**` always uses relative paths from the project root
- Line ranges use `startLine-endLine`; single lines use just the number
- `**SAY:**` blocks are full sentences in quotes -- speakable, not bullet points
- SAY blocks reference specific line numbers shown in the open file ("Line 42 is the key...")
- Multiple consecutive SAY blocks after a single OPEN are encouraged -- they create natural pauses and let the speaker break a complex point into beats
- Sections without a file open (intro, wrap-up, recap lists) skip the OPEN directive

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

Structure the presentation using one of these patterns (or a custom one the user specifies):

**Pattern A: "What, Install, Deep Dive"** (feature/tool presentations)
1. What is it? (high-level, show the entry point)
2. How to get it (install, setup, config)
3. Walk through the main flow step by step
4. Wrap-up (recap value, what's next)

**Pattern B: "Problem, Architecture, Walk-Through"** (system design talks)
1. The problem we're solving
2. Architecture overview (show the key abstractions)
3. Walk through a request/flow end-to-end
4. Edge cases and guardrails
5. Wrap-up

**Pattern C: "Before/After"** (refactoring, migration, improvement talks)
1. The old way (show pain points)
2. The new approach (show the design)
3. Walk through the changes
4. Results and metrics
5. Wrap-up

**Pattern D: "Pain, Pipeline, Proof"** (internal tool demos for peers)
1. The shared pain (the audience already knows the problem; name it, don't explain it)
2. The core insight that makes the tool possible (one technical "aha")
3. Walk through the pipeline/flow end-to-end, deepest dive on the hardest part
4. Architecture and design decisions (why it's built this way)
5. Evidence it works (real bugs found, real lessons learned, production stories)
6. Wrap-up (one command, what's next)

Pattern D works best when the audience already lives with the problem and you're showing them a solution. Lead with empathy, not features.

### Step 4: Pacing and Time Budgets

### Assign Time Budgets

| Talk Length | Sections | Avg per Section |
|-------------|----------|-----------------|
| 10 min | 4-5 | 2 min |
| 15 min | 5-7 | 2-2.5 min |
| 25 min | 8-12 | 2-3 min |
| 45 min | 12-18 | 2.5-3.5 min |

Rules of thumb:
- Intro and wrap-up: 1-2 min each regardless of talk length
- Deep-dive sections get 3-5 min
- Overview/context sections get 1-2 min
- Budget 10% over and note what to trim -- talks always run long

### Pacing Calibration

Rough estimates for calibrating section length:

| Content Type | Lines of SAY | Approx Duration |
|-------------|-------------|-----------------|
| Single OPEN + SAY | 3-4 sentences | 30-45 sec |
| Sub-section (2-3 OPEN+SAY) | 8-12 sentences | 1.5-2 min |
| Deep-dive section (4-6 OPEN+SAY) | 15-25 sentences | 3-5 min |

A 25-minute talk typically has 30-45 OPEN directives total.

### Time Budget Table

Always include a time budget table near the end:

```markdown
## Time Budget

| Section | Minutes |
|---------|---------|
| 1. Intro | 1 |
| 2. What Is It | 3 |
| ... | ... |
| **Total** | **N min** |
```

If the total exceeds the target, add a note identifying which sections to trim and which are untouchable.

**Trim and protect guidance is mandatory.** Every presentation must include:
- **Protected sections:** Name 2-3 sections that are the core of the talk and should never be cut. These are the sections the audience will remember.
- **Trim targets:** Name 2-3 sections that can be compressed to a single sentence or cut entirely without breaking the narrative arc. Explain how much time each trim saves.
- **If running long:** Which sections to abbreviate first (the screen can carry the weight if the speaker shortens the narration).
- **If running tight:** Which sections can absorb extra time if the talk is finishing early (usually the deep-dive section or Q&A).

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

The screen and the speaker's words must reinforce each other without one simply narrating the other.

**The screen** shows the code. The audience can read it. They can see the function name, the variable, the structure.

**The speaker** explains what the code *means*: why it exists, what trade-off it represents, what went wrong before this line was written, what would break if you changed it.

A SAY block that describes what's visible on screen ("This file contains the scan logic") is wasted breath. A SAY block that explains what you can't see ("This heuristic exists because the original version picked 5 moderate CVEs over 3 high ones") earns its time.

**Practical test:** If the speaker went silent and the audience only saw the file, would they lose critical context? If yes, the SAY block is doing its job. If the speaker could be replaced by reading the file aloud, the SAY block needs to be rewritten.

**Pacing implication:** After an OPEN, give the audience 2-3 seconds of silence to scan the code before speaking. The SAY block should begin with the insight, not with orienting ("So here we have..."). The file on screen does the orienting.

---

## SAY Block Guidelines

**Good SAY blocks:**
- "Line 48 is the key design: state is persisted between phases. Each phase reads the previous phase's state and writes its own. This makes the pipeline resumable -- if Phase 3 fails, you don't re-scan."
- "Here's what detect-pm gives you. Lines 5-10 show the override field path, which syntax is supported. Line 12 says 'Do not hardcode any PM-specific syntax.' The agent uses these values to determine what to write and how."
- "This is the fragment we fixed after the bootstrap-sass incident. Line 2 is the key rule: filter by highest severity tier present."

**Bad SAY blocks:**
- "This file contains the scan logic." (too vague, doesn't reference lines)
- "Here we can see the code that does the scanning." (vacuous)
- "- Detects PM\n- Scans vulns\n- Selects target" (bullet points, not speakable)

**Transition patterns:**
- "Now let's see how this gets consumed..."
- "That's the data. Here's the logic that acts on it..."
- "So the scan is done. What happens next?"
- "This is the centerpiece -- the most commands, the most domain knowledge."

**Constraints:**
- Every `**OPEN**` path must be a real file that was read during preparation. Never fabricate paths or line numbers.
- SAY blocks must reference the actual content at the cited lines. If line 42 contains a function declaration, the SAY block should talk about that function.
- Prefer showing source files over generated/compiled output.
- When the same file is opened multiple times, use different line ranges each time (scroll through it, don't repeat).
- The document must be self-contained -- a speaker who reads only this document can deliver the talk without additional prep.

---

## Voice Guide Integration

A presentation sounds wrong when the SAY blocks are written in a generic voice and the speaker talks like a real person. The gap is jarring. If the user provides a voice guide, writing style reference, or system prompt, use it to shape every SAY block.

**How to apply a voice guide:**

1. **Read the guide before writing any SAY blocks.** Internalize the cadence, vocabulary, rhetorical habits, and anti-patterns.
2. **Adapt, don't cosplay.** A presentation has different constraints than a blog post or technical doc. Spoken sentences are shorter. Pauses replace punctuation. Parenthetical asides that work in writing become digressions on stage. Translate the voice to the medium.
3. **Preserve the register.** If the voice is pragmatic and direct, the SAY blocks should be pragmatic and direct. If the voice uses specific technical vocabulary with precision, use it. If the voice avoids marketing language, avoid it.
4. **Preserve the anti-patterns.** If the voice guide says "never use academic transitions" or "no buzzword salad," those rules apply with even more force in a spoken presentation where the audience can't re-read.
5. **Test with the ear, not the eye.** Read SAY blocks aloud. If they sound like someone else wrote them, they need revision.

**When no voice guide is provided:** Default to conversational technical; the voice of a senior engineer explaining something to a peer over coffee. Direct, specific, occasional dry humor, no sales pitch.
