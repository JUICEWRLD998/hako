# HAKO — implementation plan

**Event:** Midnight Buildathon on AKINDO (WaveHack).
**Pick:** HAKO. Sealed trading-card pools with provable draws on Midnight.
**Author:** Mustapha Fadhlullah — independent security researcher.
**Written:** 2026-10-15.
**Strategy files (keep out of the public repo):** `strategy/INTAKE.md`, `FORGE.md`, `CATALOGUE.md`, `RANKED_REPORT.md`.

**Status: plan only.** Nothing gets built until he says **"GO hako"**.

---

## 0. The product in one paragraph

Online "oripa" sites sell draws from a pool of real trading cards. Nobody outside the shop can see inside the pool. Buyers cannot tell whether the advertised hits were ever put in, are still there, or were quietly removed. In September 2026, five big Japanese operators were reported to the Consumer Affairs Agency and sued.

Publishing the pool would not fix this. Bots would then buy only when the hits are left, and every buyer's spending would sit on a public chain forever.

HAKO seals the pool on Midnight:
- The shop **proves** the advertised hits went in.
- The shop **proves** a named hit is *still inside* at any moment, without opening anything.
- Every pull is decided by **three dice nobody controls**: the shop's pre-committed seed, the buyer's seed, and a future drand round.
- Only the buyer learns what they pulled.

**Who pays:** shops, per draw, for proof they are honest.

---

## 1. Built for two judges: the AI pass and the humans

Wave 1 votes (read from the AKINDO API) show two layers.

The first is an **automated repo review**. Its comments are templated word for word across teams.

The second is a **human ranking** of the top 30 on "feasibility, real-world adoption potential, and uniqueness".

### 1a. The automated pass: every check it ran, and the artifact that passes it

| What the reviewer wrote (Wave 1, verbatim) | Our artifact | Phase |
|---|---|---|
| "Your contract compiled cleanly on the toolchains used for this review and defines N circuits" | `contract/src/hako.compact`, compiled in CI on the pinned toolchain **0.31.1**. A plain language subset, so newer compilers also accept it. Circuit count stated in the README | 1, 2 |
| "You implemented genuine private state with a witnesses.ts and a commitment/hash" | `contract/src/witnesses.ts` implements **every** declared witness. Pool slots, tally and claims all use `persistentCommit` / `persistentHash` | 1 |
| Penalty: "Your contract references witnesses but no witnesses.ts implements them" | CI script `scripts/check-witnesses.mjs`: parses `witness` declarations in `.compact` and fails if any is missing from `witnesses.ts` | 2 |
| "Your tests exercise the contract through a simulator and assert real state" | `contract/src/test/hako.simulator.ts` plus about 25 Vitest tests and fast-check properties, all asserting ledger state | 2 |
| Penalty: "Test files exist but don't drive the contract through a simulator" | Every test goes through the simulator. None asserts on mocks | 2 |
| "A react frontend is present. It sets up the full wallet provider stack" | `ui/`: Vite + React. Providers: indexer public data, level private state, HTTP proof provider, fetch ZK config, wallet and midnight providers through the **DApp Connector 4.0.1** (Lace) | 4 |
| "The UI calls the contract and reads on-chain state back" | The operator console calls `sealSlot`, `finalizeSeal`, `proveStillInside`. The public board subscribes to contract state through the indexer | 4 |
| "A deployed contract address is documented" | The README "Live deployments" table: preprod contract addresses plus tx hashes of real draws | 5 |
| "Please include audio commentary" (DareU) | The video has a voice-over and burned-in captions | 5, 9 |
| "Exactly which parts require privacy" (PollPower) | README section **"Why this needs privacy"**: a public/private table (§4 below) | 5 |
| "Make it clearer who stands to benefit" (Stock & Foil) | README top third: the collector and the honest shop, named | 5 |
| The doc rubric's sub-questions: version control, community engagement, educational clarity, decentralized tools | Small honest commits. A public X thread and Discord post for each Wave (drafted; he posts). A "How HAKO uses Midnight's dual ledger" explainer in the deck. drand as a decentralized randomness source | all |

