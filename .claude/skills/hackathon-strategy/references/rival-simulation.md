# Rival simulation: beating teams that also use AI

Written 2026-10-04; L0 added 2026-10-15. Read this at A4 (convergence map), A5 (the forge), A6 D6 and
D8 (re-probe, strength test) and A9 (blind attack). The rounds themselves are in `idea-forge.md`.

## The problem this file solves

Every rival team has a frontier model. Most of them are not naive. The common rival workflow in 2026 is:
paste the event page, ask for "unique ideas judges will love", paste the sponsor docs, ask again, then let
an agent build it with an anti-slop UI skill. So the cliche list is not one layer deep. It has three layers,
and an idea that only escapes layer 1 still collides with every competent team.

Two things are now commodities and cannot win on their own:
- **A clean build.** Claude Code, Cursor and v0 give every team a working app and a passable UI.
- **A clever-sounding idea.** Models produce "non-obvious" ideas from the same distribution every time.

So the engine competes on the things a model cannot produce from the event page. See "The six moats" below.

## Four layers of convergence (A4a, A4d)

Run every layer. Merge the outputs by MECHANISM (not wording) into one frequency table. That table is
the cliche list. Anything within one mechanism of an L2 or L3 entry is converged, even if it looked
original to us. At L0, an idea is converged when the 30-project Devpost sample for its one- or two-word domain
holds 3 or more projects with the same mechanism (SEEN-MECHANISM). The total count is context, not the test.

| Layer | Who it simulates | Input given | Prompt shape |
|---|---|---|---|
| L0 judge memory | What the judges have already seen at every other event | Devpost archive, measured | `node scripts/judge-memory.mjs "<domain, 1-2 words>" --pages 5`, then count same-mechanism projects in the 30 listed |
| L1 naive | The median team | Event page only | "What should we build to win this?" / "Give me 10 winning ideas" |
| L2 contrarian | The team that knows L1 is crowded | Event page only | "Give me ideas nobody else will build. Avoid the obvious ones." |
| L3 informed | The strong team | Event page, rubric, sponsor docs, judge list | "You are a past winner. Using these docs and judges, give the idea most likely to take 1st." |
L0 exists because the field sweep is local. Upkeep and Alert (2026-10-06 and 10-10) each sat in an empty cell of
their event and were both remittance, which every crypto judge has seen for years. Measured 2026-10-15 on Devpost
alone: remittance 208 projects (WORN), carbon credits 557 and mental-health chatbot 2,110 (FATIGUED).

L2 matters most. Models asked for "unique" ideas converge on a second, smaller cluster (agent-for-X,
reputation layer, gamified X, on-chain proof of X, AI copilot for niche-profession X). That cluster is
where the smart teams land. It is crowded by smart teams, which is worse than being crowded by average ones.

### Running it without subagents

1. Run `node scripts/rival-run.mjs --selftest`. Write each block below, filled, to `strategy/briefs/L1.md`,
   `L2.md`, `L3.md`, and run `node scripts/rival-run.mjs strategy/briefs/L1.md strategy/samples/` (and L2, L3) on
   every READY outside CLI. These are COLD samples from a different model, and they count double.
2. Run L1, L2 and L3 inline as well, each in a clean section that quotes only the allowed input. Label them
   SEMI-COLD (this session has seen our notes and his profile).
3. Give him the paste-ready blocks for ChatGPT. His pasted output also counts double. Ask once; continue on
   assumptions if he does not reply.
4. If he says "fan out", run each layer as a separate cold subagent on a different model.

### Paste-ready blocks for other assistants

Replace `<EVENT>` with the event page text, `<RUBRIC>` with the judging criteria, `<DOCS>` with the
sponsor's main doc page or README.

```
L1  Here is a hackathon: <EVENT>
    What should my team build to win first place? Give 10 ideas, one line each.

L2  Here is a hackathon: <EVENT>
    Most teams will build the obvious ideas. Give me 10 ideas nobody else will think of,
    that judges would still love. One line each.

L3  You have won several hackathons. Here is the event: <EVENT>
    The rubric: <RUBRIC>
    The sponsor's docs: <DOCS>
    Give me the 5 ideas most likely to win first place, and say why each beats the field.
```

