# The idea forge: rounds, a judge-panel tournament, the final two

Written 2026-10-15 at his request: "a loop that generates sets of ideas, then the best 2 ideas it still thinks
hard about … ensure they are solid enough and have the potential to beat the ideas of others." This file is steps
A5-A7 of `starter-prompt.md`.

**Revised the same day, at his request:** "remove using astra for ideas … ensure that the ideas you create are not
regular ideas, they are ideas that are solving the problems the hackathon really wants … real products capable of
being a startup and not a demo product." The Astra ceiling rival is gone (he has no OpenAI key, and its value
depended on an outside model). Two things replaced it as the bar every idea must clear: the **WANT MAP** (what
this event is actually paying to see) and the **STARTUP gate** (G14: a real product a stranger would pay for and
still use a month later).

## Why the old A5-A7 produced competent, not winning, ideas

Measured on the last nine picks (memory files, 2026-09-30 to 2026-10-10: Tabgate, Derica, Cue, Passbook, Òjò,
Alert, Stub, Recess, Upkeep). The original campaign folders are no longer on the Desktop, so this rests on the
memory summaries, not the full catalogues:

1. **One pass, one worksheet.** A5 filled a P x D (primitive x domain) worksheet once. "Sponsor primitive applied
   to a pain domain" is itself the template every strong rival uses, so the worksheet sampled the rival region.
2. **Gates only subtract.** Seventeen binary gates remove risk and add no upside. The survivor is the most
   defensible idea, usually small: a splitter (Tab), a tracker, a repricer.
3. **Self-judging.** The same context generated, gated, scored and attacked. Our favourite always scored well.
4. **Depth came last and was defensive.** A7 hardened survivors against attack. Nothing made the best idea bigger.
5. **A location reflex replaced the security reflex.** 5 of 9 picks were Nigerian or diaspora money, and two of
   those were remittance. Each looked like an empty cell only because the sweep saw that one event.
6. **"What the sponsor wants" was one intake line, and the startup case applied to VC panels only.** So ideas
   could be clever without being what the event was paying for, and demo-grade without being a product.

## What the research says (and how each point is used below)

| Finding | Source | Used as |
|---|---|---|
| Of 4,000 LLM seed ideas, about 200 (5%) were non-duplicates; each new batch adds fewer, and the total plateaus | Si, Yang, Hashimoto 2024, arXiv 2409.04109, §3.2 and §7.1 (read 2026-10-15) | Never "generate 20 more" from the same cue. Change the sampling cue every round; log the dedupe yield; stop when it collapses |
| Best LLM pairwise idea ranker: 53.3% agreement with experts, against 56.1% expert-expert; direct LLM scores poorly calibrated. Novelty: human ideas 4.86, AI ideas 5.62, AI ideas reranked by a human 5.78 (small margin over AI alone) | same paper, §7.2 Table 11 and §5 | Pairwise judging in both orders, ties when the order flips; HIS blind rerank of the finalists is the last step |
| LLMs fixate on early outputs. Ordinary personas beat "creative entrepreneur" personas (Steve Jobs) as diversity cues; chain-of-thought plus ordinary personas gave the most diverse ideas | Deng, Brucks, Toubia 2026, arXiv 2602.20408 (abstract, read 2026-10-15) | Generators are cued by ordinary people from the event's world, never by genius personas |
| Pairwise order swaps fix position bias, but pairwise judges are more swayed by distractor features (35% flips vs 9% for absolute scores) | arXiv 2504.14716 via search summary, 2026-10-15, UNVERIFIED against the paper | Judge CARDS in one fixed format, same length, no adjectives, so style cannot win the pair |

## The loop

```
A2   WANT MAP                           what this event is paying to see, quoted (WANT-1 .. WANT-5)
A5   ROUND r = 1..5
       R1 generate   >= 12 cards from >= 6 generators, new person cues every round; every card names its WANT
       R2 dedupe     by mechanism, against L0-L3 and all earlier cards; log every merge and the yield
       R3 cheap kill hard gates only (facts): G0 WANT-FIT, G14a who pays, L0 SEEN-MECHANISM, ...
       R4 tournament judge panel with an investor seat, pairwise, both orders
       R5 carry      top 4 seed the next round (crossovers + mutants + fresh cards)
     STOP when the same champion wins 2 rounds running AND the yield of the last round < 40%; min 3, max 5 rounds
A6   DEEPEN the final two (different mechanisms): the startup version first, then the demo moment
A7   THE FINAL  blind cards; a clear winner is picked, a split goes to his rerank
```

