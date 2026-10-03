# Ideas Inbox

Smaller design decisions and raw ideas that don't yet warrant their own
spec file, carried over from planning-engine-lab (2026-09-01 session) plus
anything new that surfaces the same way going forward. Promote an entry to
its own file under `docs/specs/` once it's build-ready; delete it from here
once promoted or once it's been superseded.

---

## Entrance fee actuarial engine
A Python actuarial engine fed by a fill schedule — calculates net entrance
fee receipts by period, ITB paydown schedule, and residual EF flows into
operating revenue. A simple version already exists conceptually (see
BOND_SIZING_SPEC.md's `itb.py`); the actuarial engine would be the upgrade.
Interesting enough to eventually be a standalone module with its own spec.

## Philanthropy as a real input, not a footnote
Philanthropy ranges from $0 to $10M+ depending on sponsor type (faith-based
organizations at the high end). Treat as an explicit source of funds in
bond sizing that directly reduces par amount. Should be a first-class input
field in the master planning UI, not an afterthought — this is also a
natural fit for the scarce-information-first pattern (see
MASTER_PLANNING_DESIGN_PRINCIPLES.md): a single estimated $ figure now,
a real pledge schedule later.

## MTI covenant ratios are per-deal
See RATIO_ANALYTICS_ARCHITECTURE.md — already captured there in full, kept
here only as a pointer so it's not lost in two places with different levels
of detail.
