#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Lightweight secret hygiene scan for tracked files.
# Add/adjust patterns as needed.
PATTERN='(AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z\-_]{35}|xox[baprs]-[A-Za-z0-9-]{10,}|ghp_[A-Za-z0-9]{30,})'

MATCHES=$(git ls-files | grep -Ev '(^|/)(node_modules|dist|\.git)/' | xargs -r grep -nE "$PATTERN" || true)

if [[ -n "$MATCHES" ]]; then
  echo "[secret-scan] Potential secrets detected:" >&2
  echo "$MATCHES" >&2
  exit 1
fi

echo "[secret-scan] OK: no high-risk token patterns found in tracked files."