**Repo hygiene that an AI reader also scores:**
- GitHub topics: `midnightntwrk`, `midnight`, `compact`, `zero-knowledge`, `privacy`.
- `LICENSE` (Apache-2.0) plus the Apache header on every new file. `NOTICE` with "Built on Midnight".
- A CI badge.
- A "Judge in 3 minutes" section at the very top of the README.
- No `mock`, `fake`, `lorem`, `example.com` or `0x0000` anywhere (a pre-submit grep enforces this).

### 1b. The human ranking: what has to be true

- **Unique:** 0 of 184 entries touch card pools, gacha or lotteries (measured, `strategy/INTAKE.md`).
- **Feasible:** the judge runs a real draw on preprod from their own browser, no wallet needed, and re-verifies it on `/verify`.
- **Real-world adoption:** real cards, real strangers drawing (Phase 8), and an operator conversation. **This is the weakest factor and the one Phase 8 exists for.**

---

## 2. Stack (pin exactly; VERIFIED against docs.midnight.network/relnotes/support-matrix, 2026-10-15)

| Component | Version | Note |
|---|---|---|
| Compact devtools (`compact`) | 0.5.1 | `compact update 0.31.1` |
| Compact toolchain (`compact compile`) | **0.31.1** | 0.34 and 0.35 target ledger 9 and **cannot deploy** to Preview, Preprod or Mainnet today |
| `@midnight-ntwrk/compact-runtime` | **0.16.0** | Never install unversioned |
| Compact JS / Platform JS | 2.5.1 / 2.2.4 | |
| On-chain runtime | 3.0.0 | **npm `overrides` pin to 3.0.0** (field-measured trap: runtime 0.16.0 pulls 3.1.0, and `instanceof` breaks) |
| Midnight.js (+ testkit-js) | **4.1.1** | |
| Wallet SDK | 1.2.0 | Used by the operator worker (headless) |
| DApp Connector API | **4.0.1** | Lace in the browser |
| Proof server | **8.1.3** | Docker image |
| Node / Indexer | 1.0.400 / 4.3.x | |
| Local network | `midnightntwrk/midnight-local-dev` | Development before the slow preprod sync |
| Randomness beacon | drand **quicknet** (3 s rounds) | UNVERIFIED parameters. Confirm in Phase 0 with `GET https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971/info` (genesis time, period) |
| UI | Vite, React, TypeScript, CSS Modules plus design tokens, `motion` (imported from `motion/react`) | No Tailwind |
| Tests | Vitest, fast-check | |
| CI | GitHub Actions, `midnightntwrk/setup-compact-action` | |

**Templates to read before writing code:**
- `midnightntwrk/example-bboard`: contract, simulator tests, CLI and UI layout.
- `example-battleship`: hidden state across turns.
- `example-shielded-chips`: Zswap, for Phase 7.

**Help:**
- `midnightntwrk/midnight-expert`: Midnight's AI tooling for Claude.
- The Kapa / Midnight Expert MCP named on the event page.

---

## 3. Contract design (`contract/src/hako.compact`)

Syntax below is illustrative. Phase 1 confirms each construct against `example-bboard` at toolchain 0.31.1 before relying on it.

### 3a. One pack per contract

A pack is a fixed set of N ≤ 128 real cards. Every card is in one of 4 tiers (S, A, B, C). Up to 16 named "advertised hits" have public descriptors: name, grade and grading cert ID.

The operator deploys one contract per pack. A factory or marketplace is out of scope.

### 3b. Public ledger state

