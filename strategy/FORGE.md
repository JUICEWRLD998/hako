# FORGE — round logs (2026-10-15)

## Conditions

- Run inline in one context, so the result is **SEMI-COLD**.
- No outside model ran. `rival-run.mjs --selftest` returned:
  - codex: NOT READY (401, expired proxy key)
  - gemini: NOT READY (no auth configured)
- No subagents.
- Treat the pairwise votes as one reasoner wearing six hats. That is the known weak point; see A7.

**Panel seats:**
- P1: Midnight product judge (unique, real, "low saturation")
- P2: Midnight BD judge ("which parts require privacy", adoption path)
- P3: the automated engineering bar (compile, witnesses, simulator tests, wallet UI, deployed address)
- P4: sponsor devrel (does it serve a WANT and the RFS?)
- P5: investor / first customer (would I pay or fund it and use it next month?)
- P6: the tired generalist at demo 47

## Cliché list, inline SEMI-COLD

| Layer | Input | Mechanisms it produced | Field hits |
|---|---|---|---|
| L1 | Naive prompt: "what should we build for a Midnight privacy hackathon?" | private voting; ZK identity/age proof; private payments/payroll; health records; private credit score | all 5 present (~70 entries) |
| L2 | "Ideas nobody else will build" | private prediction market; ZK dating; dark-pool DEX; sealed-bid auction; anonymous whistleblowing; private AI-agent payments; hidden-information game | all 7 present |
| L3 | Event page + RFS + rubric | solvency auditor; sanctions screener; payroll/min-wage auditor; invoice verifier; genomics marketplace; provably fair casino; private sports betting; agent identity registry; proof-of-inference; supply-chain ESG tracker | 8 of 10 present; genomics and agent-identity-in-registry form absent |

**Convergence probe (n=15, inline)**: none of the 15 L1-L3 lines above names collectible card packs, oripa, gacha pools or mystery boxes. The nearest is "provably fair casino" (RFS, L3).

## Round 1: 22 cards from 8 generators (≤3 per generator)

| # | Generator | Card (mechanism in brief) |
|---|---|---|
| 1 | G-PERSON (a doctor doing side shifts, Japan) | Sum of side-job hours across employers proven under the legal cap; employers stay hidden |
| 2 | G-PERSON (a home-care aide, US EVV) | Visit proven inside the client's geofence without GPS trails |
| 3 | G-PERSON (a parent in a custody case) | Sobriety tests proven on schedule and under threshold, with no selfies sent to the ex |
| 4 | G-CUSTOMER (an online oripa operator under lawsuit) | **Sealed pool of N real cards: hits proven inside, every draw provably fair, buyers private** |
| 5 | G-CUSTOMER (a real-estate agency) | Competing offers proven real (no phantom bids) without revealing bidders or amounts |
| 6 | G-CUSTOMER (an employer health plan) | PBM rebate pass-through / most-favoured-price proof over confidential contracts |
| 7 | G-WANT (RFS "Payroll Auditor") | Garment-factory living-wage proof; workers verify their own leaf |
| 8 | G-WANT (RFS genomics) | Sell yes/no answers from your DNA file, never the file |
| 9 | G-WANT (RFS ZK-insurance) | Cold-chain temperature band proven to the cargo insurer; route hidden |
| 10 | G-DATA (59 comments on this event) | Teams verify that their own judge scores were counted; other teams' scores stay hidden |
| 11 | G-COLLIDE (proof of reserves → wages) | Merged into #7 |
| 12 | G-COLLIDE (Callisto threshold escrow) | Union card-check majority proven without names |
| 13 | G-COLLIDE (tipster sites × commitments) | Trading/betting calls committed at call time; track record proven without ever revealing the calls |
| 14 | G-INVERT (the institution proves, not the person) | Lender proves the same committed scorecard was applied to every applicant |
| 15 | G-INVERT (fair allocation) | Sybil-resistant private lottery for scarce products (console / Pokémon Center lottery sales) |
| 16 | G-FUTURE | zkTLS → Compact bridge: Web2 data signed into Midnight proofs |
| 17 | G-FUTURE | AI lab proves an opted-out work is NOT in its committed training set |
| 18 | G-HUMAN (other shape: social services) | Domestic-violence survivors enter coordinated housing queues as unlinkable, deduplicated, proven-eligible records |
| 19 | G-HUMAN (legal) | Arbitrator proves none of the case parties is in their confidential client list |
| 20 | G-HUMAN (Japan, elderly living alone) | Daily "alive and well" band from home sensors, with no camera |
| 21 | G-HUMAN (humanitarian) | Beneficiaries confirm receipt anonymously; ghost-beneficiary dedup |
| 22 | G-PERSON (Lagos land buyer) | A plot sold once: a double-sale registry |

Shape spread: tools 9, marketplaces 3, consumer 4, social/civic 4, infrastructure 2. No single shape exceeds half.

### R2 dedupe (by mechanism, against L1-L3 and the 184-entry field)

