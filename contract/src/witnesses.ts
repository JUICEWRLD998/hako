// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
//
// Implements every witness declared in hako.compact (scripts/check-witnesses.mjs
// fails CI if one is missing). Operator witnesses are pure functions of the pack
// file and the public ledger; buyer witnesses read the buyer's receipt.

import type { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import type { Item, Ledger } from "./managed/hako/contract/index.js";
import { arrangement, tallyOf, tallyRandFor, tallyVersion, type Pack } from "./pack.js";

export type BuyerReceipt = {
  secret: Uint8Array;
  nonce: Uint8Array;
  /** The card the buyer was handed off-chain, with its salt. */
  item?: Item;
  salt?: Uint8Array;
};

export type HakoPrivateState = {
  pack?: Pack;
  buyer?: BuyerReceipt;
};

type Ctx = WitnessContext<Ledger, HakoPrivateState>;

const need = <T>(v: T | undefined, what: string): T => {
  if (v === undefined) throw new Error(`private state has no ${what}`);
  return v;
};

export const witnesses = {
  operatorSecret: ({ privateState }: Ctx): [HakoPrivateState, Uint8Array] => [
    privateState,
    need(privateState.pack, "pack").secretKey,
  ],

  slotOpening: (
    { privateState, ledger }: Ctx,
    slot: bigint,
  ): [HakoPrivateState, [Item, Uint8Array]] => {
    const pack = need(privateState.pack, "pack");
    // While sealing, the slot being sealed is the next entry; afterwards it is replayed.
    const entry =
      ledger.phase === 0
        ? pack.entries[Number(slot)]
        : pack.entries[arrangement(pack, ledger)[Number(slot)]];
    if (!entry) throw new Error(`no card for slot ${slot}`);
    return [privateState, [entry.item, entry.salt]];
  },

  currentTally: ({ privateState, ledger }: Ctx) => {
    const pack = need(privateState.pack, "pack");
    return [
      privateState,
      [tallyOf(pack, ledger), tallyRandFor(pack.secretKey, tallyVersion(ledger))],
    ] as [HakoPrivateState, [ReturnType<typeof tallyOf>, Uint8Array]];
  },

  freshRand: ({ privateState }: Ctx, label: bigint): [HakoPrivateState, Uint8Array] => [
    privateState,
    tallyRandFor(need(privateState.pack, "pack").secretKey, label),
  ],

  nextSeedLink: ({ privateState, ledger }: Ctx): [HakoPrivateState, Uint8Array] => {
    const pack = need(privateState.pack, "pack");
    const link = pack.seedChain[Number(ledger.results.size())];
    if (!link) throw new Error("seed chain exhausted");
    return [privateState, link];
  },

  advertisedPath: ({ privateState, ledger }: Ctx, leaf: bigint) => {
    const pack = need(privateState.pack, "pack");
    const k = Number(leaf);
    return [privateState, ledger.advertised.pathForLeaf(BigInt(k), pack.hitLeaves[k])] as [
      HakoPrivateState,
      ReturnType<Ledger["advertised"]["pathForLeaf"]>,
    ];
  },

  indexParts: (
    { privateState }: Ctx,
    word: bigint,
    modulus: bigint,
  ): [HakoPrivateState, [bigint, bigint]] => {
    if (modulus === 0n) throw new Error("modulus is zero");
    return [privateState, [word / modulus, word % modulus]];
  },

  buyerSecret: ({ privateState }: Ctx): [HakoPrivateState, [Uint8Array, Uint8Array]] => {
    const b = need(privateState.buyer, "buyer receipt");
    return [privateState, [b.secret, b.nonce]];
  },

  buyerOpening: ({ privateState }: Ctx): [HakoPrivateState, [Item, Uint8Array]] => {
    const b = need(privateState.buyer, "buyer receipt");
    return [privateState, [need(b.item, "card in receipt"), need(b.salt, "salt in receipt")]];
  },
};
