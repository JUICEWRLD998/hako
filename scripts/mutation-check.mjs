#!/usr/bin/env node
// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
//
// Breaks the contract on purpose, one rule at a time, and checks that the
// test suite notices. A mutant that survives means a test is not testing what
// its name says. The original contract is always restored.
//
//   node scripts/mutation-check.mjs

import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "contract/src/hako.compact");
const managed = join(root, "contract/src/managed/hako");
const backup = join(root, ".toolchain/managed-backup");
const compactc = join(root, "scripts/compactc.sh");

const MUTANTS = [
  { name: "S1 remainder check removed", find: 'assert(word == q * remaining + r, "index is not word mod remaining");', replace: "", tests: ["s1.test.ts"] },
  { name: "S1 range check removed", find: 'assert(r < remaining, "remainder out of range");', replace: "", tests: ["s1.test.ts"] },
  { name: "seed chain check removed", find: 'assert(seedLinkHash(link) == seedTip, "seed link does not extend the chain");', replace: "", tests: ["draw.test.ts"] },
  { name: "finalize flag check removed", find: 'assert(t.inside[i] == (i < advertisedCount), "advertised hit missing or unexpected");', replace: "", tests: ["seal.test.ts"] },
  { name: "finalize tier check removed", find: 'assert(t.tiers == tierTargets, "sealed tier counts differ from the advertised lineup");', replace: "", tests: ["seal.test.ts"] },
  { name: "future-round check removed", find: 'assert(blockTimeLt((at - requestLead) as Uint<64>), "drand round is no longer in the future");', replace: "", tests: ["draw.test.ts"] },
  { name: "refund deadline check removed", find: 'assert(blockTimeGte(req.deadline), "deadline has not passed");', replace: "", tests: ["claims.test.ts"] },
  { name: "claim nullifier check removed", find: 'assert(!claimed.member(disclose(n)), "already claimed");', replace: "", tests: ["claims.test.ts"] },
  { name: "hit identity check removed", find: 'assert(it.adv == 0 || path.leaf == hitLeaf(it.id, it.tier), "item is not the advertised hit it claims to be");', replace: "", tests: ["seal.test.ts"] },
  { name: "sealSlot leaks by touching a public field", find: "  sealedCount.increment(1);\n  tallyCommit", replace: "  sealedCount.increment(1);\n  remaining = (remaining + 1) as Uint<16>;\n  tallyCommit", tests: ["seal.test.ts"] },
  { name: "operator check removed from requestDraw", find: "export circuit requestDraw(tag: Bytes<32>, buyerSeed: Bytes<32>, roundIn: Uint<64>): [] {\n  const round = disclose(roundIn);\n  assertOperator();", replace: "export circuit requestDraw(tag: Bytes<32>, buyerSeed: Bytes<32>, roundIn: Uint<64>): [] {\n  const round = disclose(roundIn);", tests: ["draw.test.ts"] },
];

const original = readFileSync(src, "utf8");
cpSync(managed, backup, { recursive: true });
const results = [];
try {
  for (const m of MUTANTS) {
    if (original.split(m.find).length !== 2) {
      results.push({ ...m, status: "BAD-MUTANT (pattern not found exactly once)" });
      continue;
    }
    writeFileSync(src, original.replace(m.find, m.replace));
    const c = spawnSync("bash", [compactc, "--skip-zk", "contract/src/hako.compact", "contract/src/managed/hako"], { cwd: root, encoding: "utf8" });
    if (c.status !== 0) {
      results.push({ ...m, status: `DOES-NOT-COMPILE\n${c.stderr || c.stdout}` });
      continue;
    }
    const t = spawnSync("npx", ["vitest", "run", ...m.tests.map((x) => `src/test/${x}`)], { cwd: join(root, "contract"), encoding: "utf8" });
    results.push({ ...m, status: t.status === 0 ? "SURVIVED" : "killed" });
    console.log(`${t.status === 0 ? "SURVIVED" : "killed  "}  ${m.name}`);
  }
} finally {
  writeFileSync(src, original);
  rmSync(managed, { recursive: true, force: true });
  cpSync(backup, managed, { recursive: true });
  rmSync(backup, { recursive: true, force: true });
}
const bad = results.filter((r) => r.status !== "killed");
console.log(`\n${results.length - bad.length}/${results.length} mutants killed`);
for (const b of bad) console.error(`  ${b.name}: ${b.status}`);
process.exit(bad.length ? 1 : 0);
