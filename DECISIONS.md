# DECISIONS

Newest first. Each entry: what was measured, what was rejected, and the commit.

## 2026-10-16 — Phase 1 and 2 design calls

Each entry: the decision, what was measured, what was rejected.

**S1 resolved on route 1 (bytes to a 64-bit lane).** `Bytes<8> as Uint<64>` and
`Bytes<32> as Vector<32, Uint<8>>` both compile on 0.31.1. `drawWord(digest)` reads the first
8 bytes as a little-endian u64. The circuit checks `word == q * remaining + r` and `r < remaining`
with `q`, `r` from the `indexParts` witness. Uint arithmetic in Compact is checked, not modular, so
the split is unique. Measured in `s1.test.ts`: the word matches an independent JS reference on
10,000 random digests; a remainder of `r + 1` and a second split `(q - 1, r + remaining)` are both
rejected; a chi-square over 6,000 draws is 11 degrees of freedom under the 0.001 critical value.
Bias is below `remaining / 2^64`. Rejected: the Field route, because `degradeToTransient` returns a
value spread over the whole ~254-bit field and there is no way to take its low bits uniquely.

**Compact has no `%` or `/`.** The plan's `export pure circuit uniformIndexOf` cannot exist. The
verify page calls the exported `drawDigest` and `drawWord`, then does `word % remaining` in BigInt.
The in-circuit check above is what binds the operator to that same answer.

**`sealed`, `void` and top-level `const` are not usable in Compact 0.31.1.** `sealed` and `void`
are reserved words; there are no top-level constants. Renamed to `sealedCount` and
`DrawRequest.refunded`; statement kinds are the literals 1 (STILL_INSIDE) and 2 (AT_LEAST).

**The constructor opens the zero tally itself.** `tallyCommit = commit(zeroTally(), freshRand(0))`
is computed inside the constructor, not passed in. A passed-in commitment would let an operator start
with `inside[k] = true` for an advertised hit it never seals, and `finalizeSeal` would accept it.

**Operator private state is replayed from the ledger, not stored.** The tally, the slot
arrangement (swap-and-pop history), the next seed link and the commitment randomness are all
functions of the pack file and the public ledger. A crashed operator service resumes with no extra
state, and the witnesses cannot drift out of sync with the chain. Cost: O(draws) per call, fine for
N <= 128. The commitment randomness is `sha256(secret, "hako:tally", version)` where
`version = sealedCount + results.size + revealed.size`, computed on-chain by `nextVersion()`.

**Added a CLOSING phase.** Draws and unseals interleaving would make the replay order ambiguous.
`unsealOne` moves OPEN to CLOSING, and `requestDraw` requires OPEN, so draws always replay first.

**Refunds only for the oldest request.** The plan said FIFO "skipping voided ids", which needs an
unbounded loop in-circuit. Instead `refundStalled(id)` requires `id == nextFulfil`, marks it
refunded and advances the cursor. The operator cannot skip a draw, and a stalled queue unwinds one
request at a time. Anyone can call it; it needs no operator secret.

**drand is not verified in-circuit.** Ledger 8 has no pairing. The operator supplies the 32-byte
`drand` value and the public record shows it, so a wrong value is detectable on `/verify` but not
rejected on-chain. The README says this. Quicknet constants (genesis 1692803367, period 3) are from
memory and unconfirmed: `scripts/drand-check.mjs` checks them, and the cloud container could not.

**Advertised-hit index is not bound to the Merkle position.** `sealSlot` proves the card's leaf is in
the tree, but a card could set a different flag index than its leaf's position. This cannot make a
hit appear that was not sealed: every set flag is backed by a distinct proven leaf, leaves for unused
hits are an unguessable sentinel, and `finalizeSeal` requires exactly `advertisedCount` flags. It
could permute which flag a hit uses. Accepted for now; binding the index from the path's
`goes_left` bits is a known hardening.

**Mutation check.** `scripts/mutation-check.mjs` breaks the contract 11 ways and runs the relevant
tests against each. 11 of 11 mutants were killed (removed S1 remainder and range checks, seed-chain
check, finalize flag and tier checks, future-round check, refund deadline, claim nullifier, hit
identity check, a `sealSlot` that touches a public field, and a missing operator check). This is the
evidence that the planted controls are real: no test passes by asserting nothing.

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
