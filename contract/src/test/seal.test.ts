// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
import { describe, it, expect } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { buildPack, type Pack } from "../pack.js";
import { bytes, changedFields, demoCards, newSim, publicSnapshot, sealAll } from "./helpers.js";

setNetworkId("undeployed");

/** Swap an entry for a different card while the public lineup stays as advertised. */
const tampered = (pack: Pack, i: number, patch: Partial<Pack["entries"][number]["item"]>): Pack => ({
  ...pack,
  entries: pack.entries.map((e, j) => (j === i ? { ...e, item: { ...e.item, ...patch } } : e)),
});

describe("sealing", () => {
  it("seal: rejects non-operator", () => {
    const { sim, params } = newSim();
    const { pack: stranger } = buildPack(bytes("not-the-operator"), demoCards());
    sim.setPrivateState({ pack: stranger });
    expect(params.size).toBe(12n);
    expect(() => sim.sealSlot()).toThrow(/caller is not the operator/);
    expect(sim.getLedger().sealedCount).toBe(0n);
  });

  it("seal: hidden tally accepts the exact lineup", () => {
    const { sim } = newSim();
    const seen = new Set<string>([Buffer.from(sim.getLedger().tallyCommit).toString("hex")]);
    for (let i = 0; i < 12; i++) {
      sim.sealSlot();
      seen.add(Buffer.from(sim.getLedger().tallyCommit).toString("hex"));
    }
    // Every seal publishes a fresh commitment.
    expect(seen.size).toBe(13);
    sim.finalizeSeal();
    expect(sim.getLedger().phase).toBe(1);
    expect(sim.getLedger().remaining).toBe(12n);
  });

  it("seal: rejects sealing more cards than the pack holds", () => {
    const { sim } = newSim();
    sealAll(sim, 12);
    expect(() => sim.sealSlot()).toThrow(/pack is full/);
  });

  it("finalize: rejects before every slot is sealed", () => {
    const { sim } = newSim();
    sealAll(sim, 11);
    expect(() => sim.finalizeSeal()).toThrow(/not every slot is sealed/);
  });

  it("finalize: rejects a missing advertised hit", () => {
    const { sim, pack } = newSim();
    // Entry 0 was advertised. The operator seals an unremarkable card of the same tier instead.
    sim.setPrivateState({ pack: tampered(pack, 0, { id: bytes("impostor"), adv: 0n }) });
    sealAll(sim, 12);
    expect(() => sim.finalizeSeal()).toThrow(/advertised hit missing or unexpected/);
    expect(sim.getLedger().phase).toBe(0);
  });

  it("seal: rejects a duplicate hit flag", () => {
    const { sim, pack } = newSim();
    // Entry 1 claims to be advertised hit #1 (the same flag as entry 0).
    sim.setPrivateState({ pack: tampered(pack, 1, { id: pack.entries[0].item.id, tier: pack.entries[0].item.tier, adv: 1n }) });
    sim.sealSlot();
    expect(() => sim.sealSlot()).toThrow(/hit already counted inside/);
  });

  it("seal: rejects a card that claims to be a hit it is not", () => {
    const { sim, pack } = newSim();
    sim.setPrivateState({ pack: tampered(pack, 5, { adv: 2n }) });
    sealAll(sim, 5);
    expect(() => sim.sealSlot()).toThrow(/item is not the advertised hit it claims to be/);
  });

  it("finalize: rejects wrong tier counts", () => {
    const { sim, pack } = newSim();
    // The lineup promises 6 C cards; the operator seals one B card in place of a C.
    sim.setPrivateState({ pack: tampered(pack, 11, { tier: 2n }) });
    sealAll(sim, 12);
    expect(() => sim.finalizeSeal()).toThrow(/sealed tier counts differ from the advertised lineup/);
  });

  it("seal: public diff is {slots, sealedCount, tallyCommit} only (privacy regression)", () => {
    const { sim } = newSim();
    // Entry 0 is a hit, entry 2 is not. Both must look the same on the ledger.
    for (const _ of [0, 1, 2]) {
      const before = publicSnapshot(sim.getLedger());
      sim.sealSlot();
      const after = publicSnapshot(sim.getLedger());
      expect(changedFields(before, after)).toEqual(["sealedCount", "slots", "tallyCommit"]);
      expect((after.slots as unknown[]).length - (before.slots as unknown[]).length).toBe(1);
    }
  });

  it("planted control: the diff check fails when a tier field leaks", () => {
    const { sim } = newSim();
    const before = publicSnapshot(sim.getLedger());
    sim.sealSlot();
    const leaking = { ...publicSnapshot(sim.getLedger()), tierTargets: [9n, 9n, 9n, 9n] };
    expect(() => expect(changedFields(before, leaking)).toEqual(["sealedCount", "slots", "tallyCommit"])).toThrow();
  });
});
