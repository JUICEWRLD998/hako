// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { bytes, demoCards, futureRound, newSim, sealAll } from "./helpers.js";
import { QUICKNET } from "../pack.js";

setNetworkId("undeployed");

describe("end to end", () => {
  it("seals a 12-card pack, finalizes it and fulfils 3 draws", () => {
    const { sim } = newSim();
    sealAll(sim, 12);
    expect(sim.getLedger().sealedCount).toBe(12n);
    sim.finalizeSeal();
    expect(sim.getLedger().phase).toBe(1);
    expect(sim.getLedger().remaining).toBe(12n);

    for (let i = 0; i < 3; i++) {
      const round = futureRound(QUICKNET, 1_700_000_000n);
      sim.requestDraw(bytes(`tag-${i}`), bytes(`seed-${i}`), round);
      sim.fulfillDraw(bytes(`drand-${i}`));
    }
    const l = sim.getLedger();
    expect(l.remaining).toBe(9n);
    expect(l.results.size()).toBe(3n);
    expect(l.nextFulfil).toBe(3n);
  });
});