| Field | Type | Meaning |
|---|---|---|
| `operator` | `Bytes<32>` | Operator public key = `persistentHash(["hako:op", sk])`. This is the bboard pattern |
| `phase` | `SEALING \| OPEN \| CLOSED` | |
| `packSize` | `Uint<16>` | N |
| `tierTargets` | `Vector<4, Uint<16>>` | The advertised count per tier (public lineup) |
| `advertised` | `MerkleTree<4, Bytes<32>>` | 16 leaves: `persistentHash(hitId, tier)`. Unused leaves hold the sentinel `NONE` |
| `advertisedCount` | `Uint<8>` | Real hits among the 16 |
| `slots` | `Map<Uint<16>, Bytes<32>>` | slot → `persistentCommit(Item, salt)`. Hiding, so it leaks nothing |
| `sealed` | `Counter` | Slots sealed so far |
| `remaining` | `Uint<16>` | Unopened slots |
| `tallyCommit` | `Bytes<32>` | `persistentCommit(Tally, r)`: **the hidden tally** |
| `seedTip` | `Bytes<32>` | Last revealed link of the operator's hash-chained seeds |
| `requests` | `Map<Uint<32>, DrawRequest>` | `{ buyerTag, buyerSeed, drandRound, deadline, void }` |
| `results` | `Map<Uint<32>, DrawResult>` | `{ slot, leaf, opSeed, drand }` |
| `nextRequest`, `nextFulfil` | `Counter` | FIFO cursors |
| `statements` | `Map<Uint<32>, Statement>` | Public proven claims, e.g. "advertised #3 still inside, after draw 41" |
| `claimed` | `Set<Bytes<32>>` | Claim nullifiers |
| `stalled` | `Counter` | Draws refunded because the operator missed the deadline |

Supporting types:
- `Item = { id: Bytes<32>, tier: Uint<8>, adv: Uint<8> }`, where `adv = 0` means not advertised and `k+1` means advertised leaf k.
- `Tally = { tiers: Vector<4, Uint<16>>, inside: Vector<16, Boolean> }`.

### 3c. Witnesses (`contract/src/witnesses.ts`; every one implemented)

| Witness | Holder | Returns |
|---|---|---|
| `operatorSecret()` | operator private state | `Bytes<32>` |
| `slotOpening(slot)` | operator | `[Item, salt]` for a slot |
| `currentTally()` | operator | `[Tally, r]`, the opening of `tallyCommit` |
| `freshRand()` | operator | `Bytes<32>`, randomness for the next tally commitment |
| `nextSeedLink()` | operator | The next preimage in the seed chain |
| `advertisedPath(leaf)` | operator | `MerkleTreePath<4, Bytes<32>>` (sentinel path for non-hits) |
| `indexParts(...)` | operator | Quotient and remainder (plus byte limbs) for the uniform index; see S1 |
| `buyerSecret()` | buyer (per draw) | `[secret, nonce]` |
| `buyerOpening()` | buyer | `[Item, salt]` received off-chain |

### 3d. Circuits

| Circuit | Who | Asserts | Public effect |
|---|---|---|---|
| constructor | operator | — | Sets `operator`, `packSize`, `tierTargets`, the `advertised` leaves, `seedTip = H^N(seed0)`, `tallyCommit = commit(zero tally, r0)` |
| `sealSlot()` | operator | `phase == SEALING`; caller is the operator; the opening matches the new leaf; the old tally opens `tallyCommit`; if `adv > 0`: the path proves `H(id,tier)` sits at leaf `adv-1` **and** `inside[adv-1]` was false; tier < 4 | `slots[sealed] = leaf`; `sealed += 1`; `tallyCommit = commit(tally + item, fresh)` |
| `finalizeSeal()` | operator | `sealed == packSize`; tally opens; `tally.tiers == tierTargets`; `inside[k] == (k < advertisedCount)` for every k | `phase = OPEN`; `remaining = packSize` |
| `requestDraw(tag, buyerSeed, round)` | operator relay (MVP); anyone with shielded payment (Phase 7) | `phase == OPEN`; pending < remaining; **`blockTimeLt(roundTime(round) − margin)`**, so the drand round is still in the future when the request lands | `requests[nextRequest] = {...}`; `nextRequest += 1` |
| `fulfillDraw(id, drand)` | operator | `id == nextFulfil` (FIFO, skipping voided ids); `H(link) == seedTip`; `slot = uniformIndex(H(link, buyerSeed, drand), remaining)`; the opening matches `slots[slot]`; the tally opens; tally minus item is non-negative; if a hit, `inside[adv-1]` was true | `seedTip = link`; `results[id] = {slot, leaf, link, drand}`; `slots[slot] = slots[remaining-1]` and delete the last (swap-and-pop); `remaining -= 1`; `tallyCommit = commit(tally − item, fresh)` |
| `proveStillInside(k)` | operator | The tally opens; `inside[k] == true` | `statements += {STILL_INSIDE, k, at: nextFulfil}` |
| `proveAtLeast(tier, n)` | operator | The tally opens; `tiers[tier] ≥ n` | `statements += {AT_LEAST, tier, n, at}` |
| `claimItem(id)` | buyer (operator-relayed in MVP) | `H("hako:buyer", secret, nonce) == requests[id].buyerTag`; the buyer's opening matches `results[id].leaf`; the nullifier is fresh | `claimed += H("hako:claim", secret, nonce)` |
| `refundStalled(id)` | anyone | No result for `id`; `blockTimeGte(deadline)` | `requests[id].void = true`; `stalled += 1` |
| `unsealRemaining(k)` | operator | `phase == OPEN`, closing; the opening matches each of the next k leaves | Discloses those items; at `remaining == 0` the tally must be zero, then `phase = CLOSED` |
| `export pure circuit uniformIndexOf(...)` | anyone | — | The same index function, callable from TypeScript with no proof. The verify page uses it, so the computation is identical by construction |

