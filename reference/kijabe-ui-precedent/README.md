# Kijabe UI Precedent — Reference Material, Not Product Code

## What this is
A React planning-interface prototype originally built as pro bono work for
AIC Kijabe Hospital (Kenya) — a capital project planning tool to replace an
Excel model. It never got fully deployed for Kijabe, but it's the working
starting point `master_planning`'s UI is being adapted from.

**Ownership:** Pro bono work, fully owned by Mario McKenzie — no client
confidentiality or licensing concern. Kept in a clearly separate `reference/`
folder (not inside `master_planning/`) so it's obviously distinct from this
product's own code, not because of any IP restriction.

## Why it's here
This prototype already solved several UI problems `master_planning` will
need solved again, differently tailored:
- A 44-field input form with progress tracking and required-field validation
- Collapsible sections matching a source spreadsheet's groupings
- Global vs. per-project assumption separation
- **A conditional override pattern** — see `project1-complete.jsx`'s
  "Use Expense Override" checkbox: checked → single dollar override is the
  only required field; unchecked → the full Labor/Supplies/Admin buildup
  becomes required. This is a direct, working precedent for the
  scarce-information-first design principle — see
  `../../docs/specs/MASTER_PLANNING_DESIGN_PRINCIPLES.md`.
- Dual export (JSON + CSV/Excel)
- Financial metric cards (NPV/IRR/MIRR/Payback/Operating Margin) — now
  properly ported to Python in `shared/financial_metrics.py`

## What it is NOT
- Not CCRC/senior-living domain logic — Kijabe is a hospital capital
  planning tool, different project types, different fields entirely
- Not meant to be adapted verbatim — master_planning needs its own field
  set, its own phase structure (capital/revenue/expenses/funding), and its
  own simple-mode/detailed-mode design per the principles doc
- Not a dependency of any code in this repo — purely a reference a human
  (or an agent) consults while designing the real master_planning UI

## Files
- `project1-complete.jsx` — the working prototype, single-file React component
- `PROJECT_RECAP.md` — full project history and architecture decisions
- `BATTLE_TEST_GUIDE.md` — testing checklist pattern (worth reusing the
  *pattern* of — a structured checklist before calling an input form done)
- `DASHBOARD_ANALYSIS.md` — chart/dashboard design analysis, proposes 7
  candidate dashboard types; relevant when master_planning gets to its own
  dashboard phase
