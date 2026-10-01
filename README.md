# MasterPlanner

A Python-based master planning and bond sizing engine for life plan community
(CCRC) development scenarios — used to explore master planning options and
their financial implications over a 15-year projection horizon.

**Status:** early build-out. Core sizing logic (Class 1 — New Money Project
Sizing) is being implemented first; a client-facing React interface will be
layered on top once the engine itself is working end-to-end.

## What this is

Three analytical lenses over a proposed (or existing + proposed) CCRC
development:

1. **Economic** (`master_planning/`) — Is this a good investment? NPV, IRR,
   MIRR, payback, operating margin.
2. **Standalone coverage** (`bond_sizing/`) — Can this project service its
   own debt? New debt DSCR, debt per unit, fill-up coverage.
3. **Combined / covenant** (`ratio_analytics/`) — What does this do to the
   whole organization? Existing + new debt ratios, MTI covenant compliance,
   CARF benchmarks.

`shared/` holds common financial math (NPV, IRR, MIRR, etc.) used across all
three.

## Important caveat

This software is illustrative / planning-support only. It is not municipal
advice under SEC Exchange Act Section 15B, SEC Rule 15Ba1-1, or MSRB Rule
G-42. It does not replace a registered municipal advisor or bond counsel —
users should be directed to both before relying on any output for an actual
financing decision.

## Repo structure

```
MasterPlanner/
├── master_planning/     # Lens 1 — economic feasibility
├── bond_sizing/         # Lens 2 — standalone debt coverage
├── ratio_analytics/     # Lens 3 — combined / covenant analysis
├── shared/               # common financial math
├── recaps/               # session-by-session working notes (see PROJECT_CONTEXT.md)
├── PROJECT_CONTEXT.md    # working protocol — read this first in any new session
└── pyproject.toml
```

## Setup

Requires Python 3.12+. If not already installed:

```bash
brew install python@3.12
```

Then create the virtual environment with that specific version:

```bash
/opt/homebrew/bin/python3.12 -m venv .venv
source .venv/bin/activate
python --version   # should print 3.12.x
pip install -e ".[dev]"
```

## Ownership

Built for Blue Ocean Advisors (Mario McKenzie). May later be licensed to or
integrated with SEER as a separate, dependent package — not merged into
SEER's own repo.
