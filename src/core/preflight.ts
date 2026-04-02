/**
 * Pre-call readiness checklist generator.
 *
 * Produces a structured checklist based on talk parameters,
 * drawing from research-backed requirements (audio quality,
 * screen-share mode, captions, notification suppression, etc.).
 */

export interface PreflightOptions {
  /** Is this a remote/video-call presentation? */
  remote?: boolean;
  /** Does the talk include live coding or terminal demos? */
  liveCoding?: boolean;
  /** Duration in minutes */
  duration?: number;
  /** Audience type */
  audience?: 'technical' | 'mixed' | 'non-technical';
  /** Will the presentation be recorded? */
  recorded?: boolean;
}

export interface ChecklistItem {
  category: 'content' | 'tech' | 'privacy' | 'delivery' | 'fallback';
  item: string;
  priority: 'required' | 'recommended' | 'optional';
  rationale: string;
}

export interface PreflightResult {
  checklist: ChecklistItem[];
  summary: Record<string, number>;
}

export function generatePreflight(options: PreflightOptions = {}): PreflightResult {
  const {
    remote = true,
    liveCoding = false,
    duration = 25,
    audience = 'technical',
    recorded = false,
  } = options;

  const checklist: ChecklistItem[] = [];

  // --- Content readiness ---
  checklist.push({
    category: 'content',
    item: 'Audience model written: what they know, what they don\'t',
    priority: 'required',
    rationale: 'Curse-of-knowledge guardrail — experts systematically underestimate what novices don\'t know',
  });

  checklist.push({
    category: 'content',
    item: 'One-sentence thesis and 3 supporting points defined',
    priority: 'required',
    rationale: 'Chunking — working memory can only handle a small number of active items',
  });

  checklist.push({
    category: 'content',
    item: 'Demo "golden path" verified on clean environment',
    priority: 'required',
    rationale: 'Eliminates ad-hoc environment failures that erode trust',
  });

  checklist.push({
    category: 'content',
    item: 'One "aha" deep-dive selected; everything else is supporting',
    priority: 'required',
    rationale: 'Audiences retain one key insight; competing deep-dives dilute impact',
  });

  if (audience !== 'technical') {
    checklist.push({
      category: 'content',
      item: 'Technical jargon replaced with functional definitions',
      priority: 'required',
      rationale: 'Stating what an acronym stands for is not defining it — define functionally',
    });
  }

  if (duration > 20) {
    checklist.push({
      category: 'content',
      item: `Attention resets planned every 3-5 minutes (${Math.floor(duration / 4)} needed)`,
      priority: 'recommended',
      rationale: 'Limited-capacity principles and segmenting guidance from multimedia learning research',
    });
  }

  // --- Tech readiness ---
  if (remote) {
    checklist.push({
      category: 'tech',
      item: 'External microphone tested: record 10s and listen for tinny/hollow quality',
      priority: 'required',
      rationale: 'Degraded audio reduces perceived intelligence and credibility (PNAS research)',
    });

    checklist.push({
      category: 'tech',
      item: 'Screen-share mode: share window or portion, not full desktop',
      priority: 'required',
      rationale: 'Reduces accidental disclosure of sensitive information',
    });

    checklist.push({
      category: 'tech',
      item: 'Captions/transcription enabled on meeting platform',
      priority: 'recommended',
      rationale: 'Accessibility — supports non-native speakers and hearing-impaired attendees',
    });

    checklist.push({
      category: 'tech',
      item: 'Hardwired ethernet connection (avoid Wi-Fi)',
      priority: 'recommended',
      rationale: 'Eliminates packet jitter; keeps latency below 150ms for conversational flow',
    });
  }

  if (liveCoding) {
    checklist.push({
      category: 'tech',
      item: 'IDE font size >= 15, monospaced font (e.g. Consolas)',
      priority: 'required',
      rationale: 'Video compression degrades small/thin fonts — minimum 15pt for legibility',
    });

    checklist.push({
      category: 'tech',
      item: 'IDE stripped of extraneous toolbars, plugins, custom themes',
      priority: 'recommended',
      rationale: 'Low-contrast dark themes with esoteric highlighting fail through video compression',
    });

    checklist.push({
      category: 'tech',
      item: 'Cursor highlighting tool active (spotlight or click animator)',
      priority: 'recommended',
      rationale: 'Prevents erratic cursor movement from pulling audience focus away from content',
    });
  }

  if (recorded) {
    checklist.push({
      category: 'tech',
      item: 'System clock hidden in taskbar',
      priority: 'recommended',
      rationale: 'Visible time jumps during post-production edits break continuity',
    });
  }

  // --- Privacy readiness ---
  checklist.push({
    category: 'privacy',
    item: 'Do Not Disturb enabled at OS level; notification suppression active',
    priority: 'required',
    rationale: 'Stray notifications destroy professional atmosphere and pose data privacy risk',
  });

  checklist.push({
    category: 'privacy',
    item: 'Secrets removed from screen: API keys, tokens, emails, personal messages',
    priority: 'required',
    rationale: 'Screen-share leaks are professional failures with potential security impact',
  });

  if (liveCoding) {
    checklist.push({
      category: 'privacy',
      item: 'Browser using clean profile with cleared history/cache',
      priority: 'required',
      rationale: 'Prevents inappropriate autocomplete suggestions in URL bar',
    });
  }

  // --- Delivery readiness ---
  if (remote) {
    checklist.push({
      category: 'delivery',
      item: 'Camera at eye level; gallery view positioned near webcam lens',
      priority: 'recommended',
      rationale: 'Simulates eye contact — looking down at screen breaks the illusion for viewers',
    });

    checklist.push({
      category: 'delivery',
      item: 'Standing desk or elevated laptop for open airway and vocal energy',
      priority: 'optional',
      rationale: 'Slumped posture compresses diaphragm, leading to weak monotone delivery',
    });
  }

  checklist.push({
    category: 'delivery',
    item: 'Opening statement rehearsed: thesis + agenda + interaction rules',
    priority: 'required',
    rationale: 'Sets schema, reduces audience uncertainty, and establishes interactive norms',
  });

  // --- Fallback readiness ---
  if (liveCoding) {
    checklist.push({
      category: 'fallback',
      item: 'Recorded "golden path" clip ready as backup',
      priority: 'required',
      rationale: 'Hybrid approach: recorded for risky paths, live for small self-contained changes',
    });

    checklist.push({
      category: 'fallback',
      item: 'Checkpoint states prepared: prebuilt branches, prewarmed containers, cached artifacts',
      priority: 'recommended',
      rationale: 'One-click reset strategy minimizes panic during live-demo failures',
    });

    checklist.push({
      category: 'fallback',
      item: 'Failure narration planned: intent → logs → pivot to recording → resume',
      priority: 'recommended',
      rationale: 'Pre-planned failure response prevents live-demo failures from hijacking the session',
    });
  }

  // Summary counts by category
  const summary: Record<string, number> = {};
  for (const item of checklist) {
    summary[item.category] = (summary[item.category] || 0) + 1;
  }

  return { checklist, summary };
}
