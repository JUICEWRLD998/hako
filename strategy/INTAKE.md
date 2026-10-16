# INTAKE — Midnight Buildathon (AKINDO WaveHack)

Dated 2026-10-15. Facts that decay are marked (D).

## A0 viability gate: PASS, with one item to confirm

- Event: "Build Privacy-First Apps on Midnight" on AKINDO, a WaveHack run in three Waves. VERIFIED: https://app.akindo.io/wave-hacks/jaMZjqPOBsLXvjdG
- Who pays to run it: nobody. Preprod is free; DUST comes from the faucet and from NIGHT. No model credits are needed.
- Credentials: none load-bearing yet. One live call is owed on the first build day: the Lace / DApp Connector handshake and a preprod deploy.
- Eligibility: 18+. Excluded residents: Afghanistan, Belarus, Cuba, Iran, Iraq, North Korea, Russia, Syria, Venezuela, Yemen, Myanmar, Somalia and Sudan. **Nigeria is not on the list** (VERIFIED, rules section 3). OFAC/UN/EU/UK sanctions screening applies to people and wallets.
- Qualifying mechanics (the technical gate, VERIFIED, rules section 7):
  - at least one Compact contract that compiles;
  - a public GitHub repo carrying the `midnightntwrk` topic;
  - the Midnight code under Apache-2.0;
  - a README, a slide deck, a demo video, and a progress description;
  - Midnight functionality newly developed or materially extended during that Wave.
- **Confirm before submitting:** the binding Official Rules PDF (Google Drive link on the event page) governs the summary. It was not opened in this pass.

## Timeline (D) — VERIFIED from `api.akindo.io/public/wave-hacks/jaMZjqPOBsLXvjdG/waves`

| Wave | Build ends (submission deadline) | Judging ends | Pool |
|---|---|---|---|
| 1 | 2026-09-16 15:00 UTC (closed) | 2026-09-29 | 3,500 USDT (paid 7 teams) |
| 2 | **2026-10-19 15:00 UTC** (the API shows this; the rules text says Oct 17) | 2026-10-26 15:00 UTC | 4,000 USDT |
| 3 | rules: build Oct 27 to Nov 16, judging to Nov 27 (exact deadline TBD on platform) | 2026-11-27 | 5,000 USDT |

The grant is split **in proportion to points** (`grantDistributionMode: "point"`). This is not winner-take-all. Wave 1 points: 30 / 23 / 16 / 10 / 9 / 6 / 6, which sum to 100 across the 7 scored teams. Teams the judges select may also join the **Midnight Build Club**: 8 weeks, then a pitch to Midnight's investors and the Accelerator.

## Scoring function: two published versions disagree

1. **The event page** (VERIFIED). Its criterion names match the six ratings shown on Wave 1 votes:

   | Criterion | Weight |
   |---|---|
   | Engineering & Implementation | 40% |
   | Quality Assurance & Reliability | 15% |
   | Product & Vision | 15% |
   | User Experience & Design | 15% |
   | Communication | 10% |
   | Business Development & Viability | 5% |

2. **The linked Google Doc rubric** (VERIFIED, `docs.google.com/document/d/1-dDTqWa2Cc…`):

   | Criterion | Points |
   |---|---|
   | Product Leadership | 20 |
   | Backend Engineering | 20 |
   | Frontend/UX | 15 |
   | QA | 15 |
   | Communication & Marketing | 15 |
   | Business Development | 15 |

   Each criterion has five sub-questions on a 0–5 scale. Those sub-questions include "Product Fit with Network", "Integration & Decentralization (storage, oracles)", "Version Control Use", "Community Engagement" and "Educational Clarity".

Plan for both. Engineering carries the most weight in either version.

### How Wave 1 was actually judged (revealed preference, VERIFIED from the `votes` field of the submissions API)