Write every round to `strategy/FORGE.md`. `CATALOGUE.md` stays the index of every card and its fate.

## The WANT MAP (built in A2, used by every round)

An idea wins when it is what the organisers and sponsor are paying to see, done better than they imagined. Before
any card is written, decode that, with a source for every line:

1. **Stated wants.** Track descriptions, problem statements, "ideas we'd love to see" lists, RFPs, bounty texts,
   the sponsor's grant program. Quote them.
2. **Why the sponsor pays.** The business outcome the prize buys: developers adopting a named primitive, real users
   or transactions on mainnet, a showcase app for their marketing, a vertical they are entering, a gap in their
   ecosystem page. Evidence from their blog, roadmap, changelog, ecosystem directory, devrel posts.
3. **What the judges reward.** Winner DNA (A3), each judge's own products and investments, the heaviest criterion.
4. **The gap between 1 and 2.** What they need but did not write down. This is usually where first place is.

Output `WANT-1 .. WANT-5` in `INTAKE.md`, each one line plus its source. A card that serves none of them dies in R3
(G0). The top WANT is the one the heaviest criterion and the sponsor's business case both point at.

### R1 Generate: the generators

Each generator is a different sampling cue. A round uses at least six; no generator supplies more than three
cards; at least two generators per round were not used in the round before. Every PERSON cue is new each round.

| # | Generator | The cue | Skill or tool |
|---|---|---|---|
| G-PERSON | An ordinary person from the event's user world, named, with an age, a place, a job and their worst recurring moment ("Kemi, 41, night-shift ward nurse, 3 a.m. handover"). Never a founder, genius or celebrity | Deng et al. ordinary personas | inline |
| G-WANT | Start from one WANT and its quote: the product the sponsor would put on their homepage if it existed | the WANT MAP | inline |
| G-CUSTOMER | Start from someone who would PAY: a business or person with budget and a costly, recurring problem the sponsor's stack can remove. Name what they pay for today | startup test | `ecc:market-research` |
| G-DEMO | Start from the 20-second moment that would make a judge stop scoring and say "do that again". Work backwards to the product | judge memory | inline |
| G-WISH | What the sponsor wants to exist and nobody built: open "help wanted" items, grant RFPs, docs pages that say "coming soon", sample apps that stop halfway | I2 platform truth | firecrawl, `ecc:search-first`, context7 |
| G-DATA | A public dataset or live source nobody in the field used. The number it produces is the hook (I5, M2) | I5 | firecrawl, `ecc:deep-research` |
| G-COLLIDE | Transplant a working business or mechanism from an unrelated field (auctions, insurance, ward rounds, logistics) | Combinatorial Engine | `generate-creative-ideas` (references/techniques.md) |
| G-INVERT | The three most frequent L2/L3 mechanisms: invert each one's core assumption | the convergence map | inline |
| G-FUTURE | "It is 2028 and this primitive is everywhere. What company is obvious then that nobody started in 2026?" | Future-Back | `generate-creative-ideas` (prompt-templates.md) |
| G-HUMAN | His own raw hunches, if he pasted any. Human-first ideas widen the pool (Si et al.) | him | never required; never asked for twice |

Every candidate is one CARD, in this fixed format so a judge compares ideas and not prose:

```
#<round>.<n>  generator: G-xxx   cue: <person / customer / WANT / dataset / mechanism>
WANT       which WANT-n it serves, and the quote
USER       one named person and their situation
MOMENT     the recurring moment of pain, in their words
MECHANISM  one noun phrase            NOT: what it is not
CUSTOMER   who pays, roughly how much, and what they pay for today instead
WOW (20s)  what the judge SEES happen, with no narration
PROOF      one command or one click a judge can run
INPUTS     I1-I5 used          MOATS  M1-M6 claimed (evidence is due at A6 D3, not now)
REACTION   SURPRISE / DESIRE / AWE ("how did they build that")
```

### R2 Dedupe by mechanism

Compare each card's MECHANISM, not its wording, against the cliché list (L0 judge memory, L1-L3 samples) and every
card from earlier rounds. **Same mechanism** means the same 20-second demo would prove both cards, with only the
user or the noun swapped. A duplicate is merged into the earlier card, keeping the stronger detail, and every merge
is logged as `#3.5 -> #1.2 (same demo, nurse instead of teacher)`. The stop rule counts only logged merges. Log
`generated / unique / yield %` for the round. A yield under 30% means the cues are exhausted: switch generator
families before the next round.

Lineage exemption: R5's mutants and crossovers are deduped only against cards outside their own lineage. A
mutant that beats its parent in R4 replaces it; one that loses is dropped.

