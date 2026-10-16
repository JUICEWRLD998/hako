// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
import { buildPack, sha256, type Card, type DrandConfig, QUICKNET } from "../pack.js";
import { HakoSimulator } from "./hako.simulator.js";
import type { witnesses } from "../witnesses.js";

const enc = new TextEncoder();
export const bytes = (s: string): Uint8Array => sha256(enc.encode(s));
export const OPERATOR_KEY = bytes("test-operator");

/** Tiers of a 12-card demo pack: 1 S, 2 A, 3 B, 6 C. Cards 0 and 1 are advertised hits. */
export const DEMO_TIERS = [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3];

export const demoCards = (tiers = DEMO_TIERS, hits = [0, 1]): Card[] =>
  tiers.map((tier, i) => ({ id: bytes(`card-${i}`), tier, advertised: hits.includes(i) }));

export const newSim = (
  cards = demoCards(),
  drand: DrandConfig = QUICKNET,
  startTime = 1_700_000_000n,
  overrides: Partial<typeof witnesses> = {},
) => {
  const { pack, params } = buildPack(OPERATOR_KEY, cards, drand);
  return { sim: new HakoSimulator(pack, params, startTime, overrides), pack, params };
};

/** A sealed, finalized 12-card pack ready for requests. */
export const openPack = (overrides: Partial<typeof witnesses> = {}) => {
  const ctx = newSim();
  sealAll(ctx.sim, 12);
  ctx.sim.finalizeSeal();
  ctx.sim.useWitnesses(overrides);
  return ctx;
};

export const sealAll = (sim: HakoSimulator, n: number): void => {
  for (let i = 0; i < n; i++) sim.sealSlot();
};

/** A drand round that is still `ahead` seconds in the future at block time `now`. */
export const futureRound = (drand: DrandConfig, now: bigint, ahead = 100n): bigint =>
  (now + ahead - drand.genesis) / drand.period + 2n;

import { arrangement, type Pack } from "../pack.js";

/**
 * Requests and fulfils one draw. Returns the entry index (position in the
 * pack file) of the card that left the pool, found by replaying the
 * arrangement before the draw.
 */
export const drawOne = (sim: HakoSimulator, pack: Pack, n: number, drand: DrandConfig = QUICKNET): number => {
  const before = arrangement(pack, sim.getLedger());
  const id = sim.getLedger().nextFulfil;
  sim.requestDraw(bytes(`tag-${n}`), bytes(`seed-${n}`), futureRound(drand, sim.time));
  sim.fulfillDraw(bytes(`drand-${n}`));
  const res = sim.getLedger().results.lookup(id);
  return before[Number(res.slot)];
};

/** Names of the public ledger fields whose value differs between two snapshots. */
export const changedFields = (a: Record<string, unknown>, b: Record<string, unknown>): string[] =>
  Object.keys(a)
    .filter((k) => JSON.stringify(a[k], bigintReplacer) !== JSON.stringify(b[k], bigintReplacer))
    .sort();

const bigintReplacer = (_k: string, v: unknown): unknown =>
  typeof v === "bigint" ? `${v}n` : v instanceof Uint8Array ? Array.from(v) : v;

import type { Ledger } from "../managed/hako/contract/index.js";

/** Every public ledger field as plain data, so two states can be diffed. */
export const publicSnapshot = (l: Ledger): Record<string, unknown> => ({
  operator: l.operator,
  phase: l.phase,
  packSize: l.packSize,
  tierTargets: l.tierTargets,
  advertisedRoot: l.advertised.root(),
  advertisedCount: l.advertisedCount,
  slots: [...l.slots],
  sealedCount: l.sealedCount,
  remaining: l.remaining,
  tallyCommit: l.tallyCommit,
  seedTip: l.seedTip,
  requests: [...l.requests],
  results: [...l.results],
  nextRequest: l.nextRequest,
  nextFulfil: l.nextFulfil,
  statements: [...l.statements],
  nextStatement: l.nextStatement,
  claimed: [...l.claimed],
  stalled: l.stalled,
  revealed: [...l.revealed],
});