| Card | Merged into | Reason |
|---|---|---|
| #11 | #7 | same mechanism |
| #7 | field: Equilux | same 20-second demo: an employer commits payroll, employees verify inclusion, a proven aggregate is published |
| #20 | field: OHAYO! | value-to-band proof from a sensor |
| #9 | field: BACCHIRI / OHAYO | sensor-evidence band |
| #10 | field: Blind-Judge | ZK commit-reveal judging |
| #12 | field: Silent Quorum / Murmur | threshold and anonymous membership |
| #21 | field: ProofRelief; also WFP Building Blocks (prior art) | same mechanism |
| #22 | field: Stock & Foil | spend-once registry |

Generated 22, unique 14, **yield 64%**.

### R3 cheap kill (hard gates only)

| Card | Gate | Reason |
|---|---|---|
| #2 | G2 | Trust root is phone GPS either way; Midnight is not load-bearing |
| #3 | G12 | Breathalyzer-device signatures (P-256) cannot be verified on the deployable toolchain 0.31.1 |
| #5 | G14a | The payer is missing: agents gain from phantom bids, and buyers cannot impose the tool |
| #6 | G12 | Completeness needs the counterparties' own commitments, which no one can force |
| #8 | G12 | Raw DNA files are unsigned, so the answers cannot be authenticated |
| #14 | G14a | Institutions do not want to buy auditability |
| #16 | G12 | `secp256k1EcdsaVerify` availability on 0.31.1 is UNVERIFIED; revivable once checked |
| #17 | G14a | Labs will not commit dataset roots voluntarily |

Survivors (top 6): #1, #4, #13, #15, #18, #19. Locale alarm: 0 of 6 are Nigerian. Firewall: 0 of 6 are security-flavoured.

### R4 tournament (round-robin, every pair asked in both orders)

| Pair | AB order | BA order | Verdict |
|---|---|---|---|
| #4 vs #18 | #4 (P1 P4 P5 P6; P2 votes #18) | #4 | #4 |
| #4 vs #15 | #4 | #4 | #4 |
| #4 vs #13 | #4 | #4 | #4 |
| #4 vs #1 | #4 | #4 | #4 |
| #4 vs #19 | #4 | #4 | #4 |
| #18 vs #15 | #18 | #15 | **tie (flip)** |
| #18 vs #13 | #18 | #18 | #18 |
| #18 vs #1 | #18 | #18 | #18 |
| #18 vs #19 | #18 | #18 | #18 |
| #15 vs #13 | #13 | #15 | **tie (flip)** |
| #15 vs #1 | #15 | #15 | #15 |
| #15 vs #19 | #15 | #15 | #15 |
| #13 vs #1 | #13 | #13 | #13 |
| #13 vs #19 | #13 | #13 | #13 |
| #1 vs #19 | #1 | #1 | #1 |

Wins: #4 5, #18 3.5, #15 2.5, #13 2.5, #1 1, #19 0. **Champion R1: #4.**

## Round 2: carry #4, #18, #15, #13, plus mutants and fresh cards

| # | Card | Outcome |
|---|---|---|
| 4a | Mutant of #4 (swap the user): crypto-native phygital packs (Solana/Polygon graded-card gacha) | Loses to 4c both orders: no crisis hook, and rivals already exist on public chains |
| 4b | Mutant of #4 (swap the output): Korea gacha studios proving rates over secret tables | **Killed G2 in D-check**: Korean law publishes item-level odds, so a public table plus commit-reveal suffices and ZK is not load-bearing |
| 4c | Mutant of #4 (swap the payer and the proof): Japanese online oripa operators. Sealed composition, "the hit is still inside" proofs, buyer-private draws, three-source randomness | **Beats #4 both orders and replaces it** |
| 23 | Fresh, G-DEMO: "the seal breaks only when the proof lands" | Merged into 4c (same mechanism; becomes its signature moment) |
| 24 | Fresh, G-WISH: RFS "Provably fair casino" verbatim | Excluded: L3 cliché, plus Midnight Casino in the field |
| 25 | Crossover #4 × #15: sealed pool sold by lottery entry | Loses to 4c: double mechanism, blurrier demo |

Tournament: 4c beats #18, #15, #13 in both orders; #18 vs #13 → #18. Generated 6, unique 3, **yield 50%**. Champion R2: **4c**.

## Round 3: mutants of 4c

Mutants: a marketplace hosts many operators' packs; a regulator view key; an early-close full unseal. All are the same mechanism with different features, so they fold into 4c's roadmap.

Fresh: G-FUTURE "every mystery-box seller needs proof under consumer law by 2028" is the same mechanism as 4c.

Generated 5, unique 1, **yield 20%**. 4c has held the title 2 rounds running and the yield is under 40%, so the forge **STOPS**.

Into A6 (different mechanisms): **4c (HAKO), #18 (Bedline), #13 (Callbook).**

## A7 final (blind cards X = HAKO, Y = Bedline, Z = Callbook)

| Pair | Order 1 | Order 2 | Seats |
|---|---|---|---|
| X vs Y | X | X | P1 X, P2 Y, P3 X, P4 X, P5 X, P6 X |
| X vs Z | X | X | 6-0 |
| Y vs Z | Y | Y | P5 votes Z in order 2 |

Deliberation room (each seat argues for its first choice, then votes): X 5, Y 1 (P2, on privacy purity). **Clear winner: X.**

**Caveat:** no outside judge ran, and one context cast every vote. He should still rank the blind cards cold (RANKED_REPORT §0) before reading our ranking.
