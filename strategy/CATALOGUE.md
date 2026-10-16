# CATALOGUE — every card, its fate, and the three finalists

Midnight Buildathon (AKINDO). 2026-10-15. The round logs are in FORGE.md.

## Index

| # | Card | Round | Status |
|---|---|---|---|
| 1 | Side-job hours under the cap (Japan) | R1 | Lost in R4 (1 win). Also, the law is in flux: the bill had not been submitted as of 2026-10-08 |
| 2 | Home-care visit proof without GPS | R1 | Killed: G2 (GPS trust root unchanged) |
| 3 | Custody sobriety proofs | R1 | Killed: G12 (device signatures not verifiable on toolchain 0.31.1) |
| **4 → 4c** | **HAKO: sealed card pools, provable draws** | R1–R3 | **FINALIST, PICK** |
| 4a | Phygital crypto packs | R2 | Lost to 4c (no crisis hook) |
| 4b | Korea gacha rate proofs | R2 | Killed: G2 (item odds are public by law, so commit-reveal suffices) |
| 5 | Anti-phantom property offers | R1 | Killed: G14a (no payer) |
| 6 | PBM / MFN price proofs | R1 | Killed: G12 (completeness needs counterparties) |
| 7 | Living-wage payroll proof | R1 | Merged into field entry Equilux (same mechanism) |
| 8 | Genomics answers | R1 | Killed: G12 (unsigned raw data) |
| 9 | Cold-chain insurance band | R1 | Merged into field entries BACCHIRI / OHAYO |
| 10 | Verifiable judging receipts | R1 | Merged into field entry Blind-Judge |
| 11 | Proof of wages | R1 | Merged into #7 |
| 12 | Union majority proof | R1 | Merged into field entries Silent Quorum / Murmur |
| **13** | **Callbook: committed calls, proven track record** | R1–R3 | **FINALIST (Z)** |
| 14 | Same-scorecard-for-all proof | R1 | Killed: G14a |
| 15 | Fair private product lotteries | R1–R2 | Lost in R2 (tied, then below #18) |
| 16 | zkTLS → Compact bridge | R1 | Killed: G12 (revivable if `secp256k1EcdsaVerify` is on 0.31.1) |
| 17 | Training-set non-membership | R1 | Killed: G14a |
| **18** | **Bedline: DV-survivor coordinated entry** | R1–R3 | **FINALIST (Y), runner-up** |
| 19 | Arbitrator conflict check | R1 | Lost in R4 (0 wins), small market |
| 20 | Elderly watch-over band | R1 | Merged into field entry OHAYO |
| 21 | Aid receipts / dedup | R1 | Merged into field entry ProofRelief; prior art WFP Building Blocks |
| 22 | Land double-sale registry (Lagos) | R1 | Merged into field entry Stock & Foil; also a locale card |
| 23 | "The seal breaks when the proof lands" | R2 | Merged into 4c as its signature moment |
| 24 | Provably fair casino (RFS verbatim) | R2 | Excluded: L3 cliché, plus Midnight Casino in the field |
| 25 | Sealed pool sold by lottery entry | R2 | Lost to 4c |

## Finalist X: HAKO (the pick)

**Problem.** Online "oripa" sites sell draws from a pool of real trading cards. Buyers cannot see inside the pool, so they cannot tell whether the advertised hits were ever put in, still remain, or were quietly pulled out. On 2026-09-08 a Japanese law firm reported several operators to the Consumer Affairs Agency. By 2026-09-17, lawsuits and criminal complaints covered five major companies. Losses of millions of yen per person were described as common (president.jp, 2026-09-17).

**User.** The collector who buys draws. The paying customer is the operator who wants to prove it is honest.

**Solution.**
1. The operator seals N real cards on Midnight as hiding commitments. The contract proves that the sealed pool matches the advertised lineup: every named hit is inside, and the tier counts are exact.
2. Each draw takes its randomness from three places: the shop's pre-committed seed chain, the buyer's seed, and a future drand round. Nobody controls all three.
3. The draw proof opens one slot to its buyer only.
4. On request, the operator can prove statements such as "the PSA 10 Charizard is still inside" without revealing which slot holds it or anything else in the pool.
5. Buyers are unlinkable per draw. Payments become shielded in a later phase.

**Mechanism.** Hiding commitments in a public slot map, a hidden tally accumulator (committed counts and flags, updated inside circuits), swap-and-pop draws, and a hash-chained operator seed. It is NOT a public VRF loot box: those publish the pool, which lets bots snipe the hits and exposes every whale. It is NOT a casino.

**Technologies.** Compact (toolchain 0.31.1, runtime 0.16.0), Midnight.js 4.1.1, DApp Connector 4.0.1, proof server 8.1.3, drand quicknet, React with Motion, and a Node operator service.

**Differentiation.**
- 0 of 184 field entries touch this cell.
- Midnight's own RFS asks for provably fair games.
- The Japanese market is ¥338bn in FY2025 (est.) and in a public trust crisis that started one month ago.

**Demo concept.** The judge clicks "Draw" in their own browser. Three dice spin (shop seal, your seed, world drand). The foil seal on the box tears only when the proof lands on Midnight, and the card is revealed. The public board updates: "Remaining 87 · Proven inside: the Charizard."

**MVP scope.** seal → finalize → draw request → fulfil → buyer verify → "still inside" statement → claim. One pack per contract. Off-chain points. Operator-relayed draws, so no wallet is needed to play.

**Main risks.**
- In-circuit index derivation.
- Preprod wallet sync time.
- No real operator yet (M1).
- The gambling-adjacency perception. Mitigations: Midnight's RFS asks for exactly this, the product is consumer protection, and the promo pack is free.

## Finalist Y: Bedline (runner-up)

**Problem.** US law (VAWA confidentiality) bars domestic-violence providers from entering survivors' identities into the shared homeless-services database (HMIS). So survivors drop out of coordinated housing queues, or get counted twice.

**User.** DV advocates and their clients. The payer is the Continuum of Care or the HMIS vendor.

**Solution.** Survivors enter the queue as unlinkable, deduplicated records with a proven priority score. Identity is released only to the matched housing provider, with consent.

**Mechanism.** Anonymous membership, a per-person nullifier, and a proven score.

**Why it lost.** It is the purest privacy cure in the forge. But nobody is reachable inside the window, sales are B2G, and the build would show self-generated activity only (it fails G14 full).

## Finalist Z: Callbook

**Problem.** Paid trading and sports tipsters cannot prove their record without giving away their calls. Fake screenshots therefore win.

**Solution.** Each call is committed at call time, unlinkable and hidden, and delivered privately to subscribers. A track record (win rate, drawdown) is proven over every commitment, including the losers, without ever revealing a call.

**Why it lost.**
- Delayed public reveal already solves most of the problem, so the privacy case is weaker.
- Crypto-signal entries scored 0 in Wave 1.
- Judges read it as trading noise.

## Reject reasons in one line each

- Equilux, OHAYO, BACCHIRI, Murmur, Stock & Foil and Blind-Judge already own the mechanisms behind #7, #9, #10, #12, #20 and #22. A new domain on the same 20-second demo is not unique to this panel.
- Ideas whose data source cannot be authenticated on ledger 8 (#3, #8, #16) are demos posing as products.