### R3 Cheap kill (facts, not taste)

Kill only on gates that are facts, one line per kill naming the gate:
- **G0 WANT-FIT**: the card serves a WANT, with its quote. No WANT, no card.
- **G14a WHO PAYS**: the CUSTOMER line names a payer and a reason that is true today. "Users", "the community" and
  "monetise later" are not payers. (A free public good is legal only when a WANT asks for one; then name who funds it.)
- G2 (works only on this stack), G3 (no overlap with what the sponsor ships), G4 (lane not RED), G9 (buildable by
  us), G12 (nothing load-bearing on unverified behaviour).
- **L0 SEEN-MECHANISM**, with one fixed protocol, because both looser versions failed the 2026-10-15 backtest
  (`forge-attack-2026-10-15.md` R3). Domain totals are gradientless: every past pick's one-word domain came back
  WORN or FATIGUED (allowance 601, nft game 1,632, accessibility 33,779). Long phrases make anything RARE
  ("spending limit allowance family" = 5). So: query the card's DOMAIN in one or two words with `--pages 5`, read
  the 30 sampled names and taglines the script lists, and count projects with the SAME MECHANISM (definition in
  R2). Three or more is SEEN-MECHANISM: kill. The total and its band are written beside it as context only.

Taste gates (G5-G8, G11, G16, G17) do not kill here; the tournament decides taste, and A6 fixes what the finalists
lack.

### R4 Tournament: the judge panel

Build the panel once, at the start of A5, from the real judge table (A2, I3). One persona per named judge (what
they built, wrote, funded and rewarded before; what their heaviest criterion is), plus three fixed seats:
- **the sponsor's devrel**: "does this deliver one of our WANTs, and would I put it in our showcase?"
- **the investor or first customer**: "would I pay for this, or fund it, and use it next month?"
- **the tired generalist at demo 47**: "will I remember it tonight?"
When no judges are named, use the panel type's three most likely profiles and label them ASSUMED.

1. Triage every surviving card once against the published rubric, 1-5 per criterion, weights shown. Keep the top 6.
2. LOCALE ALARM (one definition, used here and at A6). At most 1 of the top 6, and at most 1 of the final two, may
   be set in his country or its diaspora, unless the event's judges, sponsor or users point there. Extra ones are
   swapped for the next card in triage.
3. Round-robin the top 6 (15 pairs). Every persona picks the card it would rank higher on the rubric; then the
   pair is asked again in reversed order. One line per pair carries every vote:
   `#2.4 v #2.7 | J1 A J2 B dev A inv A gen A | rev: J1 A J2 A dev A inv B gen A | #2.4 4-1 (inv flipped: tie) | pays: clinics already spend on this`.
   A persona whose pick flips scores that pair as a tie.
4. Score = pairwise wins (ties count half). The champion is the most wins; ties broken by the heaviest criterion.
5. Optional: when an outside CLI is READY (`node scripts/rival-run.mjs --selftest`; Gemini needs only a free Google
   login, no OpenAI key), run the top 6 through the JUDGE brief below, both orders. An outside vote counts double.
   When its FIRST differs from the panel's champion, mark the champion CONTESTED in FORGE.md.

### R5 Carry, and the next round

The top 4 seed the next round, and must win their place again. The next round adds: two CROSSOVERS (the strongest
element of one survivor fused with another's), two MUTANTS of the champion (swap the user, swap the paying
customer, change what M outputs, swap the proof, invert one assumption), and fresh cards from generators not used
last round.

**Stop rule.** At least 3 rounds. Stop when the same champion (or a mutant that replaced it) has won two rounds
running and the last round's yield, counted from the merge log, is under 40%, or after round 5. Time is never a
stop condition (standing rule 2).

**Noise guard.** If round 5 ends with no champion that held two rounds, the selector is noisy (an LLM pairwise
ranker agreed with experts 53.3% of the time, Si et al.). Take the top 3 by cumulative wins across all rounds into
A6 instead of the top 2, and A7 goes straight to his rerank.

## A6 Deepen: the final two

