# RANKED REPORT — Midnight Buildathon (AKINDO WaveHack)

2026-10-15 · Mustapha Fadhlullah — independent security researcher

**A0:** PASS. Nigeria is eligible. One item to confirm: read the binding Official Rules PDF before submitting.

**Deadlines (D):** Wave 2 closes **2026-10-19 15:00 UTC** (4,000 USDT, split by points). Wave 3 builds Oct 27 → Nov 16 (5,000 USDT).

---

## 0 · The blind cards (rank these cold before reading on)

**X.** A trading-card shop seals a pool of real cards on a privacy chain. Buyers can check that every advertised hit was sealed in, that "the Charizard is still inside" right now, and that their own pull was fair. The rest of the pool, and who bought what, stays hidden. The shop pays per draw for a "sealed" badge, at a time when Japan's online card-lottery sites are being sued.

**Y.** Domestic-violence survivors are kept out of shared housing queues by confidentiality law. They enter as unlinkable, deduplicated records with a proven priority score, and their identity is released only to the matched provider, with consent. Paid for by regional housing coalitions.

**Z.** Paid trading and sports tipsters commit each call privately when they make it. Their win rate and drawdown are then proven over every call, losers included, without the calls ever being published. Subscribers pay; tipsters pay to be listed.

**Final:** clear winner **X (HAKO)**.
- Pairwise: X>Y and X>Z in both orders; Y>Z.
- Deliberation room: X 5, Y 1.
- WANTs served: X → WANT-2, WANT-3, WANT-4, WANT-5 (RFS "Provably Fair…", Gaming sector). Y → WANT-1. Z → WANT-1 (partial).
- No outside judge ran (both CLIs NOT READY). One context cast every vote, so your cold rerank above outranks it.

## 1 · Name, one-liner, tagline

- **Name: HAKO** (箱, "box"). In the card world, a sealed booster box is a 箱 or "BOX", so the word comes from the users' own vocabulary. It does not explain the product.
- **One-liner:** A card shop seals 100 real cards on Midnight, and anyone can check that the hits went in and that every pull was fair, without the shop opening the box or learning who bought what.
- **Tagline:** *Sealed, not secret. Prove every pull. Keep the box shut.*
- **Why now:**
  - On 2026-09-08 a law firm reported online oripa operators to Japan's Consumer Affairs Agency.
  - By 2026-09-17, suits and criminal complaints covered **five major companies** (president.jp).
  - The Japanese TCG market is **¥338.4bn in FY2025 (est.), +11.9%** (Japan Toy Association).
  - Midnight's ledger 8 is live on mainnet.
- **Why this event:**
  - Midnight's own Request for Startups asks for a "Provably Fair Casino on Midnight" and names Gaming as a sector.
  - The judges paid physical-world goods first (energy, construction, fish).
  - **0 of 184 entries** are in this cell.

## 2 · Wow anatomy

- **Hook number:** five big oripa operators were sued last month. 0 of 184 Midnight entries saw it.
- **Insight (why the cell is empty):** crypto builders think "casino", not "card shop". And the scandal broke after Wave 1 closed.
- **Negation (G5):** the field believes fairness needs transparency: publish the pool, use a VRF. That is wrong for two reasons.
  - A public pool tells bots exactly when the hits remain, so they snipe the good draws.
  - A public chain puts every buyer's spending, including the ¥-million losses, on a permanent public ledger.
  - The fix is proof without disclosure. That is the dual ledger, and it is why this needs Midnight.
- **Mechanism:**
  1. Hiding commitments sit in a public slot map.
  2. A **hidden tally** (tier counts plus "advertised hit still inside" flags) is committed on-chain and updated inside every circuit.
  3. Draws use swap-and-pop on the slots.
  4. Randomness comes from **three dice**: the shop's hash-chained seed (fixed before sale), the buyer's seed, and a future drand round.
  5. The opening goes to the buyer only.
  - It is NOT a VRF loot box: those publish the pool. It is NOT a casino: these are real cards with grading cert IDs.
