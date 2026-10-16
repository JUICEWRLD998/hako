// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
//
// Spike S1: the draw index must be word mod remaining, with no freedom for the prover.
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { QUICKNET } from "../pack.js";
import { pureCircuits } from "../managed/hako/contract/index.js";
import { witnesses } from "../witnesses.js";
import { bytes, futureRound, openPack } from "./helpers.js";

setNetworkId("undeployed");

/** Independent JS reference: the first 8 bytes of the digest as a little-endian u64. */
const referenceWord = (digest: Uint8Array): bigint => new DataView(digest.buffer, digest.byteOffset, 8).getBigUint64(0, true);

describe("S1: uniform index", () => {
  it("S1: the in-circuit word matches the JS reference on 10,000 random digests", () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 32, maxLength: 32 }), (d) => {
        expect(pureCircuits.drawWord(d)).toBe(referenceWord(d));
      }),
      { numRuns: 10_000 },
    );
  });

  it("S1: planted control, the reference rejects a deliberately wrong word", () => {
    const d = bytes("planted");
    expect(pureCircuits.drawWord(d)).not.toBe(referenceWord(d) + 1n);
  });

  it("S1: wrong remainder fails (r + 1)", () => {
    const { sim } = openPack({
      indexParts: ({ privateState }, word, modulus) => [privateState, [word / modulus, (word % modulus) + 1n]],
    });
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    expect(() => sim.fulfillDraw(bytes("d"))).toThrow(/index is not word mod remaining|remainder out of range/);
    expect(sim.getLedger().results.size()).toBe(0n);
  });

  it("S1: a second valid-looking split (q - 1, r + remaining) fails", () => {
    const { sim } = openPack({
      indexParts: ({ privateState }, word, modulus) => {
        const q = word / modulus;
        return [privateState, q === 0n ? [0n, word % modulus] : [q - 1n, (word % modulus) + modulus]];
      },
    });
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    expect(() => sim.fulfillDraw(bytes("d"))).toThrow(/remainder out of range/);
  });

  it("S1: the honest split passes for random buyer seeds and drand values (60 draws)", () => {
    const word32 = fc.uint8Array({ minLength: 32, maxLength: 32 });
    fc.assert(
      fc.property(fc.array(fc.tuple(word32, word32), { minLength: 12, maxLength: 12 }), (pairs) => {
        const { sim } = openPack({ indexParts: witnesses.indexParts });
        pairs.forEach(([seed, drand], i) => {
          const remaining = sim.getLedger().remaining;
          sim.requestDraw(bytes(`t${i}`), seed, futureRound(QUICKNET, sim.time));
          sim.fulfillDraw(drand);
          const res = sim.getLedger().results.lookup(BigInt(i));
          const word = pureCircuits.drawWord(pureCircuits.drawDigest(res.link, seed, drand));
          expect(res.slot).toBe(word % remaining);
        });
      }),
      { numRuns: 5 },
    );
  }, 120_000);

  it("S1: indexes are close to uniform over 12 slots (chi-square, 6,000 draws of the pure function)", () => {
    const counts = new Array(12).fill(0);
    for (let i = 0; i < 6000; i++) {
      const d = pureCircuits.drawDigest(bytes(`l${i}`), bytes(`s${i}`), bytes(`d${i}`));
      counts[Number(pureCircuits.drawWord(d) % 12n)] += 1;
    }
    const expected = 500;
    const chi = counts.reduce((a, c) => a + (c - expected) ** 2 / expected, 0);
    // 11 degrees of freedom; 31.26 is the 0.001 critical value.
    expect(chi).toBeLessThan(31.26);
  });
});
