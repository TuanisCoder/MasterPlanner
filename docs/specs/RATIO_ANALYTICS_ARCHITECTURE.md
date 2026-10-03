# Ratio Analytics — Three-Lens Architecture

**Status:** Core design thinking, carried over from planning-engine-lab
(2026-09-01 session). Not yet a formal build-ready spec like
BOND_SIZING_SPEC.md — `ratio_analytics` itself is still in ideation phase
and needs another pass with Jake before module boundaries are firm.

**Why this matters:** this is the clearest articulation of what makes
`ratio_analytics` — and by extension SEER's monitoring angle — genuinely
differentiated rather than commodity FPA software.

---

## Three distinct analytical lenses on the same underlying data

**Lens 1 — Economic** ("Is this a good investment?")
- Metrics: NPV, IRR, MIRR, Payback, Operating Margin
- Level: Project / component level
- Primary home: `master_planning` / SEER
- Always relevant, regardless of debt structure
- Implemented in `shared/financial_metrics.py`

**Lens 2 — Standalone Coverage** ("Can this project service its own debt?")
- Metrics: New debt DSCR, debt per unit, fill-up coverage
- Level: New financing only
- Primary home: `bond_sizing`
- Answers the lender's question on new money in isolation

**Lens 3 — Combined / Covenant** ("What does this do to the whole organization?")
- Metrics: Existing + new debt ratios, MTI covenant compliance,
  standalone vs. combined delta, CARF benchmark comparison
- Level: Enterprise / obligated group
- Primary home: `ratio_analytics` (pulls from both Lens 1 and Lens 2)
- This is the SEER ongoing-monitoring use case

## CARF vs. generic ratio distinction — the concrete differentiator

Standard DSCR:
```
(Net Income + D&A + Interest) ÷ MADS
```

CARF Life Plan Community DSCR:
```
(Net Income + D&A + Interest + Net Entrance Fee Receipts) ÷ MADS
```

During fill-up, net entrance fee receipts can be $10–30M in a single year.
The difference between these two formulas is not cosmetic — it can be the
difference between a ratio of **0.4x (technically in default)** and
**2.8x (comfortably covered)** on the exact same underlying financials. CARF
ratios exist because they reflect the actual economic reality of the
entrance fee model, which generic FPA definitions don't account for.

## Three ratio definition sets (planned structure)

- `definitions/generic.py` — standard FPA / industry
- `definitions/carf.py` — CARF Life Plan Community modifications
- `definitions/mti_covenant.py` — **per-deal**, populated from actual bond
  documents (see note below — this is not a fixed formula set)

### MTI covenant ratios are deal-specific, not formula-specific
MTI covenant ratios are defined in the bond documents themselves — not by
CARF, not by a generic FPA package. The indenture is the controlling
document for covenant testing. `mti_covenant.py` needs to function as a
*customization layer* populated from actual bond docs per deal, not a fixed
formula set like `generic.py` or `carf.py`.

## SEER monitoring angle

Community uploads audited financials → SEER runs the ratio engine →
dashboard shows standing vs. CARF benchmarks and covenant thresholds,
with year-over-year trending. An early-warning system for covenant
pressure. This is the genuinely differentiated product angle — no generic
FPA package is built specifically for Life Plan Communities this way.

## Status / next steps
- Needs another ideation session with Jake before module boundaries are
  firm enough to write a BOND_SIZING_SPEC.md-style build-ready spec.
- Once firm, this becomes `docs/specs/RATIO_ANALYTICS_SPEC.md` (build-ready),
  with this file either superseded or kept as the architectural rationale
  the build spec points back to.
