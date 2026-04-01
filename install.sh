#!/usr/bin/env bash
# install.sh -- Register the presentation-creator skill for AI coding tools
# Run from the project root: bash install.sh [--claude] [--cursor] [--windsurf] [--opencode] [--codex] [--all]
# No flags = auto-detect installed tools

set -e

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_NAME="presentation-creator"
SKILL_BUNDLE="$SKILL_DIR/skill"
SKILL_SRC="$SKILL_BUNDLE/SKILL.md"
CURSOR_RULE_SRC="$SKILL_DIR/platforms/cursor/presentation-creator.mdc"
CODEX_AGENT_SRC="$SKILL_DIR/platforms/codex/agents/openai.yaml"

# --- Target directories ---
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"
CURSOR_RULES_DIR="$HOME/.cursor/rules"
CURSOR_SKILLS_DIR="$HOME/.cursor/skills"
WINDSURF_SKILLS_DIR="$HOME/.codeium/windsurf/skills"
OPENCODE_AGENTS_DIR="$HOME/.config/opencode/agents"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
CODEX_SKILLS_DIR="$CODEX_HOME_DIR/skills"

# --- Frontmatter helpers ---

extract_description() {
  local file="$1"
  awk '/^---$/{n++; next} n==1 && /^description:/{sub(/^description: *"?/, ""); sub(/"$/, ""); print; exit}' "$file"
}

strip_frontmatter() {
  local file="$1"
  awk 'BEGIN{n=0} /^---$/{n++; next} n>=2{print}' "$file"
}

# --- Install functions ---

install_claude() {
  local dest_dir="$CLAUDE_SKILLS_DIR/$SKILL_NAME"
  local dest="$dest_dir/SKILL.md"

  mkdir -p "$dest_dir"
  cp "$SKILL_SRC" "$dest"
  echo "    Claude:   $dest"
}

install_cursor() {
  local rule_dest="$CURSOR_RULES_DIR/${SKILL_NAME}.mdc"
  mkdir -p "$CURSOR_RULES_DIR"
  cp "$CURSOR_RULE_SRC" "$rule_dest"
  echo "    Cursor (rule):  $rule_dest"

  local skill_dest_dir="$CURSOR_SKILLS_DIR/$SKILL_NAME"
  mkdir -p "$skill_dest_dir"
  cp "$SKILL_SRC" "$skill_dest_dir/SKILL.md"
  echo "    Cursor (skill): $skill_dest_dir/SKILL.md"
}

install_windsurf() {
  local skill_dest_dir="$WINDSURF_SKILLS_DIR/$SKILL_NAME"
  mkdir -p "$skill_dest_dir"
  cp "$SKILL_SRC" "$skill_dest_dir/SKILL.md"
  echo "    Windsurf: $skill_dest_dir/SKILL.md"
}

install_opencode() {
  local desc
  desc=$(extract_description "$SKILL_SRC")
  local dest="$OPENCODE_AGENTS_DIR/${SKILL_NAME}.md"

  mkdir -p "$OPENCODE_AGENTS_DIR"
  {
    echo "---"
    echo "mode: subagent"
    echo "description: \"$desc\""
    echo "tools: bash, read, write, edit, list, glob, grep"
    echo "---"
    strip_frontmatter "$SKILL_SRC"
  } > "$dest"
  echo "    OpenCode: $dest"
}

install_codex() {
  local dest_dir="$CODEX_SKILLS_DIR/$SKILL_NAME"
  local dest="$dest_dir/SKILL.md"

  mkdir -p "$dest_dir"
  cp "$SKILL_SRC" "$dest"
  mkdir -p "$dest_dir/agents"
  cp "$CODEX_AGENT_SRC" "$dest_dir/agents/openai.yaml"
  echo "    Codex:    $dest"
}

# --- Uninstall functions ---

uninstall_claude() {
  rm -rf "$CLAUDE_SKILLS_DIR/$SKILL_NAME"
  echo "    Claude:   removed"
}

uninstall_cursor() {
  rm -f "$CURSOR_RULES_DIR/${SKILL_NAME}.mdc"
  rm -rf "$CURSOR_SKILLS_DIR/$SKILL_NAME"
  echo "    Cursor:   removed"
}