### 3e. Two design rules that keep it private

1. **No ledger operation may sit under a branch on private data.** Ledger reads and writes appear in the public transcript. So `advertised.checkRoot(...)` runs on every `sealSlot`, with a sentinel path for non-hits. Otherwise the transcript would reveal which slot holds a hit.
2. **No map key derived from a witness unless the key is already public.** Slot indices are public (sealing order, the random draw). Item identities and tiers never become keys.

### 3f. Spike S1: a uniform index in-circuit (the top technical risk)

The goal is `slot = x mod remaining`, where x is derived **uniquely** from the hash. The prover must have no freedom to pick between two valid slots.

Try in this order and keep the first that passes the tests in §6:

1. **Bytes → 64-bit lane → Uint modulo.**
   - Convert the 32-byte hash to bytes (cast or witness).
   - Rebuild 8 bytes in-circuit as `lo: Uint<64>`, bound to the hash by equality.
   - The witness gives `q: Uint<64>` and `r: Uint<16>`. Assert `lo == q*R + r` and `r < R`.
   - This is unique, with bias below R/2^64.
2. **Field route with a canonical decomposition.** Accept it only if it is provably unique.
3. **Fallback: publicly auditable instead of enforced.** The circuit records the inputs and the chosen slot. `uniformIndexOf` lets anyone prove a mismatch. The README states the downgrade plainly.

**Positive control:** a test with a planted wrong remainder (`r+1`) must fail. 10,000 random inputs must match the JS reference.

### 3g. Randomness: the three dice

| Die | Who controls it | Why it is fair |
|---|---|---|
| Shop seal | The operator, fixed before the first sale as a hash chain `H^N(seed0)` | The operator cannot change it later. Revealing one link does not reveal the next |
| Your seed | The buyer, at request time | The buyer does not know the shop's next link |
| World | drand quicknet round `round`, which must be in the future when the request lands (asserted with `blockTimeLt`) | Nobody knows it in advance. That includes the operator, so a shill buyer cannot grind |

drand's BLS signature is **not** verified in-circuit, because ledger 8 has no pairing. The verify page checks it against drand's public API with the official client, and recomputes every index with `uniformIndexOf`. The README says exactly this.

---

## 4. Privacy model ("which parts require privacy")

| Data | Who sees it | Why |
|---|---|---|
| Pack size, tier counts, advertised hits with cert IDs | Everyone | It is the promise being tested |
| Which card is in which slot | **Operator only** | A public pool tells bots when to buy |
| Which hits remain right now (the tally) | **Operator only**, plus statements it chooses to prove | The same reason; "still inside" is proven, not revealed |
| Slot commitments, tally commitment | Everyone (hiding) | They bind the operator without telling anyone anything |
| Each draw's inputs (shop link, buyer seed, drand) and the chosen slot | Everyone | Anyone can recompute fairness |
| The card a buyer pulled | **That buyer only** (and the operator, who ships it) | Pull history is personal spending data |
| Which draws belong to the same person | **Nobody** | Tags and nullifiers are per-draw hashes and unlinkable |
| Payment (Phase 7) | Shielded | Whales should not be on a public ledger |

