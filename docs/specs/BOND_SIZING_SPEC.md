# Bond Sizing Engine — Master Specification
**Version:** 1.0  
**Project:** Blue Ocean Advisors / SEER  
**Author:** Mario (architecture), Claude (spec)  
**Status:** Ready for implementation  
**Target runtime:** Python 3.11+

---

## ⚠️ Regulatory Disclaimer — Embed in All Outputs

> *This model produces illustrative estimates for master planning and internal scenario
> analysis purposes only. It does not constitute advice with respect to the structure,
> timing, terms, or issuance of municipal securities under SEC Exchange Act Section 15B,
> SEC Rule 15Ba1-1, or MSRB Rule G-42. Users should engage a registered municipal
> advisor (SEC/MSRB) and qualified bond counsel prior to any debt issuance decision.
> Results are not a commitment to lend, underwrite, or structure any transaction.*

This text must appear verbatim on every Excel output tab and any client-facing screen.

---

## 1. Purpose & Scope

This engine performs illustrative bond sizing calculations for nonprofit CCRC (Continuing
Care Retirement Community) master planning scenarios. It supports two sizing classes:

- **Class 1** — New money project financing (ground-up or expansion)
- **Class 2** — Wraparound / refunding against existing debt

The engine is designed to be:
- Called from Python scripts or a web backend
- Exported to formatted Excel workbooks via `openpyxl`
- Embedded in a master planning module used by both Blue Ocean Advisors and SEER
- Executable by a local LLM from this spec, with Claude consulted for complex logic

---

## 2. Tool Stack & Execution Guidance

| Concern | Tool |
|---|---|
| Design, architecture, debugging hard logic | Claude (claude.ai) |
| Boilerplate, function scaffolding, routine implementation | Local LLM (VS Code / Continue.dev) |
| Runtime environment | Python 3.11+, VS Code |
| Required packages | `numpy-financial`, `openpyxl`, `pandas` |

### When to escalate back to Claude
Flag and pause local LLM execution at:
- The iterative arbitrage yield / TIC solve (IRR convergence)
- The MTI bank tranche balloon calculation
- The Class 2 wraparound optimizer
- Any IRS 3-part DSRF test edge cases
- Excel formatting decisions (layout, conditional formatting)

---

## 3. Repository Structure

```
bond_sizing/
├── BOND_SIZING_SPEC.md       ← this file
├── inputs/
│   └── sample_inputs.py      ← example assumption dicts
├── engine/
│   ├── __init__.py
│   ├── par_solve.py          ← algebraic par amount solve (Class 1)
│   ├── debt_service.py       ← PMT schedule builder, denomination rounding
│   ├── project_fund.py       ← draw schedule, interest earnings, net funding
│   ├── capi.py               ← capitalized interest fund
│   ├── dsrf.py               ← debt service reserve fund, IRS 3-part test
│   ├── itb.py                ← intermediate term bond, entrance fee paydown
│   ├── bank_tranche.py       ← MTI bank tranche, balloon at year N
│   └── wrap.py               ← Class 2 wraparound / refunding optimizer
├── export/
│   ├── __init__.py
│   └── excel_export.py       ← openpyxl workbook builder
├── utils/
│   ├── __init__.py
│   └── date_utils.py         ← 30/360 day count, period helpers
└── main.py                   ← orchestrator — runs full sizing, exports workbook
```

---

## 4. Core Data Structures

### 4.1 Assumptions Dict (input to all Class 1 functions)