- **Differentiator:** I1 (the empty cell, measured), I2 (Compact's private state and commitments; the toolchain 0.31.1 limits, checked), I5 (the negation above). A rival needs the oripa crisis, the hidden-tally design and the three-dice randomness. One prompt does not produce that combination.
- **Wow moment (the 20-second beat):** the judge clicks Draw. Three dice settle. The foil seal on the box **tears only when the draw proof lands on Midnight**, and the card flips. The board updates: "Remaining 87 · **Proven inside: PSA 10 Charizard** · block 2,3xx,xxx".
- **Proof a judge checks in one click:** the `/verify/<contract>` page needs no wallet. It reads every draw from the indexer, re-fetches each drand round from drand's public API, recomputes the slot index, and shows the "still inside" statements with their transaction hashes.
- **Moats held:**
  - M3: fresh Midnight primitive use (hidden-tally accumulator on ledger 8).
  - M6: taste from the users' world (foil seal, slab labels, the "BOX").
  - M2 (to be earned, Phase 8): a measured count of public-chain gacha wallets whose full spend is public.
  - M4 (to be earned): live preprod draws by strangers.
  - With M3 + M6 alone it fails G16's spirit. **M2 and M4 are mandatory work, not stretch.**
- **Deliberation-room sentence (G17):** "the one where the card shop proved the Charizard was still in the box without opening it."
- **Strength test:**

  | Axis | Score |
  |---|---|
  | Novelty | 9 |
  | Wow | 9 |
  | Feasibility | 7 |
  | Real user / customer | 5 |
  | Midnight necessity | 8 |
  | Business | 7 |

  Mean 7.5, which clears the 7 floor. **Spike: novelty plus wow.**

**90-second demo (Before → Action → After)**

| Time | Beat |
|---|---|
| 0:00 | **Before.** A headline from Sept 2026: lawsuits against online oripa sites. "You paid ¥3,000 a pull. Was the Charizard ever in there?" |
| 0:12 | The operator console. 100 real cards, the advertised lineup, "Seal". The tally commitment is posted. `finalizeSeal` proves the lineup and the hits are inside. |
| 0:30 | **Action.** The buyer's page (a phone). Draw. The three dice. The foil seal tears when the proof lands. Card revealed, slot opened to this buyer only. |
| 0:50 | The operator proves "Charizard still inside" on the public board, without revealing which slot. |
| 1:05 | **After.** The verify page, no wallet: every draw recomputed, drand rounds re-fetched, all green. A deliberately wrong drand value is shown failing. |
| 1:20 | Close on the contract address, a tx hash and "Midnight preprod". |

## 3 · How it works

**Roles:**
- **Operator (proposer):** seals the pool and fulfils draws (Node service, its own wallet, pays DUST).
- **Contract (checker):** every invariant is a circuit assertion.
- **Buyer (approver of their own draw):** checks the opening against the public slot commitment, claims and requests shipping.
- **Anyone / regulator (auditor):** the verify page; later a view-key export.

**Midnight integration (load-bearing):**

| Part | Role |
|---|---|
| `hako.compact` | Circuits: `sealSlot`, `finalizeSeal`, `requestDraw`, `fulfillDraw`, `proveStillInside`, `proveAtLeast`, `claimItem`, `refundStalled`, `unsealRemaining` |
| `witnesses.ts` | Operator secret, item openings, tally, seed chain; buyer secret |
| Ledger ADTs | `Map`, `Set`, `Counter`, `MerkleTree` (advertised lineup) |
| Stdlib | `persistentHash` / `persistentCommit`; `blockTime*` for deadlines |
| Midnight.js 4.1.1 providers | indexer public data, private state, proof (proof server 8.1.3), ZK config, wallet via DApp Connector 4.0.1 |

The full design is in `../implementation.md`.

## 4 · Build contract (summary; phases in implementation.md)

- **Single workflow:** seal → finalize → request → fulfil → verify → prove-inside → claim.
- **Completion evidence:**
  - a preprod contract address and ≥20 draw transactions;
  - CI green (compile + simulator tests);
  - a verify page that recomputes every draw;
  - the video.
- **MVP:** Phases 0–5. **Stretch:** 6–7. **NOT BUILDING:** a real-money payment rail, multi-pack marketplace, mobile app, physical custody proof.
- **Cut order:** shielded payments → regulator export → refunds UI → `proveAtLeast` (keep `proveStillInside`) → claim UI. Never cut: the tests, the verify page, the deployed address.

**Top 5 risks:**

| # | Risk | Trigger | Fallback |
|---|---|---|---|
| 1 | Uniform index in-circuit | Spike fails | Witness quotient/remainder over a 64-bit lane; else rejection sampling with fixed attempts |
| 2 | Preprod wallet sync takes hours | Sync not done in 2h | Develop on `midnight-local-dev`; start the preprod sync on day 1 in the background |
| 3 | Version-mismatch hell | Any `instanceof` / "Version mismatch" error | Pin the matrix and add an npm override for onchain-runtime-v3 3.0.0 |
| 4 | Circuit too large | Prover >60s or k too high | Shrink advertised flags 16→8 and tiers 4→3 |
| 5 | No real users | 0 strangers by 2026-11-06 | Run our own free promo pack and recruit through TCG communities |

## 5 · The rival

**In the lane:** nobody among the 184. The closest public-chain products are Collector Crypt and Courtyard (graded-card packs). Their pools and wallets are public. That is our negation.

**Strongest rival overall:** BACCHIRI or PollPower in Waves 2–3. They have real operators and industry teams.
- **Where they beat us:** real customers, mainnet use, team domain credibility.
- **Where we beat them:** uniqueness, a judge-runnable live draw, and test depth. PollPower had "no runnable frontend" and tests "not through a simulator".
- **What could beat us outright:** a returning team that adds real users before we get any. So **M1 is the race.**

## 6 · Scores

| Criterion (event-page weights) | Weight | X HAKO | Y Bedline |
|---|---|---|---|
| Engineering | 40 | 9 → 3.60 | 8 → 3.20 |
| QA | 15 | 9 → 1.35 | 8 → 1.20 |
| Product | 15 | 8 → 1.20 | 8 → 1.20 |
| UX | 15 | 8 → 1.20 | 7 → 1.05 |
| Communication | 10 | 8 → 0.80 | 7 → 0.70 |
| BD | 5 | 6 → 0.30 | 4 → 0.20 |
| **Total** | | **8.45** | **7.55** |

Re-ranked with the Google-Doc weights (20/20/15/15/15/15): X 7.90, Y 7.10. **No rank flip.** Ratings are our estimates, cited against Wave 1's pattern (winners scored 6–9 per criterion).

**Winner-DNA fit:** the top 3 sold physical-world goods with real operations. HAKO has the physical goods (cards) but not yet the operator.

## 7 · Blind attack (SEMI-BLIND, inline; input was only §1, §2's demo script and the rubric)

**The entry it would rank above ours:** BACCHIRI, because it has real industrial customers.

| # | Question | Our answer |
|---|---|---|
| 1 | Isn't this a VRF loot box? | No. VRF boxes publish the pool. HAKO keeps it sealed and proves statements about it, and buyers stay private. |
| 2 | Why ZK and not "reveal everything at close"? | The reveal comes after the money is spent, and never comes if the pack never closes. A public pool invites sniping. HAKO gives in-flight proofs ("still inside") while the box stays sealed. |
| 3 | How do you know the physical card exists? | Graded hits carry cert IDs in the advertised lineup, checkable on the grader's site. Claims are on-chain, and unshipped claims are counted publicly. We do **not** claim to prove physical custody; it is stated as a limit. |
| 4 | Can the operator steer hits to a shill? | It cannot pick the slot: it never knows the future drand value. **Residual:** the operator knows the composition, so it could time its own buys. Disclosed in the README. The roadmap adds a public operator-wallet rule and a regulator view key. |
| 5 | Can the operator stall on bad draws? | Draws are FIFO, deadlines trigger refunds, and a public stalled counter tracks them. A bond comes in Phase 7. |
| 6 | Isn't this gambling? | Each operator's legal status is its own. HAKO is consumer-protection infrastructure, the public demo pack is free, and Midnight's RFS asks for provably fair games. |
| 7 | Business model? | Per-draw SaaS fee plus a "Sealed by HAKO" badge. Marketplaces and regulators later. |
| 8 | Competitors? | Web2 oripa sites (trust me), public-chain phygital packs (everything public), physical Ichiban Kuji boards. |
| 9 | Why would an operator accept constraints? | After September's suits, proof is the best marketing an honest shop has. |
| 10 | Throughput and fees? | Each draw is 2 tx with proofs measured in seconds. Batch fulfilment is on the roadmap. DUST per draw gets measured in Phase 5. |

## 8 · The decisive question

**"Will one real operator, or one real collector community, run a pack?"** Time cap: 2026-11-06 (mid Wave 3).
- **Yes:** pilot their pack on preprod. Their logo and quote go in the Wave 3 deck.
- **No:** we run a free "no purchase necessary" promo pack of real cards and recruit 30+ real collectors. Every user and draw is logged as measured.

**Runner-up:** Bedline.
- **Switch trigger:** the Phase 1 index spike fails twice **and** no collector replies by 2026-10-24.
- **Last switch date:** 2026-10-27, the start of Wave 3.

## 9 · The company

| Item | Answer |
|---|---|
| Paying customer | Online oripa / card-pack operators (JP first, then US mystery-pack sites), then marketplaces that list packs |
| Price | **¥3 per draw or 1% of draw GMV**, whichever is lower, with the first 1,000 draws a month free (ASSUMED; to test in interviews) |
| Why now | The September 2026 suits; Midnight mainnet live |
| Wedge | Honest mid-size operators who need to differentiate this quarter |
| First 10 users | TCG Discords and X communities (EN), oripa buyers on X (JP, through Midnight Japan's network and AKINDO), Collector Crypt / Courtyard users who dislike public wallets |
| Competitor | Web2 oripa sites; Collector Crypt. **Edge:** sealed and proven, with private buyers |
| 12 months | Q1: 3 operator pilots. Q2: batch draws plus shielded points. Q3: regulator view keys plus Korea and US mystery-box sites |
| Real vs mocked in the build | Contract, proofs, randomness, verify page and draws are real. Payments are off-chain points until Phase 7. Physical shipping is manual |

## 9b · Prize stack

One track only (WaveHack). Free add: apply to the **Midnight Build Club** if selected. Wave 2 entry is optional but recommended: a thin path earns points and creates the "what changed" story for Wave 3.

## 10 · 60-second pitch (founder voice)

"Last month, a Japanese law firm took five online card-lottery companies to the regulator. People had spent millions of yen pulling for cards they couldn't prove were ever in the box. Publishing the box doesn't fix it either: bots would buy only when the hits are left, and every buyer's spending would sit on a public chain forever. HAKO seals the box on Midnight. The shop proves the hits are inside, and proves the Charizard is still there today, without opening anything. Every pull is decided by three dice nobody controls, and only you see what you pulled. Shops pay a few yen a draw to show they're honest. Collectors finally get a box they can check."

## 11 · Verdict

**P(1st) in a wave, decomposed:**

| Factor | Estimate | Reason |
|---|---|---|
| Eligible and compliant | 0.95 | Official Rules PDF still unread |
| Core runs end to end | 0.80 | The index spike and preprod sync are the risks |
| Judge gets it in 20s | 0.85 | Pokémon plus the scandal |
| Beats the strongest rival on the human ranking | **0.30** | No operator yet |
| Survives unscripted input | 0.85 | Judge-run draws, fully deterministic verify page |
| **Product** | **≈ 0.16** | |

With one real operator pilot, the weakest factor rises to about 0.5, so **P ≈ 0.27**. The grant is proportional to points, so P(scoring in the top 7) is about 0.5.

**Weakest factor:** the human ranking against teams with real customers. **The one move that helps most:** get one operator or one community to run a real pack before the Wave 3 deadline. Engineering alone cannot buy that factor.

**Honest odds: 4/10** to finish first in some wave, **6/10** to earn a grant share.