**What HAKO does NOT prove:**
- That the physical card is in the shop's vault. Graded hits carry cert IDs that anyone can check on the grader's site, and unshipped claims show as a public count.
- That the operator never buys from its own pack. It cannot steer the result, but it knows the composition. This is disclosed; the roadmap adds a regulator view key.

---

## 5. Threat model (how each cheat is stopped)

| Cheat | Stopped by |
|---|---|
| Advertise a hit, never seal it ("未封入") | `finalizeSeal` requires every advertised flag set, and each flag can be set only once with a valid Merkle path |
| Seal fewer or more cards of a tier | `finalizeSeal` asserts `tally.tiers == tierTargets` |
| Swap a card after sealing | Leaves are binding commitments. Slots change only through `fulfillDraw` or `unsealRemaining` |
| Steer a hit to a shill | The slot depends on a future drand round, unknown at request time |
| Grind the buyer seed | The buyer knows neither the next shop link nor the future drand value |
| Skip a bad draw | FIFO fulfilment. The deadline refund makes skipping visible (`stalled`) |
| Hand the buyer a different card | The buyer checks the opening against the public leaf. A mismatch is provable |
| Claim the same pull twice | The claim nullifier |
| Lie that "the Charizard is still inside" | The statement is a proof over the committed tally |
| Leak the pool through the transcript | §3e rules, plus a test asserting the public-state diff of `sealSlot` (§6) |

---

## 6. Test plan (`contract/src/test/`, Vitest through the simulator)

Every test asserts **ledger state**, never mocks.

**Sealing**
- `seal: rejects non-operator`
- `seal: hidden tally accepts exact lineup`
- `finalize: rejects missing advertised hit`
- `finalize: rejects duplicate hit flag`
- `finalize: rejects wrong tier counts`
- `seal: public diff is {slots[i], sealed, tallyCommit} only` (privacy regression). Its **planted control**: the same diff check run on a fixture that also changes a tier field must FAIL.

**Requests**
- `request: rejects past drand round`
- `request: rejects when pending ≥ remaining`

**Fulfilment**
- `fulfil: FIFO order enforced`
- `fulfil: rejects wrong seed link`
- `fulfil: rejects forged opening`
- `fulfil: rejects stale tally`
- `fulfil: index equals uniformIndexOf` (property, 1,000 cases)
- `S1: wrong remainder fails` (positive control)

**Statements**
- `stillInside: true until drawn, then rejects`
- `atLeast: bound checks`

**Claims, refunds and closing**
- `claim: once only`
- `claim: rejects wrong secret`
- `refund: only after deadline and only if unfulfilled`
- `unseal: closes only when tally is zero`

**Property tests (fast-check)**
- Seal random packs, draw to empty: **the drawn multiset equals the sealed lineup**, and `inside` ends all false.
- Random interleavings of requests, fulfils and refunds keep `remaining + fulfilled == packSize`.

**CI (`.github/workflows/ci.yml`):**
1. setup-compact-action 0.31.1
2. `compact compile`
3. `scripts/check-witnesses.mjs`
4. `vitest run`
5. `ui` build
6. Upload the coverage summary

---

## 7. Repository layout (public repo `hako`, Apache-2.0)

```
hako/
  README.md            # judge-first; see §9
  CLAIMS.md            # every README claim -> the command or tx that proves it
  DECISIONS.md         # newest first; measurement, rejected alternative, commit
  LICENSE  NOTICE
  contract/
    src/hako.compact
    src/witnesses.ts
    src/test/hako.simulator.ts  src/test/*.test.ts
  api/                 # shared TS: deploy/join, typed circuit calls, providers
  operator/            # Node: pack authoring (CSV -> items, salts, seed chain), sealing runner,
                       #       fulfilment worker (indexer watch + drand fetch), opening API
  ui/                  # Vite React: /operator  /pack/:addr  /verify/:addr  /claim
  scripts/             # check-witnesses.mjs, seed-chain.mjs, drand-check.mjs
  docs/                # architecture.md, privacy-model.md, threat-model.md, deck.pdf
  .github/workflows/ci.yml
```