The judges' own explanation (jkato, 2026-09-29):
- Every submission was checked against a bar set from the rubric.
- The top 30 teams then got a deeper review of business problem-solving and feasibility.
- "Final rankings were based on feasibility, real-world adoption potential, and uniqueness."
- "We saw many submissions in the same domain, on the same theme, solving the same problem."

**The automated layer.** This is the "AI judge" the user worries about. The Backend, QA and Frontend comments are templated, word for word, across teams:
- "Your contract compiled cleanly on the toolchains used for this review and defines N circuits."
- "You implemented genuine private state with a witnesses.ts and a commitment/hash, exactly what a Midnight app should do."
- "Your contract references witnesses but no witnesses.ts implements them." (a penalty)
- "Your tests exercise the contract through a simulator and assert real state." Other teams got "Test files exist but don't drive the contract through a simulator" or "No contract tests were found."
- "A react frontend is present. It sets up the full wallet provider stack. The UI calls the contract and reads on-chain state back." Other teams got "No runnable frontend was detected."
- "A deployed contract address is documented."

**The human layer.** Comments from the Product and BD judges:

| Team | What the judges said |
|---|---|
| PollPower | "exactly which parts require privacy" |
| BACCHIRI | "team fully engrained within the construction industry"; "baked into the client's workflow" |
| GYOTAK | "product already in active use on the mainnet" |
| Stock & Foil | "fraud that only exists because financiers can't share their books, exactly the gap privacy fills"; "consortium sale hard for a startup" |
| Equilux | "hard deadline with fines; pitch fits in one sentence"; "Workday could add it" |
| Nominee | "Low saturation"; "crispest pitch" |
| DareU | "include audio commentary"; "deploy to mainnet" |

The top 3 (PollPower, BACCHIRI, GYOTAK) all sell physical-world goods or services with real operations behind them. That is the strongest signal in the data.

## Panel type

