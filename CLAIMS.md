# CLAIMS

Every claim made in the README, and the command that checks it. Run them yourself.

| Claim | Command | Expected |
|---|---|---|
| The contract compiles on the pinned toolchain and defines 9 circuits | `npm run toolchain && npm run compact` | `Compiling 9 circuits` |
| Every declared witness is implemented | `node scripts/check-witnesses.mjs` | `every declared witness is implemented` |
| The witness check can fail | `node scripts/check-witnesses.mjs --self-test` | `planted missing witness b detected` |
| 52 simulator tests, all asserting ledger state | `npm test` | `Tests 52 passed` |
| The tests catch a broken contract | `npm run check:mutants` | `11/11 mutants killed` |
| No placeholder content ships | `npm run check:grep` | `pre-submit grep clean` |
| The onchain runtime resolves to one copy, 3.0.0 | `npm ls @midnight-ntwrk/onchain-runtime-v3` | every line `3.0.0` |

Claims that need a deployment (contract address, tx hashes of real draws) are not made yet.
They appear here once they can be re-run.