---

## 8. Implementation phases

Milestones come first; dates are facts, not gates.
- **Wave 2 milestone** = Phases 0–5, submitted before **2026-10-19 15:00 UTC**.
- **Wave 3 milestone** = Phases 6–9, built Oct 27 → Nov 16. Read the exact Wave 3 deadline from the AKINDO API once it opens.

Every phase ends with a **Done when** that is checked by running something, never by reading code.

### Phase 0 — Ground truth and toolchain (start the slow things first)

1. Read the Official Rules PDF. Record anything that changes this plan in `strategy/INTAKE.md`.
2. Install the pinned stack:
   - `compact update 0.31.1`
   - the proof server 8.1.3 container
   - `midnight-local-dev` up
3. **Start the preprod wallet sync now, in the background.** The field measured 1h55m.
4. Get preprod tDUST from the faucet.
5. Scaffold from `example-bboard`. Replace its contract with an empty `hako.compact`, then compile, deploy to local dev, and read state back from a script.
6. Confirm the drand quicknet `info` (genesis, period). Fetch one round. Save the response.
7. Post the two Discord questions from `INTAKE.md` (he posts).
8. **Done when:** a contract deploys on local dev **and** on preprod, its address is printed, and a state read returns the constructor values.

### Phase 1 — The contract core

1. Types, ledger fields and constructor (§3b).
2. `sealSlot` with the hidden tally, and `finalizeSeal`, including the sentinel-path rule (§3e).
3. **Spike S1** (§3f). Write the positive-control test first.
4. `requestDraw` with the `blockTimeLt` future-round assertion. `fulfillDraw` with the seed-chain check, uniform index, opening check, tally update and swap-and-pop.
5. `proveStillInside`, plus `export pure circuit uniformIndexOf`.
6. `witnesses.ts` implementing every witness. Private state is the operator's pack file (items, salts, tally, seed chain) and the buyer's per-draw secrets.
7. **Done when:** `compact compile` passes on 0.31.1 with no warnings, and a script seals a 12-card pack, finalizes it and fulfils 3 draws on local dev.

### Phase 2 — Test suite and CI (QA, 15%)

1. The simulator harness (bboard pattern).
2. All tests in §6, including the two planted controls.
3. Property tests.
4. `scripts/check-witnesses.mjs`.
5. CI workflow plus the README badge.
6. **Done when:** CI is green on GitHub, the test count is in the README, and **each planted control has been seen failing once** (record the run IDs in `DECISIONS.md`).

### Phase 3 — Operator service

1. **Pack authoring:** a CSV of the real inventory (`id, name, tier, grade, cert`) becomes the item list, 32-byte random salts, the advertised list and the seed chain. The result is an encrypted pack file.
2. **Sealing runner:** calls `sealSlot` × N, then `finalizeSeal`, with progress and resume-on-failure.
3. **Fulfilment worker:** watches `requests` through the indexer, waits for the drand round, fetches and verifies the round, then submits `fulfillDraw`. It retries on proof-server errors and logs every tx hash.
4. **Opening API:** `POST /opening` with `{id, tagPreimage}` returns `{item, salt}` only when `H(preimage) == buyerTag`.
5. **Relay endpoint for buyers without wallets:** `POST /draw` takes `{tag, buyerSeed}`, submits `requestDraw` with `round = now + margin`, and returns the request id and tx hash.
6. **Done when:** an end-to-end script relays 10 draws on preprod and fulfils all 10 automatically, and every opening verifies client-side.

### Phase 4 — The interface (run `ui-studio`: all 8 phases, rendered checks, every width)

1. **Ground the design in the users' world, not in a "crypto" look:**
   - the booster box and its **holographic foil seal**;
   - grading-slab labels;
   - rarity marks, sleeves, the shop counter.
   - Avoid the terminal/neon trap. Build an OKLCH palette with 2–3 support hues and tinted surfaces, one accent for the CTA.
   - Imagery comes from our own product: photos of the real cards we seal. Avoid trademark logos in our branding.