```python
assumptions = {
    # Dates
    "dated_date": "2025-01-01",         # str, YYYY-MM-DD
    "delivery_date": "2025-01-15",
    "first_interest_date": "2025-07-01",
    "construction_months": 24,           # int
    "capi_cushion_months": 6,            # int — added to construction period

    # Project
    "project_draws": [                   # list of (date_str, amount_float)
        ("2025-02-01", 2_000_000),
        ("2025-05-01", 3_500_000),
        ("2025-08-01", 4_000_000),
        ("2026-01-01", 5_000_000),
    ],
    "project_fund_investment_rate": 0.04,  # annual, decimal

    # Debt structure
    "bond_term_years": 35,               # int — 30, 35, or 40
    "coupon_rate": 0.05,                 # annual, decimal (flat rate for planning)
    "denomination": 5_000,              # int — standard $5,000

    # Intermediate Term Bond (ITB)
    "itb_amount": 5_000_000,            # float — 0 if none
    "itb_rate": 0.045,
    "itb_term_years": 7,                 # repayment period from fill-up EF receipts
    "itb_entrance_fee_schedule": [       # list of (date_str, amount_float) payments
        ("2026-01-01", 500_000),
        ("2026-07-01", 750_000),
        # ...
    ],

    # Bank Tranche (MTI)
    "bank_tranche_amount": 0,           # float — 0 if none
    "bank_tranche_rate": 0.055,
    "bank_tranche_balloon_year": 10,    # int
    "bank_tranche_mti_amort_years": 30, # int — MTI-tested amortization period

    # Costs
    "costs_of_issuance_fixed": 250_000,  # float
    "underwriter_discount_pct": 0.01,    # decimal (1% of par)

    # DSRF
    "dsrf_required": True,               # bool
    "dsrf_investment_rate": 0.04,

    # Capitalized Interest
    "capi_investment_rate": 0.04,

    # Existing debt (Class 2 only)
    "existing_ds_schedule": None,        # list of (year, principal, interest) or None
    "refund_existing": False,            # bool
}
```

### 4.2 Sizing Result Dict (output of par_solve.py)

```python
sizing_result = {
    "par_amount": 0.0,                  # float — rounded to denomination
    "itb_amount": 0.0,
    "bank_tranche_amount": 0.0,
    "pv_project_draws": 0.0,
    "capi_deposit": 0.0,
    "dsrf_deposit": 0.0,
    "costs_of_issuance": 0.0,
    "underwriter_discount": 0.0,
    "total_uses": 0.0,
    "total_sources": 0.0,
    "rounding_adjustment": 0.0,
    "annual_debt_service": 0.0,         # level PMT on long-term bonds
    "all_in_tic_estimate": 0.0,         # approximate — not IRS-certified
}
```

### 4.3 Debt Service Schedule (output of debt_service.py)

```python
ds_schedule = [
    {
        "year": 2028,
        "lt_bond_principal": 0.0,
        "lt_bond_interest": 0.0,
        "lt_bond_total": 0.0,
        "itb_principal": 0.0,
        "itb_interest": 0.0,
        "bank_tranche_principal": 0.0,
        "bank_tranche_interest": 0.0,
        "capi_offset": 0.0,             # negative — reduces gross DS
        "net_debt_service": 0.0,
        "existing_ds": 0.0,             # Class 2 only
        "combined_ds": 0.0,             # Class 2 only
    },
    # ... one dict per year through maturity
]
```

---

## 5. Module Specifications

### 5.1 `par_solve.py` — Algebraic Par Solve

**Purpose:** Solve for par amount in one pass. No iteration. No circular references.

**Core formula:**

```
Par = (PV_draws + COI_fixed + ITB + CAPI_fixed_offset)
      ÷ (1 − UW_pct − DSRF_pct − CAPI_rate × CAPI_periods_fraction)
```

Where:
- `PV_draws` = present value of project draw schedule at `project_fund_investment_rate`
- `COI_fixed` = `costs_of_issuance_fixed`
- `ITB` = `itb_amount` (treated as fixed — separately sized)
- `CAPI_fixed_offset` = 0 (CAPI is par-dependent, lives in denominator)
- `UW_pct` = `underwriter_discount_pct`
- `DSRF_pct` = result of IRS 3-part test (from `dsrf.py`) expressed as % of par
- `CAPI_rate` = `coupon_rate`
- `CAPI_periods_fraction` = `(construction_months + capi_cushion_months) / 12`

**Function signature:**

```python
def solve_par(assumptions: dict) -> sizing_result: dict
```

**Steps:**
1. Call `project_fund.pv_draws(assumptions)` → `pv_draws`
2. Call `dsrf.dsrf_pct_of_par(assumptions)` → `dsrf_pct` (approximation for initial solve)
3. Compute denominator: `1 - uw_pct - dsrf_pct - (coupon * capi_fraction)`
4. Compute raw par: `(pv_draws + coi_fixed + itb_amount) / denominator`
5. Round up to next `denomination` multiple
6. Recompute all components at rounded par
7. Return `sizing_result` dict

