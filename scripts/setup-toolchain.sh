#!/usr/bin/env bash
# Installs the pinned Compact compiler (0.31.1) into .toolchain/ by direct
# release download. Works where `compact update` cannot (it needs api.github.com).
set -euo pipefail
VERSION="${COMPACT_VERSION:-0.31.1}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/.toolchain/compactc-$VERSION"
if [ -x "$DEST/compactc" ] && [ "$("$DEST/compactc" --version)" = "$VERSION" ]; then
  echo "compactc $VERSION already installed at $DEST"; exit 0
fi
case "$(uname -s)-$(uname -m)" in
  Linux-x86_64)  TARGET=x86_64-unknown-linux-musl ;;
  Linux-aarch64) TARGET=aarch64-unknown-linux-musl ;;
  Darwin-arm64)  TARGET=aarch64-darwin ;;
  Darwin-x86_64) TARGET=x86_64-darwin ;;
  *) echo "unsupported platform $(uname -s)-$(uname -m)" >&2; exit 1 ;;
esac
URL="https://github.com/midnightntwrk/compact/releases/download/compactc-v$VERSION/compactc_v${VERSION}_${TARGET}.zip"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
echo "downloading $URL"
curl -fsSL -o "$TMP/cc.zip" "$URL"
mkdir -p "$DEST"
unzip -oq "$TMP/cc.zip" -d "$DEST"
chmod +x "$DEST"/* 2>/dev/null || true
echo "installed: $("$DEST/compactc" --version)"