2. **The wow screen first: `/pack/:addr`.**
   - A "Draw" button that works with no wallet (relay).
   - The three-dice panel: shop link, your seed, the drand round counting down.
   - **The signature moment:** the foil seal tears only on the event "fulfil tx confirmed **and** the opening verified locally". The card then flips. Use `motion/react` with a reduced-motion fallback.
3. **`/verify/:addr`, no wallet:**
   - every draw with its inputs;
   - the drand round re-fetched and BLS-verified;
   - the index recomputed with `uniformIndexOf`;
   - the seed-chain links checked;
   - every statement listed with its tx hash.
   - Green or red per row, and a "try a wrong drand value" control that turns red on purpose.
4. **`/operator` (Lace, through the DApp Connector):**
   - create a pack, seal from the CSV, finalize;
   - "Prove still inside" buttons;
   - a live board.
   - This is the full wallet-provider stack the reviewer checks for.
5. **`/claim`:** paste a draw receipt to see your card, verify it, and request shipping. In the MVP the claim is relayed.
6. Feedback on every state change: pending proof, tx submitted, confirmed, failed with a reason.
7. **Done when:**
   - Screenshots at 320, 375, 414, 768, 1024, 1280, 1440 and 1920 px are reviewed.
   - `ui-studio/scripts/ui-score.mjs` passes with its planted controls.
   - A clean browser draws on preprod with no wallet and sees the seal tear.
   - **Contrast is measured, not eyeballed**, for every foreground/background pair.

### Phase 5 — Wave 2 packaging (its own milestone; never borrowed from)

1. Deploy the demo pack on **preprod**: 30–100 real cards from our own inventory.
2. Run ≥20 real draws, and record the addresses and tx hashes.
3. **README** (judge-first, about 200–270 lines):
   - Judge in 3 minutes
   - The problem (with the Sept 2026 sources)
   - Why this needs privacy (§4 table)
   - How it works (three dice, hidden tally)
   - Live deployments
   - Verify in 60 seconds
   - Tests
   - What HAKO does NOT prove
   - Roadmap
   - Rubric map (each criterion → feature → evidence)
4. `CLAIMS.md` and `DECISIONS.md` are current.
5. **Deck:** 10–12 slides. Problem, why public chains fail, how the dual ledger fixes it (an educational slide), demo stills, business, roadmap, ask.
6. **Video:** ≤2 min, made with the `demo-video` skill from the deployed link. Female voice-over, captions. Open on the pain, land the seal-tear by 0:30, end on the tx hash.
7. AKINDO form:
   - progress description;
   - repo link with the `midnightntwrk` topic;
   - deck;
   - video.
8. Pre-submit grep: `mock|fake|dummy|lorem|0x0000|picsum|randomuser|example.com`.
9. Run `humanizer` on all submission copy.
10. **Done when:** the judge path runs green from a clean browser on the deployed URL, and the entry is complete. **He presses submit.**

### Phase 6 — Statements, claims and closing (Wave 3)

1. `proveAtLeast`, `claimItem` (buyer-generated proof), `refundStalled` with the UI, `unsealRemaining`, and the closed-pack report.
2. **Regulator export:** a signed bundle of the full pack opening for a named auditor.
3. The opening only goes to the auditor. On-chain, only a statement that the export was made appears.
4. **Done when:** a pack runs from seal to CLOSED on preprod. The final unseal matches the lineup, and the verify page shows the whole history green.

### Phase 7 — Shielded payments and fee sponsorship (Wave 3 stretch; the first item in the cut order)