⚠️ **Claude consultation point:** If DSRF uses 100% max annual DS test, this creates a
dependency on the debt service schedule (which depends on par). A second-pass correction
is needed. Flag and consult Claude for implementation.

---

### 5.2 `project_fund.py` — Project Fund

**Purpose:** PV-discount the draw schedule; compute interest earnings that flow back
to fund project costs.

**Function signatures:**

```python
def pv_draws(assumptions: dict) -> float:
    """
    Discount each draw at project_fund_investment_rate using 30/360, semiannual.
    Sum of PVs = required deposit to project fund from bond proceeds.
    Uses numpy_financial.pv() per draw date relative to delivery_date.
    """

def project_fund_schedule(assumptions: dict, par: float) -> list[dict]:
    """
    Returns period-by-period schedule:
    [{ "date": str, "deposit": float, "draw": float,
       "interest": float, "balance": float }]
    Interest earnings reduce required deposit (net funding method).
    """
```

---

### 5.3 `capi.py` — Capitalized Interest Fund

**Purpose:** Compute the CAPI deposit funded from bond proceeds to cover interest
payments during the construction + cushion period.

**Logic:**

```
CAPI_periods = construction_months + capi_cushion_months
CAPI_deposit = Par × coupon_rate × (CAPI_periods / 12)
               discounted at capi_investment_rate for net funding
```

**Function signatures:**

```python
def capi_deposit(par: float, assumptions: dict) -> float:
    """
    Returns dollar amount to fund from proceeds.
    Accounts for interest earnings on CAPI fund during draw period.
    """

def capi_schedule(par: float, assumptions: dict) -> list[dict]:
    """
    Returns semiannual schedule of CAPI draws (= bond interest due each period)
    offset against fund balance and earnings.
    [{ "date": str, "interest_due": float, "capi_draw": float, "balance": float }]
    """
```

---

### 5.4 `dsrf.py` — Debt Service Reserve Fund

**Purpose:** Compute DSRF deposit using IRS 3-part test (or return 0 if not required).

**IRS 3-Part Test — Lesser of:**
1. 10% of par amount
2. 100% of maximum annual debt service
3. 125% of average annual debt service

**Function signatures:**

```python
def dsrf_deposit(par: float, ds_schedule: list, assumptions: dict) -> float:
    """
    Returns DSRF deposit amount.
    If assumptions["dsrf_required"] is False, returns 0.
    Requires ds_schedule from debt_service.py — may need two-pass solve.
    """

def dsrf_pct_of_par(assumptions: dict) -> float:
    """
    Returns approximate DSRF as decimal % of par for initial par solve.
    Uses 10% of par as conservative estimate when DS schedule not yet available.
    Returns 0 if dsrf_required is False.
    """
```

⚠️ **Claude consultation point:** Two-pass solve when using max annual DS or avg DS
tests. First pass uses 10% approximation; second pass corrects with actual DS schedule.

---

### 5.5 `itb.py` — Intermediate Term Bond

**Purpose:** Model the ITB tranche — short-term debt secured by entrance fee receipts,
repaid during fill-up period before long-term amortization begins.

**Logic:**
- ITB is a separate bond component with its own rate and term
- Repaid from entrance fee receipt schedule (not from operating revenues)
- ITB exits the combined debt service once repaid
- Long-term bonds begin full amortization after ITB payoff

**Function signatures:**

```python
def itb_schedule(assumptions: dict) -> list[dict]:
    """
    Returns annual schedule of ITB debt service, offset by EF receipts.
    [{ "year": int, "balance": float, "interest": float,
       "ef_payment": float, "principal": float, "ending_balance": float }]
    Entrance fee payments reduce balance each period.
    """

def itb_payoff_year(assumptions: dict) -> int:
    """
    Returns the year in which ITB balance reaches zero.
    Used by debt_service.py to start long-term amortization.
    """
```

---

### 5.6 `bank_tranche.py` — MTI Bank Tranche

