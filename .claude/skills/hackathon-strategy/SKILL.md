---
name: hackathon-strategy
description: The hackathon engine. Use when he pastes a hackathon, asks for a winning idea, a first-place plan, a pitch, or a build-and-ship pass for an event. Runs DECIDE (gate, intake with the WANT MAP, field research, forge rounds with a judge-panel tournament, the best two deepened as real startups, pick), stops for his GO, then BUILD & SHIP. Names the exact skill or tool to use at each step.
---

# Hackathon engine

One number is optimised: **P(1st place)** at this event. First place means beating the best entry in the
field, not the average one. The kickoff prompt is `references/starter-prompt.md`; paste it with the raw event
material to start a campaign. This file is the order of work and the toolkit. Evidence and old lessons are in
`references/doctrine-archive.md`.

## Standing rules (all from him, none negotiable)

1. **No subagents unless he says so in this session** (2026-10-01). Do every step inline. Where the engine
   used to fan out (cold samples, blind attack, parallel build), the inline substitute is written into the step.
   If he says "fan out" or names an agent, then and only then spawn, one agent per disjoint job, and say what each does.
2. **Days left is never a gate, budget or scope limit.** Record the deadline as a dated fact. Never shrink the idea for it.
3. **Idea firewall.** The idea comes from the event (its judges, sponsor, users and pain), never from his
   security-researcher profile. Security, audit, DeFi-risk and "prove it breaks" ideas get no head start. More
   than 2 of 5 finalists in that family is a bias alarm: regenerate from other empty cells.
4. **Hard STOP between decide and build.** Nothing is built, posted, emailed or submitted without "GO <name>".
5. **Honest odds.** Tag every claim VERIFIED (URL, file:line, live response) or UNVERIFIED (plus the 2-minute
   check). Never invent an endpoint, SDK method, judge, prize or past winner. "4/10" is a useful answer.
6. Strategy files live outside the public repo: `<workdir>/<event-slug>/strategy/`.

## The thesis

