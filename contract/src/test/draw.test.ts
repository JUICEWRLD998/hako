// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { QUICKNET } from "../pack.js";
import { pureCircuits } from "../managed/hako/contract/index.js";
import { witnesses } from "../witnesses.js";
import { bytes, drawOne, futureRound, newSim, openPack, sealAll } from "./helpers.js";

setNetworkId("undeployed");

describe("requests", () => {
  it("request: rejects a past drand round", () => {
    const { sim } = openPack();
    // A round whose time is not after now + lead may already be known.
    const pastRound = (sim.time - QUICKNET.genesis) / QUICKNET.period;
    expect(() => sim.requestDraw(bytes("t"), bytes("s"), pastRound)).toThrow(/no longer in the future/);
    expect(sim.getLedger().nextRequest).toBe(0n);
  });

  it("request: accepts a round that is still ahead and records the deadline", () => {
    const { sim } = openPack();
    const round = futureRound(QUICKNET, sim.time);
    sim.requestDraw(bytes("t"), bytes("s"), round);
    const r = sim.getLedger().requests.lookup(0n);
    expect(r.drandRound).toBe(round);
    expect(r.deadline).toBe(pureCircuits.roundTime(QUICKNET.genesis, QUICKNET.period, round) + QUICKNET.grace);
    expect(r.refunded).toBe(false);
  });

  it("request: rejects when pending >= remaining", () => {
    const { sim } = openPack();
    const round = futureRound(QUICKNET, sim.time);
    for (let i = 0; i < 12; i++) sim.requestDraw(bytes(`t${i}`), bytes(`s${i}`), round);
    expect(() => sim.requestDraw(bytes("t12"), bytes("s12"), round)).toThrow(/more requests than cards left/);
  });

  it("request: rejects before the pack is open", () => {
    const { sim } = newSim();
    expect(() => sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time))).toThrow(/pack is not open/);
  });

  it("request: rejects a caller who is not the operator", () => {
    const { sim } = openPack();
    sim.setPrivateState({ pack: { ...sim.getPrivateState().pack!, secretKey: bytes("someone-else") } });
    expect(() => sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time))).toThrow(
      /caller is not the operator/,
    );
  });
});

describe("fulfilment", () => {
  it("fulfil: FIFO, the oldest request is served first", () => {
    const { sim } = openPack();
    const round = futureRound(QUICKNET, sim.time);
    sim.requestDraw(bytes("tag-a"), bytes("seed-a"), round);
    sim.requestDraw(bytes("tag-b"), bytes("seed-b"), round);
    sim.fulfillDraw(bytes("drand"));
    const l = sim.getLedger();
    expect(l.results.member(0n)).toBe(true);
    expect(l.results.member(1n)).toBe(false);
    expect(l.nextFulfil).toBe(1n);
    // Request 0's buyer seed decided the slot.
    const digest = pureCircuits.drawDigest(l.results.lookup(0n).link, bytes("seed-a"), bytes("drand"));
    expect(pureCircuits.drawWord(digest) % 12n).toBe(l.results.lookup(0n).slot);
  });

  it("fulfil: rejects with nothing waiting", () => {
    const { sim } = openPack();
    expect(() => sim.fulfillDraw(bytes("drand"))).toThrow(/no request waiting/);
  });

  it("fulfil: rejects a wrong seed link", () => {
    const { sim } = openPack({
      nextSeedLink: ({ privateState }) => [privateState, bytes("not-in-the-chain")],
    });
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    expect(() => sim.fulfillDraw(bytes("drand"))).toThrow(/seed link does not extend the chain/);
    expect(sim.getLedger().results.size()).toBe(0n);
  });

  it("fulfil: rejects a forged opening", () => {
    const { sim } = openPack({
      slotOpening: (ctx, slot) => {
        const [ps, [item, salt]] = witnesses.slotOpening(ctx, slot);
        return [ps, [{ ...item, id: bytes("forged") }, salt]];
      },
    });
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    expect(() => sim.fulfillDraw(bytes("drand"))).toThrow(/private card does not open the slot/);
  });

  it("fulfil: rejects a stale tally", () => {
    const { sim } = openPack({
      currentTally: (ctx) => {
        const [ps, [tally, r]] = witnesses.currentTally(ctx);
        return [ps, [{ ...tally, tiers: [tally.tiers[0], tally.tiers[1], tally.tiers[2], tally.tiers[3] + 1n] }, r]];
      },
    });
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    expect(() => sim.fulfillDraw(bytes("drand"))).toThrow(/private tally does not open the commitment/);
  });

  it("fulfil: recorded slot equals the public recomputation", () => {
    const { sim, pack } = openPack();
    sim.requestDraw(bytes("tag"), bytes("seed"), futureRound(QUICKNET, sim.time));
    const remainingBefore = sim.getLedger().remaining;
    sim.fulfillDraw(bytes("drand"));
    const res = sim.getLedger().results.lookup(0n);
    const digest = pureCircuits.drawDigest(res.link, bytes("seed"), bytes("drand"));
    expect(res.slot).toBe(pureCircuits.drawWord(digest) % remainingBefore);
    expect(res.link).toEqual(pack.seedChain[0]);
    expect(sim.getLedger().seedTip).toEqual(res.link);
  });

  it("fulfil: swap-and-pop moves the last slot into the hole", () => {
    const { sim } = openPack();
    const lastLeaf = sim.getLedger().slots.lookup(11n);
    sim.requestDraw(bytes("tag"), bytes("seed"), futureRound(QUICKNET, sim.time));
    sim.fulfillDraw(bytes("drand"));
    const l = sim.getLedger();
    const slot = l.results.lookup(0n).slot;
    expect(l.slots.size()).toBe(11n);
    expect(l.slots.member(11n)).toBe(false);
    if (slot !== 11n) expect(l.slots.lookup(slot)).toEqual(lastLeaf);
  });

  it("drawing every card empties the pool", () => {
    const { sim, pack } = newSim();
    sealAll(sim, 12);
    sim.finalizeSeal();
    const drawn: number[] = [];
    for (let i = 0; i < 12; i++) drawn.push(drawOne(sim, pack, i));
    expect([...drawn].sort((a, b) => a - b)).toEqual(Array.from({ length: 12 }, (_, i) => i));
    expect(sim.getLedger().remaining).toBe(0n);
    expect(sim.getLedger().slots.size()).toBe(0n);
  });
});
