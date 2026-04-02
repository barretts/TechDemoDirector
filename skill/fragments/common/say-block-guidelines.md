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