uninstall_windsurf() {
  rm -rf "$WINDSURF_SKILLS_DIR/$SKILL_NAME"
  echo "    Windsurf: removed"
}

uninstall_opencode() {
  rm -f "$OPENCODE_AGENTS_DIR/${SKILL_NAME}.md"
  echo "    OpenCode: removed"
}

uninstall_codex() {
  rm -rf "$CODEX_SKILLS_DIR/$SKILL_NAME"
  echo "    Codex:    removed"
}

# --- Auto-detection ---

detect_editors() {
  local detected=()
  [[ -d "$HOME/.claude" ]] && detected+=("claude")
  [[ -d "$HOME/.cursor" ]] && detected+=("cursor")
  [[ -d "$HOME/.windsurf" || -d "$HOME/.codeium/windsurf" ]] && detected+=("windsurf")
  [[ -d "$HOME/.config/opencode" || -d "$HOME/.opencode" ]] && detected+=("opencode")
  [[ -n "${CODEX_HOME:-}" || -d "$CODEX_HOME_DIR" ]] && detected+=("codex")
  echo "${detected[@]}"
}

# --- CLI parsing ---

TARGETS=()
DO_UNINSTALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --claude)    TARGETS+=("claude"); shift ;;
    --cursor)    TARGETS+=("cursor"); shift ;;
    --windsurf)  TARGETS+=("windsurf"); shift ;;
    --opencode)  TARGETS+=("opencode"); shift ;;
    --codex)     TARGETS+=("codex"); shift ;;
    --all)       TARGETS=("claude" "cursor" "windsurf" "opencode" "codex"); shift ;;
    --uninstall) DO_UNINSTALL=true; shift ;;
    --help|-h)
      echo "Usage: bash install.sh [options]"
      echo ""
      echo "Options:"
      echo "  --claude       Install skill for Claude Code"
      echo "  --cursor       Install skill for Cursor"
      echo "  --windsurf     Install skill for Windsurf"
      echo "  --opencode     Install skill for OpenCode"
      echo "  --codex        Install skill for Codex"
      echo "  --all          Install for all five tools"
      echo "  --uninstall    Remove installed skill from target tools"
      echo "  -h, --help     Show this help"
      echo ""
      echo "No flags = auto-detect installed tools."
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Run: bash install.sh --help"
      exit 1
      ;;
  esac
done

# Auto-detect if no targets specified
if [[ ${#TARGETS[@]} -eq 0 ]]; then
  read -ra TARGETS <<< "$(detect_editors)"
fi

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  echo "ERROR: No supported tools detected. Use --claude, --cursor, --windsurf, --opencode, or --codex."
  exit 1
fi

# --- Uninstall path ---

if [[ "$DO_UNINSTALL" == true ]]; then
  echo "==> Uninstalling $SKILL_NAME"
  echo "    Targets: ${TARGETS[*]}"
  echo ""
  for target in "${TARGETS[@]}"; do
    "uninstall_${target}"
  done
  echo ""
  echo "==> Done. Skill removed."
  exit 0
fi

# --- Install path ---

echo "==> $SKILL_NAME setup"
echo "    Source:  $SKILL_DIR"
echo "    Targets: ${TARGETS[*]}"
echo ""

echo "--> Installing skill..."
echo "  ${SKILL_NAME}:"
for target in "${TARGETS[@]}"; do
  "install_${target}"
done

echo ""
echo "==> Done."
echo ""
echo "Usage:"
for target in "${TARGETS[@]}"; do
  case "$target" in
    claude)
      echo "  Claude Code:  /presentation-creator"
      ;;
    cursor)
      echo "  Cursor:       Auto-attached when discussing presentations, tech talks, or demo scripts"
      ;;
    windsurf)
      echo "  Windsurf:     @presentation-creator or auto-invoked for matching requests"
      ;;
    opencode)
      echo "  OpenCode:     @presentation-creator as subagent"
      ;;
    codex)
      echo '  Codex:        Mention `$presentation-creator` in your prompt'
      echo "                Restart Codex after install to pick up new skills"
      ;;
  esac
done
