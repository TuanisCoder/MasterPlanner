# MasterPlanner — Working Protocol & Context

> Read this file first in any new session (Claude Code, Cline, or chat) before
> doing anything else in this repo. It's the continuity mechanism across tools
> and across time — nothing here is assumed to be remembered elsewhere.
>
> Also see `ENVIRONMENT.md` for durable setup facts (ports, model IDs,
> versions, config values) — look things up there instead of rediscovering
> them each session.

## 1. What this is

A standalone master planning / bond sizing engine for CCRC (life plan
community) development scenarios, built for Blue Ocean Advisors. See
`README.md` for the technical summary. This file is about *how we work*,
not *what the code does*.

Eventually a React client interface will sit on top of this engine, and the
engine itself may be licensed to or wrapped by SEER as a separate dependent
package — never merged directly into SEER's repo. See `/areas/blue-market.md`
and `/areas/seer.md` style framing if more business context is needed.

## 2. Storage policy — everything lives in the repo

**All documentation, specs, architectural decisions, and artifacts
produced while working on this project are written into this repo.**
Not into the claude.ai Project's own document store, not left as
chat-only output, not generated as standalone files handed back for
separate upload. If it's worth keeping, it gets written here, directly,
as part of doing the work — following Mario's "touch files once"
principle (see `docs/ARCHITECT_NOTES.md`).

This repo — not any chat history, not any other persistence mechanism —
is the single source of truth. A new session (any tool, any surface)
should be able to reconstruct full context from what's committed here.

## 3. Origin

This repo (`MasterPlanner`) started as a clean break from an earlier,
general-purpose sandbox repo (`planning-engine-lab`) — structured
deliberately from day one as a standalone product rather than an
experiment. On 2026-10-03, after a closer review, real material *was*
found worth carrying over from `planning-engine-lab` and was migrated in:
see the 2026-10-03 session log entry below for specifics. The "clean
start" was about structure and intent, not a refusal to reuse anything
genuinely useful.

## 4. Tooling split (as of initial setup)

- **Claude Code** — authenticated against the Pro subscription (not API
  billing). Used for structurally tricky work: the sizing math, the circular
  dependency in Class 1 sizing, anything where correctness really matters.
- **Cline (VS Code)** — switchable between a local model (Ollama/LM Studio)
  for routine/mechanical implementation, and Claude via API key for
  Claude-quality work without leaving the editor.
- **Local LLM** — Qwen3-Coder family, run via Ollama or LM Studio, on the
  Mac Studio M5 Max (128GB). Used for boilerplate and mechanical edits once
  an approach is already settled — not trusted unsupervised on the sizing
  logic itself.

Routing between these is manual — there's no harness deciding automatically.
The working split: Claude (Code or Cline) for anything with non-obvious
logic or financial correctness at stake; local model for everything else.

## 5. Repo structure — intentionally adaptable

The `master_planning/ bond_sizing/ ratio_analytics/ shared/` split reflects
the three-lens architecture (see README). This is expected to evolve as the
actual sizing logic gets built — restructure freely as better shapes become
obvious; this isn't meant to be locked in prematurely.

Two additional folders, added 2026-10-03:
- `docs/specs/` — build-ready specs (e.g. `BOND_SIZING_SPEC.md`) and firm
  architectural decisions (e.g. `MASTER_PLANNING_DESIGN_PRINCIPLES.md`,
  `RATIO_ANALYTICS_ARCHITECTURE.md`). A spec here is ready to build from.
- `docs/ideas-inbox.md` — smaller ideas not yet build-ready. Promote an
  entry to its own file under `docs/specs/` once it's firm enough; this is
  the lighter-weight tier below a full spec.
- `reference/` — external reference material that informs design but isn't
  part of this product's own code (e.g. `kijabe-ui-precedent/`, a prior
  React prototype being adapted from, not depended on).

## 6. Naming conventions

- **Python code/packages:** `snake_case` (`master_planning`, `bond_sizing`)
  — not a style choice, Python doesn't allow dashes in import names.
- **Load-bearing docs** (standing reference/protocol, meant to be read as
  authoritative): `SCREAMING_SNAKE_CASE.md` — e.g. `PROJECT_CONTEXT.md`,
  `ENVIRONMENT.md`, `BOND_SIZING_SPEC.md`, `ARCHITECT_NOTES.md`. The
  all-caps is a visual signal that this file is load-bearing, not a
  passing note.
