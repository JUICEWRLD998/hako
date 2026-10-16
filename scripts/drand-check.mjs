#!/usr/bin/env node
// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
//
// Phase 0, step 6: confirm the drand quicknet parameters the contract assumes
// (genesis time, period) and save one real round. Run it on a machine that can
// reach api.drand.sh.
//
//   node scripts/drand-check.mjs [outfile]

import { writeFileSync } from "node:fs";

const CHAIN = "52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971";
const BASE = process.env.DRAND_URL ?? "https://api.drand.sh";
const EXPECTED = { genesis_time: 1692803367, period: 3 }; // QUICKNET in contract/src/pack.ts

const get = async (path) => {
  const r = await fetch(`${BASE}/${CHAIN}/${path}`);
  if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
  return r.json();
};

const info = await get("info");
console.log("info:", JSON.stringify(info));
let ok = true;
for (const [k, v] of Object.entries(EXPECTED)) {
  const same = info[k] === v;
  ok &&= same;
  console.log(`${same ? "ok      " : "MISMATCH"} ${k}: chain says ${info[k]}, contract assumes ${v}`);
}
const latest = await get("public/latest");
const expectedRound = Math.floor((Date.now() / 1000 - info.genesis_time) / info.period) + 1;
console.log(`latest round ${latest.round} (clock-implied ${expectedRound})`);
const out = process.argv[2] ?? "docs/drand-quicknet-sample.json";
writeFileSync(out, JSON.stringify({ fetchedAt: new Date().toISOString(), info, latest }, null, 2) + "\n");
console.log(`saved ${out}`);
if (!ok) {
  console.error("\nThe chain parameters differ from what pack.ts assumes. Update QUICKNET before deploying.");
  process.exit(1);
}
