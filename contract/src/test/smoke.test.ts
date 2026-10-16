// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { buildPack, sha256 } from "../pack.js";
import { HakoSimulator } from "./hako.simulator.js";

setNetworkId("undeployed");

describe("constructor", () => {
  it("publishes the lineup and starts in SEALING", () => {
    const sk = sha256(new TextEncoder().encode("operator"));
    const cards = [0, 0, 1, 2, 3].map((tier, i) => ({
      id: sha256(new TextEncoder().encode(`card-${i}`)),
      tier,
      advertised: i === 3,
    }));
    const { pack, params } = buildPack(sk, cards);
    const sim = new HakoSimulator(pack, params);
    const l = sim.getLedger();
    expect(l.phase).toBe(0);
    expect(l.packSize).toBe(5n);
    expect(l.tierTargets).toEqual([2n, 1n, 1n, 1n]);
    expect(l.advertisedCount).toBe(1n);
    expect(l.remaining).toBe(0n);
    expect(l.seedTip).toEqual(params.seedTip0);
  });
});
