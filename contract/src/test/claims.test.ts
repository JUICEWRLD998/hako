// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { QUICKNET, arrangement } from "../pack.js";
import { pureCircuits } from "../managed/hako/contract/index.js";
import { bytes, futureRound, newSim, openPack, sealAll } from "./helpers.js";

setNetworkId("undeployed");

/** One draw by a buyer who keeps (secret, nonce). Returns the buyer's receipt with the card. */
const buyerDraw = (ctx: ReturnType<typeof openPack>) => {
  const { sim, pack } = ctx;
  const secret = bytes("buyer-secret");
  const nonce = bytes("buyer-nonce");
  const before = arrangement(pack, sim.getLedger());
  sim.requestDraw(pureCircuits.buyerTagOf(secret, nonce), bytes("buyer-seed"), futureRound(QUICKNET, sim.time));
  sim.fulfillDraw(bytes("drand"));
  const entry = pack.entries[before[Number(sim.getLedger().results.lookup(0n).slot)]];
  return { operator: { pack }, buyer: { secret, nonce, item: entry.item, salt: entry.salt } };
};

describe("claims", () => {
  it("claim: succeeds once and only once", () => {
    const ctx = openPack();
    const { buyer } = buyerDraw(ctx);
    ctx.sim.setPrivateState({ buyer });
    ctx.sim.claimItem(0n);
    expect(ctx.sim.getLedger().claimed.size()).toBe(1n);
    expect(() => ctx.sim.claimItem(0n)).toThrow(/already claimed/);
    expect(ctx.sim.getLedger().claimed.size()).toBe(1n);
  });

  it("claim: the nullifier is not the public tag", () => {
    const ctx = openPack();
    const { buyer } = buyerDraw(ctx);
    ctx.sim.setPrivateState({ buyer });
    ctx.sim.claimItem(0n);
    const [nullifier] = [...ctx.sim.getLedger().claimed];
    expect(nullifier).toEqual(pureCircuits.claimNullifierOf(buyer.secret, buyer.nonce));
    expect(nullifier).not.toEqual(ctx.sim.getLedger().requests.lookup(0n).buyerTag);
  });

  it("claim: rejects the wrong secret", () => {
    const ctx = openPack();
    const { buyer } = buyerDraw(ctx);
    ctx.sim.setPrivateState({ buyer: { ...buyer, secret: bytes("guess") } });
    expect(() => ctx.sim.claimItem(0n)).toThrow(/not the buyer of this draw/);
    expect(ctx.sim.getLedger().claimed.size()).toBe(0n);
  });

  it("claim: rejects a card that is not the one drawn", () => {
    const ctx = openPack();
    const { buyer } = buyerDraw(ctx);
    ctx.sim.setPrivateState({ buyer: { ...buyer, item: { ...buyer.item, id: bytes("other-card") } } });
    expect(() => ctx.sim.claimItem(0n)).toThrow(/opening does not match the drawn card/);
  });

  it("claim: rejects a draw that has no result yet", () => {
    const ctx = openPack();
    const secret = bytes("s");
    const nonce = bytes("n");
    ctx.sim.requestDraw(pureCircuits.buyerTagOf(secret, nonce), bytes("seed"), futureRound(QUICKNET, ctx.sim.time));
    const card = ctx.pack.entries[0];
    ctx.sim.setPrivateState({ buyer: { secret, nonce, item: card.item, salt: card.salt } });
    expect(() => ctx.sim.claimItem(0n)).toThrow();
  });
});

describe("refunds", () => {
  it("refund: only after the deadline and only while unfulfilled", () => {
    const { sim } = openPack();
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    expect(() => sim.refundStalled(0n)).toThrow(/deadline has not passed/);

    sim.setTime(sim.getLedger().requests.lookup(0n).deadline);
    sim.refundStalled(0n);
    const l = sim.getLedger();
    expect(l.stalled).toBe(1n);
    expect(l.nextFulfil).toBe(1n);
    expect(l.requests.lookup(0n).refunded).toBe(true);
    expect(l.remaining).toBe(12n);
    expect(() => sim.refundStalled(0n)).toThrow(/nothing is waiting/);
  });

  it("refund: a fulfilled request cannot be refunded", () => {
    const { sim } = openPack();
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    sim.fulfillDraw(bytes("d"));
    sim.setTime(sim.time + 100_000n);
    expect(() => sim.refundStalled(0n)).toThrow(/nothing is waiting/);
  });

  it("refund: only the oldest request, so the operator cannot skip a draw", () => {
    const { sim } = openPack();
    const round = futureRound(QUICKNET, sim.time);
    sim.requestDraw(bytes("a"), bytes("s"), round);
    sim.requestDraw(bytes("b"), bytes("s"), round);
    sim.setTime(sim.getLedger().requests.lookup(1n).deadline + 1n);
    expect(() => sim.refundStalled(1n)).toThrow(/only the oldest request can be refunded/);
    sim.refundStalled(0n);
    sim.refundStalled(1n);
    expect(sim.getLedger().stalled).toBe(2n);
  });

  it("refund: anyone can call it, no operator secret needed", () => {
    const { sim } = openPack();
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    sim.setTime(sim.getLedger().requests.lookup(0n).deadline);
    sim.setPrivateState({});
    sim.refundStalled(0n);
    expect(sim.getLedger().stalled).toBe(1n);
  });
});

describe("unsealing", () => {
  it("unseal: reveals the remaining cards and closes only when the pool is empty", () => {
    const { sim, pack } = openPack();
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    sim.fulfillDraw(bytes("d"));
    for (let i = 0; i < 10; i++) {
      sim.unsealOne();
      expect(sim.getLedger().phase).toBe(2);
    }
    sim.unsealOne();
    const l = sim.getLedger();
    expect(l.phase).toBe(3);
    expect(l.remaining).toBe(0n);
    expect(l.revealed.size()).toBe(11n);
    const drawnEntry = [...l.results][0];
    const revealedIds = new Set([...l.revealed].map(([, it]) => Buffer.from(it.id).toString("hex")));
    const all = new Set(pack.entries.map((e) => Buffer.from(e.item.id).toString("hex")));
    expect(revealedIds.size).toBe(11);
    expect(all.size - revealedIds.size).toBe(1);
    expect(drawnEntry[1].slot).toBeLessThan(12n);
    expect(() => sim.unsealOne()).toThrow(/pack is not open/);
  });

  it("unseal: draws are refused once unsealing has started", () => {
    const { sim } = openPack();
    sim.unsealOne();
    expect(sim.getLedger().phase).toBe(2);
    expect(() => sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time))).toThrow(/pack is not open/);
  });

  it("unseal: refused while requests are waiting", () => {
    const { sim } = openPack();
    sim.requestDraw(bytes("t"), bytes("s"), futureRound(QUICKNET, sim.time));
    expect(() => sim.unsealOne()).toThrow(/requests are still waiting/);
  });

  it("unseal: refused before the pack is open", () => {
    const { sim } = newSim();
    sealAll(sim, 3);
    expect(() => sim.unsealOne()).toThrow(/pack is not open/);
  });
});