1. HAKO points as a shielded test token, following the `example-shielded-chips` pattern.
2. `requestDraw` becomes open to anyone who pays with `receiveShielded`.
3. The payment is released to the operator on fulfil and returned on `refundStalled`.
4. **DUST sponsorship:** the operator pays fees for buyer transactions (the bounty #299 tutorial pattern; confirm on preprod first).
5. Optional operator bond, slashed on stalls.
6. **Done when:** a buyer with a fresh Lace wallet and zero DUST draws and pays privately, and the chain shows no link between that buyer's two draws.

### Phase 8 — Real users and evidence (mandatory, starts the day Phase 5 ships)

1. **M4: the free promo pack.** Real cards, "no purchase necessary". Recruit 30+ real collectors from TCG Discords and X (EN), and through Midnight Japan / AKINDO contacts (JP). Ship winners their cards. Log every draw as measured. Never count our own draws.
2. **M1: operator outreach.**
   - 10 operators or shops (JP online oripa sites; US mystery-pack sites; phygital-pack platforms).
   - Script: the Sept 2026 lawsuit hook, the 2-minute verify demo, and the ask "seal one pack with us".
   - Record replies verbatim in `strategy/EVIDENCE.md`.
3. **M2: the public-chain negation.**
   - Measure how many wallets on a public-chain graded-card gacha have their full spend visible. Use Collector Crypt on Solana, through public RPC or an explorer.
   - Record the literal query, the date, the count and a positive control (a known wallet that must appear).
   - The number goes in the deck's "why not a public chain" slide.
4. **Done when:** at least 30 non-team draws have happened, at least one operator conversation is logged, and the M2 number is recorded with its query.

### Phase 9 — Wave 3 packaging

1. The "what changed since Wave 2" section, with links to commits and new tx hashes.
2. Re-cut the video and update the deck with real users, the operator quote and the M2 number.
3. Draft the community posts. He posts them.
4. The full B6 checklist:
   - grep, `humanizer`, LIVE / NEXT / NOT LIVE wording;
   - the clean-browser judge path;
   - every claim in `CLAIMS.md` re-run.
5. **Done when:** the entry is complete well before the deadline. **He presses submit.**

### Phase 10 — After the Waves (only if it survives)

- A mainnet deploy, if the Discord answer allows it.
- Apply to the Build Club if selected.
- Batch fulfilment (k draws per tx).
- A multi-pack factory.
- Run `product-hardening`.

---

## 9. README skeleton (top third written in Phase 1, before the UI)

```
# HAKO — sealed card pools you can check
Sealed, not secret. Prove every pull. Keep the box shut.
[CI badge] [Preprod contract: <addr>] [Video] [Deck]

## Judge in 3 minutes
1. Open <url>/pack/<addr> → Draw (no wallet needed) → watch the seal tear when the proof lands.
2. Open <url>/verify/<addr> → every draw recomputed from public inputs; flip "wrong drand" to see it fail.
3. `npm test` in /contract → N simulator tests, 2 planted controls.

## Why this needs privacy   (table from §4)
## How it works            (three dice, hidden tally, swap-and-pop; diagram)
## Live deployments        (network, contract, tx hashes of draws and statements)
## What HAKO does NOT prove
## Rubric map              (Engineering 40% → circuits/tests/addresses; QA → CI; …)
```

---

## 10. Risk register

| Risk | Trigger | Fallback | Owner |
|---|---|---|---|
| S1 uniform index | Both in-circuit routes fail their tests | Auditable fallback (§3f.3), stated in the README | Mustapha |
| Preprod sync / proof-server instability | Sync over 2h, or proof errors | Develop on local dev; retry with backoff; record tx hashes | Mustapha |
| Version mismatch | "Version mismatch" or `instanceof` errors | The matrix pins plus the npm override | Mustapha |
| Circuit too big | Prover over 60s | Tiers 4→3, flags 16→8, N ≤ 64 | Mustapha |
| Trademark (Pokémon etc.) in branding | Any logo or name in our UI or brand | Generic "trading cards". Photos of our own cards as listings only | Mustapha |
| Gambling perception | A judge question | Consumer-protection framing; the free promo pack; Midnight's RFS asks for provably fair games | Mustapha |
| No real users | Fewer than 10 strangers by 2026-11-06 | Widen recruiting (Reddit TCG, local card shops in Lagos/Abuja for EN) | Mustapha |

---

## 11. Cut list (in order; never cut the bottom three)

1. Phase 7, shielded payments and sponsorship
2. Regulator export
3. Refund UI (keep the circuit)
4. `proveAtLeast` (keep `proveStillInside`)
5. Buyer-generated claim (keep the relayed claim)
6. **Never cut:** the simulator tests with their controls; the `/verify` page; the deployed addresses and tx hashes.
