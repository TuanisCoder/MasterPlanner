# Recap — 2026-10-03 — Material migrated from planning-engine-lab

## Decisions made
- Reviewed `planning-engine-lab`'s `explorations/`, `docs/specs/`, `shared/`,
  and `ideas/` folders in full — found substantially more value than the
  earlier "nothing worth carrying over" assessment from repo setup.
- Migrated in:
  - `docs/specs/BOND_SIZING_SPEC.md` — full implementation-ready spec for
    the bond sizing engine (Class 1 + Class 2), module-by-module function
    signatures, the algebraic par-solve formula, Claude-consultation flags
  - `shared/financial_metrics.py` — working, documented implementation of
    NPV/IRR/MIRR/payback/operating margin + PV helpers
  - `docs/specs/RATIO_ANALYTICS_ARCHITECTURE.md` — three-lens architecture
    (economic / standalone coverage / combined-covenant) and the concrete
    CARF-vs-generic DSCR example (0.4x vs 2.8x on identical financials)
  - `docs/ideas-inbox.md` — smaller captured ideas (entrance fee actuarial
    engine, philanthropy as explicit input)
  - Domain glossary — merged into `PROJECT_CONTEXT.md` section 7
- Brought in `reference/kijabe-ui-precedent/` — a React planning-UI
  prototype built pro bono for AIC Kijabe Hospital (Kenya). Confirmed fully
  owned by Mario, no confidentiality concern. Kept in `reference/`, not
  `master_planning/`, since it's a different domain's working code being
  used as a UI pattern precedent rather than a dependency.
- Articulated and documented a core design principle in the course of
  this review: **scarce-information-first**. Every `master_planning` input
  category needs a fast simple-mode path (single $ total, % of revenue,
  hardcoded placeholder) that coexists with — not replaces — a fuller
  detailed buildup. The detailed data-model structure exists from day one;
  what's deferred is data entry, not architecture. Kijabe's existing
  "Use Expense Override" checkbox is a working precedent for the pattern.
  Full writeup: `docs/specs/MASTER_PLANNING_DESIGN_PRINCIPLES.md`.

## Open questions
- Exact shape of the `mode: simple|detailed` override pattern — per-category
  toggle vs. global, and what UI signal distinguishes "placeholder value"
  from "empty required field." Noted as open in the design principles doc.
- `ratio_analytics` is still ideation-phase — needs another session with
  Jake before `RATIO_ANALYTICS_ARCHITECTURE.md` can become a build-ready
  spec the way `BOND_SIZING_SPEC.md` already is.

## Data model / schema changes
- None to actual running code yet — `financial_metrics.py` is copied in
  but not yet wired into any module; still pre-implementation.

## Action items / next steps
- Begin Class 1 sizing implementation per `BOND_SIZING_SPEC.md`'s suggested
  build order (date_utils → project_fund → dsrf approximation → par_solve →
  capi → itb → bank_tranche → debt_service → dsrf full test → excel_export
  → main.py → wrap.py last).
- When master_planning's input schema gets designed, apply the
  simple/detailed override pattern from day one rather than retrofitting
  it later.