Every team has a capable model and the same event page, so the modal idea is free and worthless. An idea is
differentiated only by inputs the other teams did not feed their model: **I1** field telemetry (what exists now,
grouped by approach), **I2** platform truth (the sponsor's repo, `--help`, schemas, changelog), **I3** the
panel's own work, **I4** our unfair advantage (event-derived, never his profession), **I5** a measured negation
(a number that falsifies something the field believes). A candidate that uses none of the five is modal. Kill it.

Rivals are not naive: they ask their model for "ideas nobody else will build", paste the sponsor docs, and
build with the same agents and anti-slop UI skills. A clean build and a clever-sounding idea are commodities.
So every finalist holds at least **two of six moats** a rival model cannot produce (M1 real person, M2 real data
finding, M3 fresh primitive, M4 live proof, M5 distribution, M6 taste), passes the **convergence probe**, and
scores 7/10 on the **strength test**. All three are in `references/rival-simulation.md`. There is no house
genre: the product shape comes from the event's users, never from the shape of past builds.

Ideas are made in **the forge** (`references/idea-forge.md`), not in one pass: rounds of cards from changing
cues, a judge-panel tournament with an investor seat, and the best two deepened, startup version first. Every
idea must clear three bars: **not regular** (it clears the cliché layers L0-L3), **wanted** (it serves a WANT from
the event's WANT MAP, quoted: G0), and **a real product that could be a startup, never a demo** (G14, at every
event, his instruction 2026-10-15). He reranks the blind cards when the final is split. Two research results
shape it: about 5% of 4,000 model-generated ideas were distinct and LLM self-ranking barely beat chance (Si et al.
2024), and ordinary-person cues beat genius personas for diversity (Deng et al. 2026).

## The pipeline and the toolkit

STAGE A decides. STAGE B builds. Each row names what to run. Skills are invoked with the Skill tool; `ecc:` ones
come from the ECC plugin; MCP names are as connected (firecrawl, playwright, context7, serena).

### STAGE A: DECIDE

Step numbers match `references/starter-prompt.md` (fixed 2026-10-15; this table used to run one step behind it).

| Step | Job | Run this |
|---|---|---|
| A0 Gate | Who pays runtime, credentials valid (one live call each), platform ceilings from the platform's own source, free-tier limits, eligibility and obligations **per prize**, qualifying rules. NO-GO output is under 15 lines. | `references/lane-gate-and-judge-conversion.md`; `blocked-page-recovery` when a page is walled; firecrawl `firecrawl_scrape` for rules pages; `references/event-platform-extraction.md` and `dorahacks-scraping.md` for DoraHacks, Superteam Earn, Colosseum |
| A1 No budget | Selection takes as long as first place takes. Optional: `node scripts/rival-run.mjs --selftest` says whether an outside model can add cold samples and judge votes; NOT READY is fine | `scripts/rival-run.mjs` |
| A2 Intake | Dated `INTAKE.md`: scoring function and weights, prize map, track pick, prize-stack matrix, panel type, judge table, the primitive being judged, **the WANT MAP** (WANT-1..5: what the event and sponsor are paying to see, each quoted with its source), sponsor surface plus overlap audit, one real access spike per load-bearing API, open questions | `references/intake-dossier-and-overlap-audit.md`; `ecc:documentation-lookup` or context7 for sponsor SDK docs; `ecc:search-first` to find what the sponsor already ships |
| A3 Winner DNA | What the last 2-3 editions' winners actually were. Revealed preference beats the stated rubric. Plus judge memory on the event's obvious keywords | firecrawl `firecrawl_search` (use `categories: ["developer"]` for repos), `ecc:deep-research`, `ecc:exa-search`; `scripts/judge-memory.mjs`; if nothing is findable, say so |
| A4 Convergence map | THE CLICHE LIST, measured, in four layers: L0 judge memory, L1 naive, L2 "unique", L3 docs-informed (`references/rival-simulation.md`). Cold samples, a recorded field sweep with a planted control per zero and a warrant per empty cell, lane colour per cell | `fexx-idea-engine/references/field-saturation-and-bet-shaping.md`; `ecc:market-research`; `ecc:competitive-platform-analysis`; `scripts/judge-memory.mjs`; inline samples are SEMI-COLD; his pasted ChatGPT samples count double; optional `scripts/rival-run.mjs` when an outside CLI is READY. Subagent samplers only if he says fan out |
| A5 The forge | Rounds of 12+ cards from 6+ generators cued by ordinary people, payers and the WANTs (never genius personas), dedupe by mechanism with a logged yield, cheap kill on HARD gates only (G0 wanted, G14a someone pays, L0 not seen), a judge-panel tournament with an investor seat (pairwise, both orders), top 4 carried with crossovers and mutants. Min 3 rounds; stop when the champion holds 2 rounds and the yield drops under 40% | `references/idea-forge.md`; `generate-creative-ideas` (Combinatorial Engine, Future-Back) for G-COLLIDE and G-FUTURE; `ecc:market-research` for G-CUSTOMER; `fexx-idea-engine` for each card's negation and proof A |
| A6 Deepen | The final two (different mechanisms), through the same eight steps: the startup version, the real product (nothing mocked in the core, day-31 use), magic moment, evidence started, pre-mortem, kill shots and re-probe, FINALIST gates incl. G14 full, strength test and spike | `ecc:product-lens`; `product-hardening` (demo-seam audit) for D2; `product-brainstorming` (Provoke, Assumption Testing); `attacker` inline for D5-D6; `ecc:deep-research` for D4 |
| A7 The final | The finalists as blind cards: panel pairwise both orders, deliberation-room vote. A clear winner is the pick; a split goes to his blind rerank | `references/idea-forge.md` A7; `ecc:council` when two finalists are near-equal |
| A8 Score | Rubric-weighted with arithmetic, ranked twice when weights are assumed, plus P(1st) decomposed into five factors. Name the weakest. | `ecc:product-lens` for the why-build check and the panel-type lens |
| A9 Blind attack | The three finalists attacked as a judge would, with only the one-liner, the demo script, the README top third and the rubric | `attacker` skill inline, in a clean section that excludes our reasoning, labelled SEMI-BLIND; a READY outside CLI is fully blind. A subagent only if he says so |
| A10 The pick | `CATALOGUE.md`, `FORGE.md`, and `RANKED_REPORT.md` (section 0 = the blind cards first, then the 11 sections; section 9 is the company, always). Chat reply at most 15 lines | `ecc:competitive-report-structure` for the rival section; `ecc:investor-materials` when the panel is a VC or accelerator and the GTM answer is scored; `humanizer` on the prose |

Then **STOP and wait for "GO <name>"**.

### STAGE B: BUILD & SHIP (only after GO)

| Step | Job | Run this |
|---|---|---|
| B1 Proof first | Build outward from the proof artifact: deterministic adjudicator, proof A, thin end-to-end path, the model, the UI, breadth. Day-one `README.md`, `CLAIMS.md`, `DECISIONS.md`. | `plan` for the written plan; `ecc:blueprint` or `ecc:prp-plan` for a long multi-step build; `test-driven-development` for the adjudicator and fixtures; `references/live-platform-integration.md`; `references/repo-anatomy-and-idea-engine.md` for the README skeleton |
| B2 Milestones | Thin path, feature-complete, demo freeze, packaging. No calendar. Add a TRACTION track for VC or accelerator panels. | Packaging is its own milestone and is never borrowed from |
| B3 Two judged paths | Scripted path (video) deterministic; unscripted path (the judge's own input) hardened first; failure beats replayed on cue; rehearse free, pay once | `product-hardening` for demo-seam audit; `systematic-debugging` when something misbehaves; `ecc:security-review` before any key or wallet code ships |
| B4 UI | Design the wow screen first | **`ui-studio`** (it routes frontend-design, hallmark, motion, polish; see its `references/toolbox.md`). Verify in a real browser with `ecc:browser-qa` or Playwright MCP. |
| B5 Judge funnel | Gallery card, video's first 20 seconds, README top third, live URL, judge's own input | `demo-video` makes the whole video from the deployed link (script, female voice-over, recording, edit, verify); `ecc:frontend-slides` for a pitch deck when one is required |
| B6 Submission hardening | README scoring map, one status vocabulary (LIVE / NEXT / NOT LIVE), pre-submit grep `mock\|fake\|dummy\|lorem\|0x0000\|picsum\|randomuser\|example.com`, run the judge's path yourself on the deployed URL from a clean browser | `ecc:verification-loop`; `ecc:e2e-testing`; `humanizer` on all submission copy; side-track checklists. **Prepared is not submitted: he presses submit.** |
| B7 After | If the build must survive the event | `product-hardening` |

Optional and only when he asks for the content: `ecc:content-engine` and `ecc:article-writing` for the launch
thread or write-up (draft only, he posts). `ecc:social-publisher` and `ecc:crosspost` publish, so never run them
without his go.

## What to keep in mind

- **A sweep is evidence only when recorded**: literal query, date, platform, blind spot, a positive control
  beside every zero, and a warrant for every empty cell. Sweep the mechanism in its implementation words as well
  as the pain's words.
- **An empty org search cannot see private repos** (2026-10-10, Mergetober). "No OpenAI Agents issue, PR or code in
  any topoteretes repo" was true, and the integration still existed, in a private repo listed in the monorepo's
  `inventory.yml`. Before calling a cell empty, read the sponsor's own registry (inventory, integrations page,
  docs sidebar, marketplace listing). A search only covers public repos.
- **"Unrecoverable" is a claim about your toolkit.** Enumerate installed tools before calling a source unreadable.
- **The README is a sales document first and an AI-judge artifact second.** Every claim is backed by `CLAIMS.md`.
- **No mocked core integration, no hardcoded value posing as dynamic, no single-engine build behind a
  multi-backend README.** Declare shortcuts instead of implying none.
- **Ship a live URL even when the product is thin.** One URL plus one explorer-linked transaction beats a
  complete local demo.
- **The name must not explain the product.** Short and ownable, best taken from the users' own world (Derica: the
  market's tomato-tin measure). The tagline carries the meaning. No enforcement suffix by default.
- **The locale reflex and the local empty cell** (2026-10-15). After the firewall removed his profession, his
  location became the default: 5 of 9 picks were Nigerian or diaspora money, and Upkeep and Alert were both
  remittance. Each looked like an empty cell because the sweep only saw that event. Run L0 judge memory
  (`scripts/judge-memory.mjs`) before trusting any empty cell, and apply the locale alarm in the kickoff.
- **The idea is not the only gap** (2026-10-15). Of those 9 picks, memory records only Cue as built; the other 8
  were last recorded at "waiting for GO" (memory can be stale). An entry that is never built and submitted has
  P(1st) = 0 whatever its idea scored. When he asks why he has not won, say this alongside any idea critique.
- **The verifier reflex** (2026-10-04). The fexx corpus is ten verification tools, so its method kept bending ideas
  into "an engine that checks X". That is a genre, not a law. Spread shapes in A4; a checker must win on the
  event's users, not on habit.
- **M3 alone is a trap.** A fresh primitive feels novel to us, but every strong rival read the same changelog.
  Tab (Arc, 2026-10-01) held only M3 and M4, and its own report said a rival could copy it in a weekend.
- **"Provably fair" needs verifiability, not privacy** (2026-10-15, Midnight). Before claiming ZK is load-bearing for a
  fairness idea, ask whether public commit-reveal already solves it. Korea gacha was killed by this check (G2): item
  odds are public by law, so a published table plus commit-reveal suffices. The idea survived only where the thing
  to hide (the sealed pool's contents) is genuinely secret and must still be proven.
- **Complexity is not innovation.** Fewer moving parts, sharper insight. Correct a wrong claim in place, mark it.
- **A cohort M2 finding needs a within-subject test before it becomes the hook** (2026-10-04, Bitget S2). Pooled
  over 30 real traders, weekend entries won 10 points less and revenge entries 12 less; shuffling the label
  *inside each trader* gave p = 0.69 and 0.29. The pooled gap measured who trades that way, not what the habit
  does. Permute within subject (trader, wallet, user); when the gap vanishes, the vanishing can be the
  negation (it became Blotter's thesis: habits are personal, so rules must be proven per trader).
- **Read the win-cap before planning a prize stack** (2026-10-03, DEV HF26). Some platforms cap wins per entry or per person. DEV challenges allow one Entry per participant, judge only the first one, and let each person win once per challenge. On those platforms, extra categories are extra *chances* to win, not extra *wins*, and a test post carrying the tag becomes your Entry. For DEV, the field is fully measurable: `dev.to/api/articles/latest?tag=<tag>` plus `/api/articles/{id}` gives every rival's "Prize Categories" section. Count real claims, and drop "not entering X" false positives by hand.

## Files

- `references/starter-prompt.md` — the paste-in kickoff. Two stages, the gate list, the deliverables, and a table of the failure each block prevents.
- `references/idea-forge.md` — A5-A7: the WANT MAP, generators, card format (WANT and CUSTOMER lines), dedupe yield, hard-gate kill, the judge-panel tournament with an investor seat, deepen (startup version first), the final, the optional JUDGE brief, and the research behind each rule.
- `references/rival-simulation.md` — four-layer convergence (L0 judge memory, L1-L3), paste-ready rival prompts, the convergence probe, six moats, strength test and spike, ambition floor.
- `scripts/rival-run.mjs` — optional: runs one brief through any working outside CLI (Gemini with a free Google login; Codex), read-only in an empty directory; `--selftest` is the positive control. Failed or empty runs are NOT RUN, never samples.
- `scripts/judge-memory.mjs` — L0: Devpost archive count, winner share and the 30-project sample for a 1-2 word domain, with a positive and a null control that must pass. The kill is 3+ same-mechanism projects in the sample, never the total.
- `references/forge-attack-2026-10-15.md` — the attacker ledger on the forge (17 findings, smoke-only, author self-attack). The next attack must be different-vendor, on the fixed version.
- `references/lane-gate-and-judge-conversion.md` — event-selection filter, lane gate (green/yellow/red), pre-commit outcomes, judge psychology, README honesty gates.
- `references/intake-dossier-and-overlap-audit.md` — `INTAKE.md` pattern and the sponsor-overlap audit.
- `references/event-platform-extraction.md`, `dorahacks-scraping.md` — pulling full event data from JS-rendered platforms.
- `references/repo-anatomy-and-idea-engine.md` — README skeleton, naming procedure, demo and submission-day checklists.
- `references/live-platform-integration.md` — a worked example of platform claims failing verification.
- `references/somnia-event-contracts-stack.md` — Somnia / DreamDEX stack facts (only for Somnia events).
- `references/stellar-stack-facts.md` — Stellar facts measured 2026-10-06: live anchor census, thin EM corridors, claimable-balance atomic-claim spike, same-ledger merge trap, São Paulo winner DNA (only for Stellar events).
- `references/tempo-stack-facts.md` — Tempo facts measured 2026-10-10: access keys (caps, periods, payee scopes, refusal codes, the fee-eats-the-cap trap, spend-event layout), virtual-address salt mining can return undefined (only for Tempo events).
- `references/doctrine-archive.md` — the full v1 skill: pitfalls with dates and evidence, integration lessons, build conventions.
- Companion skills: `fexx-idea-engine` (each card's negation and proof), `generate-creative-ideas` and
  `product-brainstorming` (installed 2026-10-15; forge generators and A6 provocation), `ui-studio`, `attacker`,
  `product-hardening`, `humanizer`.
