The screen and the speaker's words must reinforce each other without one simply narrating the other.

**The screen** shows the code. The audience can read it. They can see the function name, the variable, the structure.

**The speaker** explains what the code *means*: why it exists, what trade-off it represents, what went wrong before this line was written, what would break if you changed it.

A SAY block that describes what's visible on screen ("This file contains the scan logic") is wasted breath. A SAY block that explains what you can't see ("This heuristic exists because the original version picked 5 moderate CVEs over 3 high ones") earns its time.

**Practical test:** If the speaker went silent and the audience only saw the file, would they lose critical context? If yes, the SAY block is doing its job. If the speaker could be replaced by reading the file aloud, the SAY block needs to be rewritten.

**Pacing implication:** After an OPEN, give the audience 2-3 seconds of silence to scan the code before speaking. The SAY block should begin with the insight, not with orienting ("So here we have..."). The file on screen does the orienting.