## The convergence probe (A6 D6, A9)

For every finalist, run this test. It is the direct measure of "would a rival's AI give them our idea?"

1. Write the finalist's DOMAIN in one plain phrase (for example "Nigerian market traders and inflation").
2. Prompt (inline, clean section): "Here is <EVENT>. Give me 5 ideas for <DOMAIN>." Run L2 and L3 shapes too.
3. If our MECHANISM appears in any of the 15 answers, the finalist has CONVERGED. Differentiate it
   (change the mechanism, the proof, or the user) or drop it.
4. Record the 15 answers in FIELD.md. A finalist that passes is tagged `probe: clean (n=15)`.

A pass here does not prove novelty. It proves a rival who aims a model at our domain does not land on us
by default. Combine it with the field sweep (A4b), which catches teams that already built it.

## The six moats (what a rival's model cannot produce)

Every finalist must hold at least TWO. Tag each with M1-M6 in the worksheet. One moat is a weekend copy.

| Moat | What it is | Example |
|---|---|---|
| M1 Real person | A named, reachable user whose real inputs drive the demo, with consent | Derica: her messages, her calibration, her reaction on video |
| M2 Real data finding | A number computed from real data this week that the field has not seen | Derica: WFP markups 9.1% to 4.6%; Sliver: Goldfinch loss modes |
| M3 Fresh primitive | A sponsor capability shipped after model training data, found in the changelog or repo | Arc Memo plus Multicall3From, weeks old |
| M4 Live proof | Something a judge can check in one click that cannot be faked: mainnet tx, live endpoint, eval table on held-out real data | Explorer link; `results/eval.json` |
| M5 Distribution | A channel to real users inside the window that the team actually owns | A market group chat, a community he runs |
| M6 Taste | A specific, subject-grounded identity: name, vocabulary, signature moment, from the users' own world | "derica", the tomato-tin measure |

Ideas that hold only M3 are the most dangerous: they feel novel to us because the primitive is new, and
every L3 rival read the same changelog. Tab (Arc, 2026-10-01) held M3 and M4 only, and its own report said
"a rival can copy the idea in a weekend". Derica held M1, M2, M4 and M6. That is the bar.

## The strength test (A6 D8)

Score each finalist 0-2 on each line. Below 7 of 10: fix it in A6 or drop it.

1. **Inevitable once seen.** A judge says "obviously" after the demo, though nobody built it before.
2. **Surprise, desire or awe.** The judge learns something is possible, wants to use it today, or asks "how did
   they build that". None of the three means the idea is competent, not winning.
3. **One person, one moment.** A judge can retell it in the deliberation room in one sentence: "the
   one where <person> <did thing> and <result>". If the retelling needs the product's category, it fails.
4. **Hard to copy this weekend.** At least two moats (M1-M6).
5. **Sponsor-native.** The sponsor's devrel would put it in their own showcase.

Then the **spike**: name the one dimension where the finalist is 10/10. Judges remember peaks. An idea that
scores 7 on everything and 10 on nothing loses to one with a single unforgettable dimension.

## Ambition floor

Gates subtract. A pass that only subtracts ends on the safest idea, which is usually small (a splitter, a
tracker, a dashboard). In A6 D1, check each finalist: "if this worked perfectly, would it matter outside the
hackathon?" If every finalist answers "not much", run another forge round whose cards all start from the
largest pain in the event's domain. Never accept small because it is safe.

## Anti-patterns

- **Treating our first original-feeling idea as original.** It feels new because we did not see the rivals'
  outputs. Run the probe.
- **Escaping L1 and stopping.** The L2 cluster is where competent teams go.
- **A new primitive as the whole differentiation.** Every L3 team reads the changelog.
- **The verifier reflex.** Wrapping any domain in "an engine that checks/proves/refuses X" is a house habit
  inherited from the fexx corpus, not a judge preference. It is legal only when the event's users need
  verification more than anything else.
- **The locale reflex** (2026-10-15). Reaching for his own city or its diaspora because M1 and M5 are easy
  there. 5 of 9 picks did. Legal only when the event points there, and then it still has to pass L0.
- **An empty cell measured only locally.** Run L0 before trusting it.
