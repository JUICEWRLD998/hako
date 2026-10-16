// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { QUICKNET, tallyOf, type Card } from "../pack.js";
import { bytes, drawOne, futureRound, newSim, sealAll } from "./helpers.js";

setNetworkId("undeployed");

/** A random pack: 2 to 10 cards, random tiers, a random subset advertised (max 3). */
const packArb = fc
  .array(fc.record({ tier: fc.integer({ min: 0, max: 3 }), hit: fc.boolean() }), { minLength: 2, maxLength: 10 })
  .map((cs) => {
    let hits = 0;
    return cs.map(
      (c, i): Card => ({
        id: bytes(`prop-card-${i}`),
        tier: c.tier,
        advertised: c.hit && hits++ < 3,
      }),
    );
  });

describe("properties", () => {
  it("drawing to empty returns exactly the sealed lineup and clears every flag", () => {
    fc.assert(
      fc.property(packArb, (cards) => {
        const { sim, pack } = newSim(cards);
        sealAll(sim, cards.length);
        sim.finalizeSeal();
        const drawn: number[] = [];
        for (let i = 0; i < cards.length; i++) drawn.push(drawOne(sim, pack, i));
        expect([...drawn].sort((a, b) => a - b)).toEqual(cards.map((_, i) => i));
        const t = tallyOf(pack, sim.getLedger());
        expect(t.tiers).toEqual([0n, 0n, 0n, 0n]);
        expect(t.inside.some(Boolean)).toBe(false);
        expect(sim.getLedger().remaining).toBe(0n);
      }),
      { numRuns: 25 },
    );
  }, 300_000);

  type Op = "request" | "fulfil" | "refund";
  it("random interleavings keep remaining + fulfilled == packSize", () => {
    fc.assert(
      fc.property(fc.array(fc.constantFrom<Op>("request", "fulfil", "refund"), { minLength: 5, maxLength: 40 }), (ops) => {
        const { sim } = newSim(undefined);
        sealAll(sim, 12);
        sim.finalizeSeal();
        for (const [n, op] of ops.entries()) {
          const l = sim.getLedger();
          const pending = l.nextRequest - l.nextFulfil;
          if (op === "request" && pending < l.remaining) {
            sim.requestDraw(bytes(`t${n}`), bytes(`s${n}`), futureRound(QUICKNET, sim.time));
          } else if (op === "fulfil" && pending > 0n) {
            sim.fulfillDraw(bytes(`d${n}`));
          } else if (op === "refund" && pending > 0n) {
            sim.setTime(l.requests.lookup(l.nextFulfil).deadline);
            sim.refundStalled(l.nextFulfil);
          }
          const after = sim.getLedger();
          const fulfilled = after.nextFulfil - after.stalled;
          expect(after.remaining + fulfilled).toBe(after.packSize);
          expect(after.results.size()).toBe(fulfilled);
        }
      }),
      { numRuns: 12 },
    );
  }, 300_000);

  it("the seed tip always equals the last revealed link", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 6 }), (draws) => {
        const { sim, pack, params } = newSim();
        sealAll(sim, 12);
        sim.finalizeSeal();
        expect(sim.getLedger().seedTip).toEqual(params.seedTip0);
        for (let i = 0; i < draws; i++) drawOne(sim, pack, i);
        expect(sim.getLedger().seedTip).toEqual(pack.seedChain[draws - 1]);
      }),
      { numRuns: 6 },
    );
  }, 120_000);
});
