// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { bytes, drawOne, newSim, sealAll } from "./helpers.js";

setNetworkId("undeployed");

const open = () => {
  const ctx = newSim();
  sealAll(ctx.sim, 12);
  ctx.sim.finalizeSeal();
  return ctx;
};

describe("statements about the hidden tally", () => {
  it("stillInside: true until the hit is drawn, then rejected", () => {
    const { sim, pack } = open();
    sim.proveStillInside(0n);
    sim.proveStillInside(1n);
    expect(sim.getLedger().statements.size()).toBe(2n);
    const s0 = sim.getLedger().statements.lookup(0n);
    expect([s0.kind, s0.a, s0.at]).toEqual([1n, 0n, 0n]);

    // Draw until entry 0 (advertised hit #1) leaves the pool.
    let n = 0;
    let gone = false;
    while (!gone && n < 12) {
      gone = drawOne(sim, pack, n) === 0;
      n += 1;
      if (!gone) sim.proveStillInside(0n);
    }
    expect(gone).toBe(true);
    expect(() => sim.proveStillInside(0n)).toThrow(/that hit is not inside/);
    // The statement recorded earlier still shows when it was true.
    expect(sim.getLedger().statements.lookup(0n).at).toBe(0n);
  });

  it("stillInside: rejects an index that is not an advertised hit", () => {
    const { sim } = open();
    expect(() => sim.proveStillInside(2n)).toThrow(/that hit is not inside/);
    expect(() => sim.proveStillInside(16n)).toThrow(/advertised index out of range/);
  });

  it("atLeast: bound checks", () => {
    const { sim } = open();
    sim.proveAtLeast(3n, 6n);
    sim.proveAtLeast(0n, 1n);
    expect(() => sim.proveAtLeast(3n, 7n)).toThrow(/fewer cards than claimed/);
    expect(() => sim.proveAtLeast(0n, 2n)).toThrow(/fewer cards than claimed/);
    expect(() => sim.proveAtLeast(4n, 0n)).toThrow(/tier out of range/);
    expect(sim.getLedger().statements.size()).toBe(2n);
  });

  it("atLeast: the count falls as cards are drawn", () => {
    const { sim, pack } = open();
    for (let i = 0; i < 12; i++) drawOne(sim, pack, i);
    expect(() => sim.proveAtLeast(3n, 1n)).toThrow(/fewer cards than claimed/);
    sim.proveAtLeast(3n, 0n);
  });

  it("statements: only the operator can make them", () => {
    const { sim, pack } = open();
    sim.setPrivateState({ pack: { ...pack, secretKey: bytes("other") } });
    expect(() => sim.proveStillInside(0n)).toThrow(/caller is not the operator/);
  });
});
