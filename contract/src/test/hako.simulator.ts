// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
//
// Drives the compiled contract through the Compact runtime, the same way the
// bboard example does. Every test asserts ledger state read back from here.

import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  createConstructorContext,
  CostModel,
} from "@midnight-ntwrk/compact-runtime";
import { Contract, ledger, type Ledger, type Params } from "../managed/hako/contract/index.js";
import { witnesses, type HakoPrivateState } from "../witnesses.js";
import { type Pack } from "../pack.js";

export class HakoSimulator {
  readonly contract: Contract<HakoPrivateState>;
  circuitContext: CircuitContext<HakoPrivateState>;
  time = 0n;

  /** `overrides` replaces individual witnesses so tests can feed tampered data to real circuits. */
  constructor(
    pack: Pack,
    params: Params,
    startTime = 1_700_000_000n,
    overrides: Partial<typeof witnesses> = {},
  ) {
    this.contract = new Contract<HakoPrivateState>({ ...witnesses, ...overrides });
    const { currentPrivateState, currentContractState, currentZswapLocalState } =
      this.contract.initialState(createConstructorContext({ pack }, "0".repeat(64)), params);
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      costModel: CostModel.initialCostModel(),
      currentQueryContext: new QueryContext(currentContractState.data, sampleContractAddress()),
    };
    this.setTime(startTime);
  }

  /** Moves the block clock; blockTimeLt / blockTimeGte read it. */
  setTime(seconds: bigint): void {
    this.time = seconds;
    this.circuitContext.currentQueryContext.block = {
      ...this.circuitContext.currentQueryContext.block,
      secondsSinceEpoch: seconds,
    };
  }

  getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  /** Swap who is calling: operator pack, buyer receipt, or neither. */
  setPrivateState(ps: HakoPrivateState): void {
    this.circuitContext.currentPrivateState = ps;
  }

  getPrivateState(): HakoPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  private run<T>(r: { context: CircuitContext<HakoPrivateState>; result: T }): Ledger {
    this.circuitContext = r.context;
    return this.getLedger();
  }

  sealSlot = () => this.run(this.contract.impureCircuits.sealSlot(this.circuitContext));
  finalizeSeal = () => this.run(this.contract.impureCircuits.finalizeSeal(this.circuitContext));
  requestDraw = (tag: Uint8Array, seed: Uint8Array, round: bigint) =>
    this.run(this.contract.impureCircuits.requestDraw(this.circuitContext, tag, seed, round));
  fulfillDraw = (drand: Uint8Array) =>
    this.run(this.contract.impureCircuits.fulfillDraw(this.circuitContext, drand));
  proveStillInside = (k: bigint) =>
    this.run(this.contract.impureCircuits.proveStillInside(this.circuitContext, k));
  proveAtLeast = (tier: bigint, n: bigint) =>
    this.run(this.contract.impureCircuits.proveAtLeast(this.circuitContext, tier, n));
  claimItem = (id: bigint) => this.run(this.contract.impureCircuits.claimItem(this.circuitContext, id));
  refundStalled = (id: bigint) =>
    this.run(this.contract.impureCircuits.refundStalled(this.circuitContext, id));
  unsealOne = () => this.run(this.contract.impureCircuits.unsealOne(this.circuitContext));
}
