# DECISIONS

Newest first. Each entry: what was measured, what was rejected, and the commit.

## 2026-10-16 — Phase 0 environment findings

Measured in the cloud build container (not the author's machine):

| Check | Result | Consequence |
|---|---|---|
| `compact update 0.31.1` | Fails: `api.github.com` is blocked by the egress proxy | `scripts/setup-toolchain.sh` downloads the compiler zip straight from the GitHub release URL, which is allowed |
| `compactc --version` after install | `0.31.1` | The pinned toolchain runs here |
| Docker daemon | Not running | The proof server (8.1.3) and `midnight-local-dev` cannot run here. Deploy to local dev or preprod from the author's machine |
| drand (`api.drand.sh`, `drand.cloudflare.com`) | Unreachable from here | The drand `info` check is a task for the author's machine (`scripts/drand-check.mjs`) |
| npm install with workspaces | npm 10.9.4 crashes (`edgesOut`) on peer-set resolution | `.npmrc` sets `legacy-peer-deps=true` |
| `compact-runtime@0.16.0` | Pulls `onchain-runtime-v3@3.1.2`, while `midnight-js-protocol@4.1.1` pins 3.0.0 (two copies) | Root `overrides` pins 3.0.0: one copy, verified with `npm ls` |
