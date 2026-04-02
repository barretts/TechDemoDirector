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
