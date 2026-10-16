#!/usr/bin/env node
// Copyright 2026 Mustapha Fadhlullah
// SPDX-License-Identifier: Apache-2.0
//
// Fails if a `witness` declared in a .compact file has no implementation in
// witnesses.ts (or implements one the contract never declares).
//
//   node scripts/check-witnesses.mjs                  check contract/src
//   node scripts/check-witnesses.mjs --self-test      prove the check can fail

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

export const declaredWitnesses = (compact) =>
  [...strip(compact).matchAll(/\bwitness\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)].map((m) => m[1]);

export const implementedWitnesses = (ts) => {
  const body = strip(ts);
  const start = body.search(/export\s+const\s+witnesses\b[^=]*=\s*\{/);
  if (start < 0) return [];
  let depth = 0;
  let i = body.indexOf("{", start);
  const open = i;
  for (; i < body.length; i++) {
    if (body[i] === "{") depth++;
    else if (body[i] === "}" && --depth === 0) break;
  }
  const inner = body.slice(open + 1, i);
  // Top-level keys only: track nesting while scanning for `name:` or `name(`.
  const names = [];
  let d = 0;
  let token = "";
  for (let j = 0; j < inner.length; j++) {
    const ch = inner[j];
    if ("{([".includes(ch)) d++;
    else if ("})]".includes(ch)) d--;
    if (d === 0 && /[A-Za-z0-9_]/.test(ch)) token += ch;
    else {
      if (d === 0 && token && /^[A-Za-z_]/.test(token) && /^\s*[:(]/.test(inner.slice(j))) names.push(token);
      token = "";
    }
  }
  return [...new Set(names)];
};

export const compare = (compact, ts) => {
  const declared = declaredWitnesses(compact);
  const implemented = implementedWitnesses(ts);
  return {
    declared,
    missing: declared.filter((w) => !implemented.includes(w)),
    extra: implemented.filter((w) => !declared.includes(w)),
  };
};

const here = dirname(fileURLToPath(import.meta.url));

if (process.argv.includes("--self-test")) {
  const compact = "witness a(): Bytes<32>;\nwitness b(x: Uint<8>): Uint<8>;\n// witness commented(): []\n";
  const good = "export const witnesses = { a: (c) => [c, 1], b: (c, x) => [c, x] };";
  const bad = "export const witnesses = { a: (c) => [c, 1] };";
  const ok = compare(compact, good);
  const ko = compare(compact, bad);
  if (ok.missing.length !== 0 || ok.declared.length !== 2) throw new Error("self-test: good fixture rejected");
  if (ko.missing.join() !== "b") throw new Error("self-test: planted missing witness not detected");
  console.log("check-witnesses self-test: ok (planted missing witness `b` detected)");
  process.exit(0);
}

const compactFile = join(here, "../contract/src/hako.compact");
const tsFile = join(here, "../contract/src/witnesses.ts");
const { declared, missing, extra } = compare(readFileSync(compactFile, "utf8"), readFileSync(tsFile, "utf8"));
console.log(`declared witnesses (${declared.length}): ${declared.join(", ")}`);
if (missing.length || extra.length) {
  if (missing.length) console.error(`MISSING in witnesses.ts: ${missing.join(", ")}`);
  if (extra.length) console.error(`NOT declared in hako.compact: ${extra.join(", ")}`);
  process.exit(1);
}
console.log("every declared witness is implemented");
