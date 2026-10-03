# UI Design Principles — Behavioral Design for Output Presentation

> Status: adopted framing, not yet implemented. This is a lens for *how
> results get shown to the user*, layered on top of whatever the
> master-planning/bond-sizing/ratio-analytics engines compute. It doesn't
> change any calculation.

## 1. Source

This is extracted from `SEER_Design_Science_v1.docx` ("Design Science:
Behavioral Nudges for Financial Wellness"), found in the `seer-fpa-context`
repo under `archive/mario-intake-2026-09-07/source-documents/`. That
document is SEER's own design doctrine, co-authored by Mario and Jake —
not written for MasterPlanner. This file pulls out the pieces that are
genuinely useful for MasterPlanner's own output UI and leaves the rest
(multi-user governance workflows, gamification, board-journey tracking)
where it belongs, in SEER.

The source document's working term is **"tile,"** not "card" — a
contextual, moment-of-truth feedback element. Functionally this is the
"Oura-like card that pops out to provide context" Mario referenced: a
small unit that doesn't just display a number, it tells you what the
number means and what to do about it.

## 2. The core idea

Dashboards fail not from lack of data but from presenting data in a form
that doesn't compel action. The fix: every output element should answer
*"what should I do right now, and what happens if I don't?"* — not just
*"here is a number."*

## 3. Tile anatomy (the reusable structural pattern)

Every result tile — a DSCR reading, a capital-capacity score, a
sensitivity output — should carry up to four parts:

1. **Signal** — one present-tense, specific sentence. What's happening
   right now. ("At current assumptions, DSCR breaches 1.20x covenant in
   Year 7.")
2. **Anchor** — a peer, historical, or threshold comparison. Why this
   number matters. ("CARF median for comparable Life Plan Communities is
   1.45x.")
3. **Implication** — the loss-framed cost of inaction, with a time
   horizon. ("Waiting a year to address this adds an estimated $X to the
   required capital cushion.")
4. **CTA** — one click, one specific verb. ("Model the downside case.")

Not every tile needs all four — a lot of MasterPlanner's output is for
Mario himself mid-analysis, not a board member being nudged into action.
Signal + Anchor is often enough; Implication + CTA earn their place on
outputs that are actually going in front of a client or lender.

## 4. Tile classification (urgency coloring)

The source doc's red/amber/blue/green scheme maps cleanly onto thresholds
MasterPlanner already has reason to track:

| Color | Meaning | MasterPlanner mapping |
|---|---|---|
| 🔴 Red | Active breach / imminent risk | Covenant/MTI threshold already breached under current assumptions |
| 🟡 Amber | Trending toward a threshold | Projected to breach within the model horizon, not yet |
| 🔵 Blue | Strategic opportunity / worth a look | E.g. philanthropy assumption far below peer norms, no stress scenario modeled yet |
| 🟢 Green | Healthy margin / positive trend | Comfortably inside covenant, improving trajectory |

This gives `ratio_analytics/` a natural second output alongside the raw
ratio: a classification, not just a number.

## 5. Which of the source doc's ten behavioral principles apply here

The source catalogs ten principles (temporal discounting, loss framing,
identity motivation, progress visibility, friction reduction, peer
anchoring, scenario simulation, timely intervention, gamification,
narrative coherence). Not all of them fit a tool that's mostly
single-operator today. Triaged:

**Directly applicable now:**

- **Temporal discounting correction** — compress the 15-year projection
  into a present-tense statement, not just a chart to interpret. "Breaches
  covenant in Year 7" lands harder than a line crossing a threshold on a
  graph.
- **Loss framing** — pair "the project nets $X NPV" with "waiting a year
  costs approximately $Y." Fits naturally with the Economic lens.
- **Peer anchoring** — this is already architecturally planned (CARF
  benchmarks in `ratio_analytics/`). The design implication: always show
  the peer number *next to* the computed number, not in a separate report.
- **Scenario simulation** — base case vs. stress case (occupancy shock,
  rate shock) shown side by side, one click away from the base analysis —
  not a separate modeling exercise. Reinforces the existing
  scarce-information-first principle: a stress toggle should be cheap to
  produce even when the detailed buildup isn't there yet.
- **Narrative coherence** — a one-paragraph auto-generated plain-language
  summary of what a scenario's output means, sitting above the numbers.
  High-value for a "high-end client interface" — this is often the
  difference between a tool and a deliverable.
- **Progress visibility** — when Mario is iterating a scenario, show the
  trajectory across iterations (this version vs. the last one), not just
  the current snapshot. Useful mid-analysis, not just for a client.

**Deferred to SEER (not MasterPlanner's job):**

- **Identity-based motivation**, **gamification / mastery architecture** —
  these are multi-user, board/governance engagement mechanics. Don't
  belong in a standalone advisory tool used by one person.
- **Timely intervention at data entry** ("this assumption is 22% above
  your 3-year average") — genuinely useful, but it's a feature of the
  *input* experience (the React client, not yet built) rather than the
  calculation engines. Worth carrying forward when that work starts, not
  now.
- **Friction reduction via defaults** — already captured, independently,
  as the scarce-information-first principle in
  `MASTER_PLANNING_DESIGN_PRINCIPLES.md`. Same instinct, already handled.

## 6. Open questions

- Does tile classification (§4) become a formal field in `sizing_result` /
  ratio-analytics output, or purely a presentation-layer decision made
  later by the React client? Leaning toward: the engine should emit enough
  (the raw ratio + the relevant threshold + the peer benchmark) that the
  classification can be computed by *either* layer — don't bake the color
  into the calculation code itself.
- Narrative generation (§5) — hand-written templates per scenario type, or
  LLM-generated from structured output? Revisit once there's enough real
  output to template against.