**Purpose:** Model optional bank tranche — 10-year balloon note, amortized over 30
years for MTI coverage testing purposes.

**Logic:**
- MTI-tested payment = `npf.pmt(rate, mti_amort_years, tranche_amount)`
- Actual annual payments years 1–N = MTI-tested payment (principal + interest)
- Balloon at year N = PV of remaining payments (years N+1 through mti_amort_years)
  computed as `npf.pv(rate, mti_amort_years - balloon_year, pmt)`
- Combined debt service for coverage testing uses MTI-tested payment (not balloon)

**Function signatures:**

```python
def bank_tranche_pmt(assumptions: dict) -> float:
    """
    Returns annual MTI-tested payment using 30-year amortization.
    Uses numpy_financial.pmt().
    """

def bank_tranche_balloon(assumptions: dict) -> float:
    """
    Returns balloon amount due at bank_tranche_balloon_year.
    = PV of remaining payments after balloon year.
    """

def bank_tranche_schedule(assumptions: dict) -> list[dict]:
    """
    Returns annual schedule through balloon year.
    [{ "year": int, "principal": float, "interest": float,
       "balance": float, "is_balloon_year": bool }]
    """
```

⚠️ **Claude consultation point:** Confirm balloon calc uses remaining payment count
correctly. `npf.pv(rate, n_remaining, pmt)` where n_remaining = mti_amort_years −
balloon_year.

---

### 5.7 `debt_service.py` — Debt Service Schedule Builder

**Purpose:** Build the complete annual debt service table combining all components.

**Function signatures:**

```python
def build_schedule(par: float, assumptions: dict,
                   itb_sched: list, bank_sched: list,
                   capi_sched: list) -> list[dict]:
    """
    Returns ds_schedule (see Section 4.3).
    Long-term bond PMT computed via numpy_financial.pmt().
    Principal allocated to maintain level total DS.
    $5,000 denomination rounding applied — residual tracked as rounding_adjustment.
    CAPI offset applied as negative in net_debt_service column.
    """

def level_ds_pmt(par: float, assumptions: dict) -> float:
    """
    Returns annual level debt service payment on long-term bonds only.
    Excludes ITB and bank tranche.
    Uses numpy_financial.pmt(coupon_rate, bond_term_years, -par).
    """
```

---

### 5.8 `wrap.py` — Class 2 Wraparound / Refunding

**Purpose:** Shape new bond amortization around existing debt service to produce
level combined DS. Optionally incorporate refunding of existing bonds.

**Input:** `existing_ds_schedule` — list of `(year, existing_ds)` tuples  
**Goal:** New bond DS fills gaps such that `new_ds[year] + existing_ds[year] ≈ constant`

**Logic (heuristic approach — not full linear optimization):**
1. Compute target combined DS = `level_ds_pmt(total_new_par + PV_existing, assumptions)`
2. For each year: `new_ds_target[year] = target_combined − existing_ds[year]`
3. Back-solve principal from `new_ds_target` given coupon
4. Adjust for denomination rounding
5. Iterate until convergence (max 20 passes)

⚠️ **Claude consultation point:** Full wraparound optimization. This is the most
complex module. Do not implement without Claude review of the algorithm.

**Function signatures:**

```python
def wraparound_schedule(par: float, assumptions: dict) -> list[dict]:
    """
    Returns combined DS schedule with new + existing components.
    Adds "existing_ds" and "combined_ds" fields to each year dict.
    """
```

---

### 5.9 `excel_export.py` — Workbook Builder

**Purpose:** Write a formatted multi-tab Excel workbook using `openpyxl`.

**Tabs:**
1. **Cover** — disclaimer text (verbatim from Section 1), run date, scenario name
2. **Assumptions** — echo of all inputs
3. **Sources & Uses** — `sizing_result` formatted as balance sheet
4. **Debt Service** — `ds_schedule` with gross / CAPI offset / net columns
5. **Project Fund** — draw schedule, earnings, balance
6. **DSRF** — reserve fund schedule (if applicable)
7. **ITB** — entrance fee paydown schedule (if applicable)
8. **Bank Tranche** — MTI amortization + balloon (if applicable)
9. **Scenarios** *(optional)* — side-by-side comparison of 30/35/40 year runs

