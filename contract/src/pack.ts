// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
//
// The operator's pack: real cards, salts and the seed chain. Everything the
// witnesses need is derived from this file plus the public ledger, so the
// operator can resume after a crash without any extra state.

import { createHash } from "node:crypto";
import {
  pureCircuits,
  type Item,
  type Ledger,
  type Params,
  type Tally,
} from "./managed/hako/contract/index.js";

export const TIER_COUNT = 4;
export const MAX_HITS = 16;

const enc = new TextEncoder();

export const sha256 = (...parts: Uint8Array[]): Uint8Array => {
  const h = createHash("sha256");
  for (const p of parts) h.update(p);
  return new Uint8Array(h.digest());
};

const u64 = (n: bigint): Uint8Array => {
  const out = new Uint8Array(8);
  new DataView(out.buffer).setBigUint64(0, n, false);
  return out;
};

/** Unused advertised leaves hold this sentinel. Nobody knows a preimage for it. */
export const NONE_LEAF: Uint8Array = sha256(enc.encode("hako:none"));

export type SealedEntry = { item: Item; salt: Uint8Array };

export type Pack = {
  secretKey: Uint8Array;
  /** Cards in sealing order: entry i is sealed into slot i. */
  entries: SealedEntry[];
  /** The 16 advertised leaves, NONE_LEAF where unused. */
  hitLeaves: Uint8Array[];
  /** Seed links in the order they are revealed, one per draw. */
  seedChain: Uint8Array[];
};

export type Card = {
  /** 32-byte identity: for a graded card, a hash that includes the cert ID. */
  id: Uint8Array;
  tier: number;
  /** Advertise this card as a named hit. */
  advertised?: boolean;
};

export type DrandConfig = {
  genesis: bigint;
  period: bigint;
  /** Seconds before a drand round the request must land. */
  lead: bigint;
  /** Seconds after the round the operator has to fulfil before a refund opens. */
  grace: bigint;
};

/** drand quicknet: genesis and period to be confirmed against /info in Phase 0. */
export const QUICKNET: DrandConfig = {
  genesis: 1692803367n,
  period: 3n,
  lead: 3n,
  grace: 600n,
};

const derive = (secretKey: Uint8Array, label: string, n: bigint): Uint8Array =>
  sha256(secretKey, enc.encode(label), u64(n));

/** Deterministic salt for the card sealed in slot i. */
export const saltFor = (sk: Uint8Array, i: number): Uint8Array =>
  derive(sk, "hako:salt", BigInt(i));

/** Deterministic commitment randomness for tally version v. */
export const tallyRandFor = (sk: Uint8Array, version: bigint): Uint8Array =>
  derive(sk, "hako:tally", version);

export function buildPack(
  secretKey: Uint8Array,
  cards: Card[],
  drand: DrandConfig = QUICKNET,
): { pack: Pack; params: Params } {
  if (cards.length === 0 || cards.length > 128) throw new Error("a pack holds 1 to 128 cards");
  const hitLeaves: Uint8Array[] = Array.from({ length: MAX_HITS }, () => NONE_LEAF);
  const entries: SealedEntry[] = [];
  const targets: bigint[] = Array.from({ length: TIER_COUNT }, () => 0n);
  let hits = 0;
  cards.forEach((c, i) => {
    if (c.id.length !== 32) throw new Error("card id must be 32 bytes");
    if (!Number.isInteger(c.tier) || c.tier < 0 || c.tier >= TIER_COUNT) throw new Error("tier must be 0..3");
    let adv = 0n;
    if (c.advertised) {
      if (hits >= MAX_HITS) throw new Error("at most 16 advertised hits");
      hitLeaves[hits] = pureCircuits.hitLeaf(c.id, BigInt(c.tier));
      hits += 1;
      adv = BigInt(hits);
    }
    targets[c.tier] += 1n;
    entries.push({ item: { id: c.id, tier: BigInt(c.tier), adv }, salt: saltFor(secretKey, i) });
  });

  // c_0 = seed, c_{i+1} = H(c_i). The tip is c_N; links are revealed c_{N-1}, ..., c_0.
  const n = cards.length;
  const chain: Uint8Array[] = [derive(secretKey, "hako:seed", 0n)];
  for (let i = 0; i < n; i++) chain.push(pureCircuits.seedLinkHash(chain[i]));
  const seedChain = chain.slice(0, n).reverse();

  const params: Params = {
    size: BigInt(n),
    targets,
    hitLeaves,
    hitCount: BigInt(hits),
    seedTip0: chain[n],
    drandGenesis: drand.genesis,
    drandPeriod: drand.period,
    lead: drand.lead,
    grace: drand.grace,
  };
  return { pack: { secretKey, entries, hitLeaves, seedChain }, params };
}

/** Which entry sits in each slot right now, replayed from the public ledger. */
export function arrangement(pack: Pack, ledger: Ledger): number[] {
  const n = pack.entries.length;
  if (ledger.phase === 0 /* SEALING */) {
    return Array.from({ length: Number(ledger.sealedCount) }, (_, i) => i);
  }
  const arr = Array.from({ length: n }, (_, i) => i);
  const drawn = [...ledger.results].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  for (const [, res] of drawn) {
    const slot = Number(res.slot);
    arr[slot] = arr[arr.length - 1];
    arr.pop();
  }
  for (let i = 0n; i < ledger.revealed.size(); i++) arr.pop();
  return arr;
}

export const emptyTally = (): Tally => ({
  tiers: Array.from({ length: TIER_COUNT }, () => 0n),
  inside: Array.from({ length: MAX_HITS }, () => false),
});

/** The operator's private tally: what is sealed right now. */
export function tallyOf(pack: Pack, ledger: Ledger): Tally {
  const t = emptyTally();
  for (const e of arrangement(pack, ledger)) {
    const it = pack.entries[e].item;
    t.tiers[Number(it.tier)] += 1n;
    if (it.adv > 0n) t.inside[Number(it.adv) - 1] = true;
  }
  return t;
}

/** Version of the tally commitment currently on the ledger. */
export const tallyVersion = (ledger: Ledger): bigint =>
  ledger.sealedCount + ledger.results.size() + ledger.revealed.size();