The panel is sponsor devrel plus accelerator: the Midnight team (Junya Kato and others) and possibly AKINDO. No judges are listed on the platform ("No judges yet"). The panel scores code first through an automated pass, then reads the top 30 as investable products. The Build Club is the accelerator track. **Midnight Japan is visible throughout:** the Tokyo founder meetings this week, the Japanese Wave 1 winners (BACCHIRI #2, GYOTAK #3 is Thai/Japanese) and AKINDO itself.

## The primitive being judged

Compact contracts with real private state (witnesses), commitments and hashes, the dual ledger (public plus private), selective disclosure, and optionally shielded tokens (Zswap), all behind a React dApp on the DApp Connector wallet stack.

### Stack to pin (VERIFIED from docs.midnight.network/relnotes/support-matrix, 2026-10-15)

| Component | Version |
|---|---|
| Compact devtools | 0.5.1 |
| Toolchain (`compact compile`) | **0.31.1** |
| compact-runtime | **0.16.0** |
| Compact JS | 2.5.1 |
| on-chain runtime | 3.0.0 |
| Midnight.js | **4.1.1** |
| testkit-js | 4.1.1 |
| Wallet SDK | 1.2.0 |
| DApp Connector API | **4.0.1** |
| Proof server | **8.1.3** |
| Node | 1.0.400 |

All three networks (Preview, Preprod, Mainnet) run ledger 8. **Toolchain 0.34/0.35 and runtime 0.19/0.20 target ledger 9 and cannot deploy to these networks.** P-256 and Ed25519 verification (`secp256r1EcdsaVerify`, `ed25519Verify`) exist only in 0.35 behind `--feature-zkir-v3`, so they are off-limits.

Field-measured trap (ochinimus, event comments): compact-runtime 0.16.0 pulls in onchain-runtime-v3 3.1.0, while midnight-js 4.1.1 pins 3.0.0. The `instanceof` checks then fail. Fix: add an npm `overrides` entry pinning 3.0.0. Also from the field: the first preprod wallet sync took 1h55m.

### Templates (VERIFIED from the midnightntwrk org)

`example-bboard` (contract + CLI + UI), `example-shielded-chips` (Zswap), `example-battleship` (hidden state), `create-mn-app`, `setup-compact-action` (CI), `midnight-local-dev`. A DUST-sponsorship tutorial exists (bounty #299 in dApp-idea-board).

## THE WANT MAP

- **WANT-1, privacy is the cure, not decoration.** "What I'd like to know more about is exactly which parts require privacy" (judge on PollPower, Wave 1). Also "fraud that only exists because financiers can't share their books, exactly the gap privacy fills" (Stock & Foil).
- **WANT-2, uniqueness and scale.** "Final rankings were based on feasibility, real-world adoption potential, and uniqueness … many submissions in the same domain, on the same theme" (jkato, 2026-09-29). "Low saturation" was praised on Nominee.
- **WANT-3, real workflows with real operators.** "The core product is baked into the client's workflow" (BACCHIRI). "Already in active use on the mainnet" (GYOTAK). "Not a hack-and-walk-away event … serious about bringing it to the world" (jkato).
- **WANT-4, clearing the automated engineering bar** (templated comments quoted above): compiles, private state in `witnesses.ts` with commitments, simulator tests that assert state, a React wallet-stack UI that reads chain state, a documented deployed address, and a video with audio commentary.
- **WANT-5, Midnight's own Request for Startups** (VERIFIED, midnight.network/request-for-start-ups). The list has 61 items. Among them: "Provably Fair Casino on Midnight: a casino where ZK proofs guarantee game outcomes", "Private Sports Betting Platform", "Payroll Auditor", "Confidential Genomics Marketplace" and "ZK-Insurance Underwriting Engine". The event page names its sectors: Finance, AI, **Gaming ("Verify player actions or game logic privately on-chain")**, Healthcare, Governance and Identity.
- **The gap between what they wrote and what they need:** they listed generic primitives. They paid for real industries with real operators: energy meters, construction sensors, fish. First place goes to a real market with a real crisis, where privacy is the reason the problem exists.

## Field sweep (I1): all 184 submissions, Wave 1 (159) + Wave 2 (25)

Source: `api.akindo.io/public/wave-hacks/jaMZjqPOBsLXvjdG/waves/<id>/submissions`, pulled 2026-10-15. Raw JSON is in the scratchpad. Blind spot: entries made after the pull, and private repos.

| Cell (approach) | Count (approx.) | Examples |
|---|---|---|
| "Prove you qualify, reveal nothing" (eligibility / credentials / identity) | ~35 | WhisperScore, VeilPass, ClearScope, Threshold, VeriCred, CipherComply |
| Credit / lending / repayment proofs | ~12 | Nocturne, proofFi, Phrim, HORIZON, Amana, ZeroScore, Tally |
| Payroll / salary / pay | ~9 | Mizan, Balary, ShadowPayroll, IncomeLayerZK, **Equilux**, Candor (comp) |
| Solvency / reserves | ~6 | datum, Candor, AquaReserve, Freeboard |
| Invoices / receivables | ~6 | **Stock & Foil**, OnePledge, Quietbook, TacitPay, Night Desk |
| Voting / polls / DAO | ~10 | Shadowvote, Zk-Ballot, VotePriv, NightPoll, midnight.vote |
| Health records / trials | ~8 | VeriHealth, PrivateLab, COHORT, Aegis_, Seath Aid |
| Whistleblowing / anonymous reports | ~6 | Murmur, GhostDrop, Vero, VulnSeal, QuietPatch |
| Traceability / sensor evidence | ~9 | **PollPower, BACCHIRI, GYOTAK**, Understory, Carbon Seal, STRICKLE, OHAYO, Silent Recall |
| Payments / remittance / OTC / dark pools | ~14 | Novapay, Prova, UMBRA, Pyron, Private OTC Desk, GoPay |
| AI agents / x402 | ~9 | Shade 402, Mandate, REMIT, Warden, NightJar, Codeguard |
| Prediction / betting | 4 | **DareU**, DarkStake, PrivatePredict, Slip |
| Games | ~10, **0 scored** | Battleship, ShadowArena ×2, VeilWolf, Midnight Pool, Blindside, Sealed Pick, Midnight Casino |
| Dev tooling | 4 | CompactForge, Tell, Compact Privacy Change Gate, FAIRPROOF |

### Empty cells relevant to the pick

- **Collectible card draws / mystery packs / oripa / gacha / lotteries: 0.** Regex `pokémon|oripa|gacha|loot box|trading card|booster|mystery pack|raffle|lottery|kuji|drop rate` over every tagline, description and comment returned nothing. **Positive control:** the same scan matched "provably fair" in ShadowArena, so the regex and scan were working. Warrant: nobody thought of it. The Japanese oripa scandal broke on 2026-09-08, after Wave 1 closed.
- Legal (conflicts, arbitration): 0. Warrant: hard to reach, small market.
- Domestic-violence / social-services coordination: 0. Warrant: B2G, unreachable inside the window.

## L0 judge memory (`scripts/judge-memory.mjs`, Devpost only, 2026-10-15)

Controls passed.

| Keyword | Total | Band | Same-mechanism in 30-sample |
|---|---|---|---|
| gacha | 144 | WORN | 0 (two "visible odds" toy games, not proofs) |
| loot box | 53 | SEEN | 0 |
| provably fair | 141 | WORN | 0 (a Midnight dark-pool DEX and a social-deduction game appear; neither draws from a pool) |

None reach SEEN-MECHANISM. Blind spot: DoraHacks, ETHGlobal and Colosseum are not sampled. On-chain "VRF loot box" projects are common there (L0 risk), but they publish the pool. That is the opposite of this mechanism.

## Market facts gathered (for the pick)

- Japan card game / TCG market: **¥338,414M FY2025 (estimate), +11.9% YoY; ¥302,466M FY2024.** VERIFIED from the Japan Toy Association table at toys.or.jp/pdf/2026/gangu_siryou_2015-2025.pdf (via search result; open the PDF once to confirm).
- Online oripa crisis: the law firm 弁護士法人・響 reported several online oripa operators to the Consumer Affairs Agency under the Specified Commercial Transactions Act. **Announced 2026-09-08.** By 2026-09-17, civil suits and criminal complaints covered **five major companies**. Losses of "several million yen per person" are described as common. The article calls it a black-box lottery. VERIFIED (page 1 of 6 only): president.jp/articles/-/119050, 2026-09-17.
- Korea: the KFTC fined Nexon ₩11.6B (Jan 2024) for secretly lowering MapleStory Cube odds, the largest fine of its kind. Mandatory probability disclosure under the Game Industry Promotion Act took effect March 2024. VERIFIED: Korea Times, TechRadar.
- Collector Crypt (Solana graded-Pokémon gacha): about $5.7M of gacha spend per week. UNVERIFIED secondary source (MEXC news, Sept 2025). 2-minute check: Collector Crypt's own stats page or Dune.

## Open questions (owner: Mustapha)

1. Does he have any real contact: a card shop, an oripa or gacha operator, a TCG community admin? **This is the single biggest lever on P(1st)** (WANT-3). Ask by 2026-10-20.
2. Wave 2 or Wave 3? Wave 2 closes 2026-10-19 15:00 UTC. A thin end-to-end entry earns points and sets up the "what changed" story for Wave 3 (the larger 5,000 USDT pool). Both are planned in implementation.md.
3. Question to post in the Midnight Discord #buildathon (draft): "Is contract deployment to mainnet open to buildathon teams now, or still allow-listed? And is there a recommended pattern for one wallet sponsoring DUST fees for another user's transaction on preprod (the bounty #299 tutorial)?"