The final two are the top two of the last tournament **with different mechanisms** (when #2 is a variant of #1,
take #3). Run each step for both before moving to the next, so neither gets more attention than the other.

| Step | What | Skill |
|---|---|---|
| D1 The startup version | The company this becomes: the paying customer and the price, why now, the wedge, the first 10 real users and the channel he actually has, a named competitor and why we win, the next 12 months in three lines. Then the ONE lever that makes it 10x more valuable. If it would not matter outside the event, it fails the ambition floor | `ecc:product-lens`; `product-brainstorming` (Provoke: "the version 10x more ambitious") |
| D2 The real product | What must be real for this to be a product and not a demo: real data, real money or real users in the core path; deployed live; what a user does on day 31 without us. List every part that would be mocked, and replace or cut it | `product-hardening` (read its demo-seam audit) |
| D3 Magic moment | The 20-second wow, beat by beat: screen before, the one action, screen after. The judge's own input must reach it (G11). If the wow needs narration, it is not the wow yet | inline |
| D4 Evidence, started | Begin M1 and M2 for real: who the first user is and the message he would send them; the data number computed once with its query and date. A finalist with a started moat beats a cleverer one without | firecrawl, `ecc:deep-research` |
| D5 Pre-mortem | "Awards night. We placed fourth. Who won, and why?" Name the three likeliest winners (field sweep, L3 samples) and the one thing each did better. Fix it, or write why we accept it | `attacker` inline |
| D6 Kill shots and re-probe | The three Q&A questions that would sink it (business model and real competitors always among them), answered or OPEN. Then the convergence probe (15 prompts, L1-L3) and `judge-memory.mjs` on its domain | `product-brainstorming` (Assumption Testing); `rival-simulation.md` |
| D7 Finalist gates | G1, G5, G6, G7, G8, G10, G11, G13, **G14 full**, G16, G17. A failure is fixed here; an unfixable one drops the idea | starter-prompt gate list |
| D8 Strength and spike | The strength test (0-2 on five lines, 7/10 floor), then the SPIKE: name the one dimension where it is 10/10. An idea at 7 everywhere and 10 nowhere loses to a spiky one | `rival-simulation.md` |

## A7 The final

The final two (three when the noise guard fired), deepened, as CARDS in the same format with the generator line
removed, labelled X, Y (, Z).

1. Full pairwise by the panel, both orders, ties on flips; outside JUDGE votes when READY.
2. The deliberation room: each persona argues for its first choice in two sentences, then votes. Count first
   places. Disagreement between the pairwise winner and the vote winner is reported, never averaged away.
3. The verdict:
   - **Clear winner** (wins the pairwise AND the vote, and is not CONTESTED): pick it. Report the margin and which
     personas preferred the other, and why.
   - **Anything else** (split, flipping, CONTESTED, noisy): he reranks the blind cards. In Si et al., AI ideas
     reranked by a human scored highest on novelty (5.78, against 5.62 for AI alone). The margin is small, so his
     rerank is one more strong signal, not an oracle.
4. In every case the report shows the blind cards BEFORE our ranking, so he can rank them cold first.

## The JUDGE brief (optional outside votes in R4 and A7)

Run it through `scripts/rival-run.mjs` when a CLI is READY, twice, the second time with the cards reversed.

```
You are judging a hackathon. Here is the rubric with weights:
<RUBRIC>
What the organisers and sponsor say they want to see:
<WANT MAP, quotes only>
The judges on this panel, and what each cares about:
<JUDGES>
Below are <K> entries, described in the same format. You have not seen any of them before.
<CARDS, labelled A, B, C ... in this run's order>

For each pair, say which one the panel would rank higher and give one reason tied to the rubric or the wants.
Then say which entries could become a real company and which are only demos, in one line each.
Give the final order, and name the entry you would bet wins first place, with the single reason.
Answer as: PAIRS: A>B (reason) ... | COMPANY: ... | ORDER: ... | FIRST: <label> (reason)
```

## Honesty about this loop

- Personas inside one context are not independent judges. They reduce one bias (a single point of view), not the
  big one (everything here was written by the same model). Label inline panels SEMI-BLIND; his blind rerank and
  any READY outside vote are the independent signals.
- A tournament ranks the ideas we generated. It cannot find an idea nobody generated. The WANT MAP, the generators
  and the field data do that; the tournament only stops us from picking the weaker of two.

## Anti-patterns

- Re-asking the same generator for more ideas. The yield collapses (5% unique in Si et al.).
- A card with no WANT, or a WANT with no quote. Clever and unasked-for loses to what the sponsor came to see.
- A CUSTOMER line that names users but no payer, or a payer who does not pay for this problem today.
- A finalist whose core path is mocked. That is a demo, and he asked for products.
- Scoring cards with adjectives in them. Style wins pairs; keep every card in the fixed format.
- Deepening only our favourite. The final two get the same steps, in parallel, in the same order.
- Treating "no judge has seen it" (L0 RARE) as "judges will love it". RARE can mean nobody wants it; the WANT MAP
  and the panel decide that, not the count.
