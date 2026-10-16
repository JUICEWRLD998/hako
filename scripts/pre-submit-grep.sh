#!/usr/bin/env bash
# Fails if placeholder content appears in tracked files outside strategy notes and tests.
set -euo pipefail
cd "$(dirname "$0")/.."
PATTERN='mock|fake|dummy|lorem|0x0000|picsum|randomuser|example\.com'
hits=$(git ls-files \
  | grep -v -E '^(strategy/|implementation\.md|LICENSE|package-lock\.json|scripts/pre-submit-grep\.sh|DECISIONS\.md|CLAIMS\.md)' \
  | grep -v -E '/test/' \
  | xargs grep -n -i -E "$PATTERN" 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo "placeholder content found:" >&2
  echo "$hits" >&2
  exit 1
fi
echo "pre-submit grep clean"