**Formatting standards:**
- Dollar amounts: `$#,##0` format
- Percentages: `0.00%`
- Year column: left-aligned integer
- Header rows: bold, light blue fill (`BEE3F8`)
- Disclaimer tab: red bold text on white background
- No merged cells in data ranges (Excel interop safety)
- All tabs include disclaimer footer in row 3

**Function signature:**

```python
def export_workbook(sizing_result: dict, ds_schedule: list,
                    project_fund_schedule: list, assumptions: dict,
                    output_path: str, scenario_name: str = "Base Case") -> str:
    """
    Writes workbook to output_path.
    Returns output_path on success.
    Raises ValueError if disclaimer text is missing from Cover tab.
    """
```

---

### 5.10 `main.py` — Orchestrator

**Purpose:** Wire all modules together. Entry point for a full sizing run.

```python
def run_sizing(assumptions: dict, output_path: str,
               scenario_name: str = "Base Case") -> dict:
    """
    Full Class 1 sizing run. Returns sizing_result.
    Steps:
    1.  pv_draws = project_fund.pv_draws(assumptions)
    2.  par = par_solve.solve_par(assumptions)
    3.  capi = capi.capi_deposit(par, assumptions)
    4.  dsrf = dsrf.dsrf_deposit(par, ds_schedule_pass1, assumptions)
    5.  itb_sched = itb.itb_schedule(assumptions)
    6.  bank_sched = bank_tranche.bank_tranche_schedule(assumptions)
    7.  capi_sched = capi.capi_schedule(par, assumptions)
    8.  ds_schedule = debt_service.build_schedule(par, assumptions, ...)
    9.  [second pass dsrf correction if needed]
    10. excel_export.export_workbook(...)
    11. return sizing_result
    """

def run_scenarios(base_assumptions: dict, output_path: str) -> list[dict]:
    """
    Runs 30, 35, and 40 year variants in a loop.
    Returns list of sizing_results for comparison tab.
    """
```

---

## 6. Dependencies

```
# requirements.txt
numpy-financial>=1.0.0
openpyxl>=3.1.0
pandas>=2.0.0        # for schedule manipulation
python-dateutil>=2.8  # for date arithmetic
```

Install: `pip install numpy-financial openpyxl pandas python-dateutil`

---

## 7. Implementation Order (for local LLM)

Build in this sequence — each module depends on the previous:

```
1. utils/date_utils.py          ← no dependencies
2. project_fund.py              ← uses date_utils
3. dsrf.py (pct approximation)  ← no DS schedule needed for initial
4. par_solve.py                 ← uses project_fund, dsrf
5. capi.py                      ← uses par from par_solve
6. itb.py                       ← standalone
7. bank_tranche.py              ← standalone
8. debt_service.py              ← uses all above
9. dsrf.py (full 3-part test)   ← now has DS schedule
10. excel_export.py             ← uses all result dicts
11. main.py                     ← orchestrates everything
12. wrap.py                     ← CLASS 2 — build last, consult Claude first
```

---

## 8. Regulatory Compliance Checklist

Before any client-facing use, verify:

- [ ] Disclaimer text appears verbatim on Excel Cover tab
- [ ] Disclaimer footer appears on every data tab
- [ ] No output labels use the words "advice," "recommend," or "advise"
- [ ] Scenario names never reference a specific issuer or issuance
- [ ] Model does not calculate or display credit ratings
- [ ] Output file includes run timestamp and "ILLUSTRATIVE ONLY" watermark
- [ ] User-facing interface includes disclaimer acceptance checkbox before download

---

## 9. Future Integration Notes (SEER / Web Backend)

- All functions accept and return plain Python dicts/lists — no UI dependencies
- `assumptions` dict can be serialized to JSON for API transport
- `export_workbook()` accepts an `output_path` — in web context, write to temp file
  and stream to client
- Class separation (Class 1 / Class 2) maps cleanly to API endpoints:
  - `POST /api/sizing/class1`
  - `POST /api/sizing/class2`
- Disclaimer acceptance should be enforced at the API layer, not just the UI layer

---

*End of specification. Version this file alongside code. When assumptions change,
update spec first — then update code.*
