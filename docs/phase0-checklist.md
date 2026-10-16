# Phase 0 checklist: the steps that need your machine

The cloud container that built Phases 0 to 2 has no Docker daemon and cannot reach
drand or the Midnight faucet. Everything below needs a machine that can.
Do these in order; the slow one is first.

## 1. Start the preprod wallet sync now (about 2 hours)

Do this first. It runs in the background while you do the rest.

## 2. Install the pinned stack

```bash
node -v                        # example-bboard wants Node 24.11.1 or newer
git clone https://github.com/juicewrld998/hako && cd hako
git checkout claude/brave-bohr-x9gfga
npm install                    # .npmrc sets legacy-peer-deps; overrides pin onchain-runtime 3.0.0
npm run toolchain              # compactc 0.31.1 into .toolchain/
docker pull midnightntwrk/proof-server:8.1.3
```

Then bring up `midnightntwrk/midnight-local-dev`.

## 3. Prove the stack works with the reference contract first

Before deploying HAKO, deploy `midnightntwrk/example-bboard` to local dev and to preprod.
If that works, any later HAKO failure is HAKO's, not the toolchain's. If it fails, you have
found a stack problem in an hour instead of in the middle of Phase 3.

## 4. Check drand

```bash
node scripts/drand-check.mjs
```

Commit `docs/drand-quicknet-sample.json`. If it prints MISMATCH, change `QUICKNET` in
`contract/src/pack.ts` before anything is deployed.

## 5. Get preprod tDUST from the faucet

## 6. Post the two Discord questions from `strategy/INTAKE.md`

## 7. Deploy HAKO

The deploy script (`api/`) is the first thing Phase 3 builds. It is deliberately not written
yet: it needs a working wallet provider stack to test against, and writing it blind would
produce code nobody has run. Once step 3 passes, ask for it and it gets built against the
pattern you just proved works.

**Done when:** a contract deploys on local dev and on preprod, its address is printed, and a
state read returns the constructor values.