- **Everything lighter-weight or chronological:** `kebab-case` — e.g.
  `docs/ideas-inbox.md`, `reference/kijabe-ui-precedent/`,
  `recaps/YYYY-MM-DD-short-topic.md`.

## 7. Recap protocol

At the end of each working session, write a recap file to `recaps/` capturing:

1. **Decisions made & open questions**
2. **Data model / schema changes** (shape of inputs/outputs, module boundaries)
3. **UI/UX decisions** (once the React client work starts)
4. **Action items / next steps**

Naming: `recaps/YYYY-MM-DD-short-topic.md`

## 8. Session log

_(Newest first.)_

- **2026-10-03** — Reviewed `planning-engine-lab` more carefully and
  migrated real material over (contradicts the 2026-09-30 "nothing of
  value" assessment below — there was substantially more than first
  thought). Moved in: `BOND_SIZING_SPEC.md` (full implementation-ready
  spec, → `docs/specs/`), `financial_metrics.py` (working NPV/IRR/MIRR/
  payback/operating-margin implementation, → `shared/`), the ratio-analytics
  three-lens architecture + CARF-vs-generic DSCR distinction (→
  `docs/specs/RATIO_ANALYTICS_ARCHITECTURE.md`), smaller captured ideas
  (→ `docs/ideas-inbox.md`), and domain glossary (→ section 7 below).
  Also brought in `reference/kijabe-ui-precedent/` — a React planning-UI
  prototype Mario built pro bono for AIC Kijabe Hospital (Kenya); fully
  his own work, no IP/confidentiality issue, kept in `reference/` (not
  `master_planning/`) since it's a different domain's code being used as a
  UI pattern precedent, not a dependency. In the course of reviewing it,
  articulated a core design principle — **scarce-information-first**:
  every input category needs a fast simple-mode path (single $ total, %
  of revenue, hardcoded placeholder) alongside the full detailed buildup,
  with the detailed structure existing in the data model from day one even
  when simple mode is what's actually being used. Captured in
  `docs/specs/MASTER_PLANNING_DESIGN_PRINCIPLES.md`, with Kijabe's existing
  "Use Expense Override" checkbox as a working precedent for the pattern.

- **2026-09-30** — Repo created (`MasterPlanner`, private, under TuanisCoder).
  Clean start — no carryover from `planning-engine-lab`. Package skeleton
  (`master_planning/`, `bond_sizing/`, `ratio_analytics/`, `shared/`)
  scaffolded with `pyproject.toml`, `.gitignore`, `README.md`, this file.
  Tooling decided: Claude Code on Pro subscription, Cline switchable between
  local model and Claude API, local models via Ollama/LM Studio on new Mac
  Studio M5 Max 128GB. Next: decide whether `planning-engine-lab` stays as a
  general multi-project sandbox (email pipeline, PKM/Obsidian work, etc.) —
  leaning yes, kept separate from this repo either way.

## 9. Glossary / shorthand

- **CCRC / Life Plan Community** — Continuing Care Retirement Community
- **IL / AL / MC / SNF** — Independent Living / Assisted Living / Memory
  Care / Skilled Nursing Facility
- **Entrance Fee (EF)** — Upfront payment by resident; Type A/B/C refund
  structures
- **ITB** — Intermediate Term Bond; secured by entrance fee receipts
  during fill-up
- **CAPI** — Capitalized Interest; bond interest funded from proceeds
  during construction
- **DSRF** — Debt Service Reserve Fund; IRS 3-part test sizing
- **MTI** — Master Trust Indenture; governs all obligations including
  bank tranches
- **MADS** — Maximum Annual Debt Service
- **DSCR** — Debt Service Coverage Ratio
- **CARF** — Commission on Accreditation of Rehabilitation Facilities;
  sets Life Plan Community financial ratio benchmarks (see
  `docs/specs/RATIO_ANALYTICS_ARCHITECTURE.md` for the CARF-vs-generic
  DSCR distinction — it's material, not cosmetic)
- **Class 1 Sizing** — New money project financing
- **Class 2 Sizing** — Wraparound / refunding against existing debt
- **Philanthropy** — Real and variable (faith-based orgs: $0–$10M+);
  reduces par amount
