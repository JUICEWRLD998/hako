# HAKO: sealed card pools you can check

Sealed, not secret. Prove every pull. Keep the box shut.

![CI](https://github.com/juicewrld998/hako/actions/workflows/ci.yml/badge.svg)
Topics: `midnightntwrk` `midnight` `compact` `zero-knowledge` `privacy`

> **Status, stated plainly**
> **LIVE:** the contract (9 circuits, Compact 0.31.1), its test suite (52 tests, 11 mutation checks) and CI.
> **NEXT:** deployment to local dev and preprod, the operator service, the interface.
> **NOT LIVE:** no contract address, no real draws, no UI yet. Nothing below claims otherwise.

## Judge in 3 minutes

1. `npm install && npm run toolchain && npm run compact` compiles the contract on the pinned toolchain. It prints `Compiling 9 circuits`.
2. `npm test` runs 52 tests through the Compact simulator. Every one asserts ledger state read back from the contract.
3. `npm run check:mutants` breaks the contract 11 different ways. The suite must catch all 11 (`11/11 mutants killed`).
4. `CLAIMS.md` lists every claim here with the command that checks it. `DECISIONS.md` records what was measured and what was rejected.

The deployed demo and the `/verify` page arrive with Phases 3 to 5.

## The problem

Online "oripa" sites sell draws from a pool of real trading cards. Nobody outside the shop can see inside the pool, so buyers cannot tell whether the advertised hits were ever put in, are still there, or were quietly removed. In September 2026 five large Japanese operators were reported to the Consumer Affairs Agency and sued.

Publishing the pool would not fix it. Bots would buy only when the hits are left, and every buyer's spending would sit on a public chain forever.

## Who it is for

- **Collectors** who want proof that the hit they were promised exists, and that the draw was not steered.
- **Honest shops** who want to show they are honest without opening the box.

Shops pay per draw for that proof.

## Why this needs privacy

| Data | Who sees it | Why |
|---|---|---|
| Pack size, tier counts, advertised hits with cert IDs | Everyone | It is the promise being tested |
| Which card is in which slot | **Operator only** | A public pool tells bots when to buy |
| Which hits remain right now | **Operator only**, plus statements it chooses to prove | "Still inside" is proven, not revealed |
| Slot commitments, tally commitment | Everyone (hiding) | They bind the operator and tell nobody anything |
| Each draw's inputs and the chosen slot | Everyone | Anyone can recompute fairness |
| The card a buyer pulled | **That buyer only** (and the operator, who ships it) | Pull history is personal spending data |
| Which draws belong to the same person | **Nobody** | Tags and nullifiers are per-draw hashes |

## How it works

Three dice decide every draw, and nobody controls all three:

1. **The shop's seal.** A hash chain fixed before the first sale. The operator reveals one link per draw and cannot change the rest.
2. **Your seed.** Chosen by the buyer at request time.
3. **The world.** A future drand round, required to be in the future when the request lands.

The slot is `word mod remaining`, where `word` comes from hashing the three dice. The circuit checks that arithmetic in zero knowledge, so the operator cannot pick between two valid slots.

The pool itself is a set of hiding commitments, one per slot, plus a commitment to a hidden tally of what is still inside. `finalizeSeal` proves the sealed cards match the advertised lineup and that every advertised hit went in. `proveStillInside(k)` proves a named hit is still in the pool without opening anything.

## Circuits

`sealSlot` `finalizeSeal` `requestDraw` `fulfillDraw` `proveStillInside` `proveAtLeast` `claimItem` `refundStalled` `unsealOne`

## What HAKO does NOT prove

- **That the physical card is in the vault.** Graded hits carry cert IDs anyone can check on the grader's site.
- **That the operator never buys from its own pack.** It cannot steer the result, but it knows the composition. A regulator view key is on the roadmap.
- **drand inside the circuit.** Midnight's ledger 8 has no pairing, so the BLS signature is not verified on-chain. The operator supplies the drand value, the public record shows it, and the verify page checks it against drand's own API. A wrong value is detectable, not rejected.
- **Proving time.** Circuit sizes are small (`fulfillDraw` is 764 instructions) but real proof times are unmeasured until the proof server runs.

## Tests

| Layer | What | Count |
|---|---|---|
| Sealing, requests, fulfilment, statements, claims, refunds, unseal | Simulator tests asserting ledger state | 43 |
| Spike S1 (uniform index) | Wrong remainder, second split, 10,000 digests against a JS reference, chi-square | 6 |
| Properties (fast-check) | Drawing to empty returns the lineup; the counting invariant holds under random interleavings | 3 |
| Mutation check | The contract is broken 11 ways; every break is caught | 11 mutants |

Planted controls are real: the privacy-diff check is run against a fixture that leaks a field and must fail, and `check-witnesses.mjs --self-test` must detect a planted missing witness.

## Stack (pinned)

Compact toolchain 0.31.1 (ledger 8; 0.34 and 0.35 target ledger 9 and cannot deploy today) / `compact-runtime` 0.16.0 with `onchain-runtime-v3` pinned to 3.0.0 / Midnight.js 4.1.1 / Vitest and fast-check.

## Roadmap

Phase 3 operator service, Phase 4 interface, Phase 5 preprod demo and submission, then shielded payments and fee sponsorship.

Licensed under Apache-2.0. See `NOTICE`. Built on Midnight.
