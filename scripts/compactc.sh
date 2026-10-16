#!/usr/bin/env bash
# Runs the pinned compiler. Usage: scripts/compactc.sh <src.compact> <outdir> [flags]
set -euo pipefail
VERSION="${COMPACT_VERSION:-0.31.1}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CC="$ROOT/.toolchain/compactc-$VERSION/compactc"
[ -x "$CC" ] || "$ROOT/scripts/setup-toolchain.sh" >&2
exec "$CC" "$@"
