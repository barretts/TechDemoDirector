#!/usr/bin/env bash
# One-line installer for TechDemoDirector
# Usage: bash <(curl -fsSL https://barretts.github.io/TechDemoDirector/install.sh)
# Pass flags through: bash <(curl -fsSL ...) --all

set -e

REPO="https://github.com/barretts/TechDemoDirector.git"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

echo "==> TechDemoDirector one-line installer"
echo "    Cloning to temporary directory..."
echo ""

git clone --depth 1 "$REPO" "$TMPDIR/TechDemoDirector" 2>&1 | tail -1
cd "$TMPDIR/TechDemoDirector"
bash install.sh "$@"
