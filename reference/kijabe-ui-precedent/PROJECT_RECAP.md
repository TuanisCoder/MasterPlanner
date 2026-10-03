# AIC Kijabe Hospital - Capital Project Planning Tool
## Portable Project Recap — Paste this at the start of a new chat for full context

---

## 1. PROJECT GOAL

Building a **React-based interactive planning tool** to replace/supplement an Excel financial model (`KHCapitalPlanner.xlsx`) used by AIC Kijabe Hospital (Kenya) to plan capital projects (new buildings, clinics, housing, etc.). 

**Core purpose:** Give the Kenyan hospital team an easy-to-use web form to enter project assumptions (construction costs, revenue, philanthropy, expenses) so the user (based in the US) can pull that data into their master Excel model — without acting as a manual data-entry middleman. The tool also needs to eventually recreate the dashboards/charts from the Excel model for stakeholder/board presentations and US fundraising.

**End state vision:** 10 projects (expandable to 15), each with ~44 input fields, global assumptions, currency conversion for US audiences, financial metrics (NPV/IRR/MIRR/Payback/Operating Margin), export to Excel/JSON, and portfolio-level dashboards.

---

## 2. KEY SOURCE FILES (uploaded by user, for reference)

- `KJB02142026.xlsm` — original Excel base model (10 projects, "KJB | Projects" sheet)
- `InputClaud.xlsx` — cleaner input template ("ModelInputs" sheet), all values in KES, showed macro (global) vs per-project structure
- `KHCapitalPlanner.xlsx` — **current authoritative source**. Three sheets:
  - `CapitalDB` — dashboard with currency selector (USD), conversion factor (0.0078), and **3 Bar Charts** + summary metrics (NOM %, Project Capital, Fundraising Target, NPV, MIRR, Payback Years, Discount Rate, Reinvestment Rate)
  - `KH-Project-Inputs` — all 10 project columns, all values in **USD** (not KES), each field marked in Column E as `Input>>` or `Drop Down>>` if it requires entry
  - `KH-Outputs` — calculated aggregate + per-project outputs (revenue, expenses, NOM, cash flow, fundraising excess/shortfall), plus **1 Bubble Chart**
  - Design lets user add projects 11+ by copying a column — praised as "slick" design that forces the Kenyan team to fill in real assumptions instead of leaving them vague.

**10 Projects Identified (from KHCapitalPlanner.xlsx):**
1. OPD – Outpatient Multidisciplinary Center
2. HOUSING – Resident Housing 1
3. ADMIN – Health Management Information System (HMIS)
4. HOUSING – Resident Housing 2
5. CLINIC – Nairobi Clinic Operating Theater
6. HOSPITAL – Marira Mental Health Hospital
7. CLINIC – Frontier Satellite Clinic
8. (no business unit tagged) – ICU Expansion
9. ADMIN – Solar Project
10. ADMIN – Other Capital Projects

---

## 3. KEY DECISIONS MADE (Q&A LOG — IMPORTANT, DON'T RE-ASK)

| # | Topic | Decision |
|---|-------|----------|
| 1 | Which fields go in the input form | **All fields Excel marks as `Input>>` or `Drop Down>>`** in Column E of `KH-Project-Inputs` — 44 total fields identified. Let the Kenyan team experience the same "forcing function" the user experienced. |
| 2 | Field requirement logic | **Calculated fields = always read-only.** **Required fields** = only those needed for outputs to function (e.g., discount rate for NPV, construction outlay, business unit, at least one revenue source). **Conditional/decision-tree logic**: IF "Use Expense Override" is checked → only the single override $ is required; IF unchecked → Labor + Supplies + Admin all become required. User expects ~90% completion from the Kenyan team and will personally fill remaining gaps on a call. |
| 3 | Inflation/growth assumptions (Revenue Increase, Expense Inflation - Labor/Non-Labor/Override, Investment Income Rate) | **GLOBAL** — set once, apply to all projects (not per-project). |
| 4 | Export format | **BOTH** Excel (.xlsx/.csv) export AND JSON export. User explicitly wants to learn how to use JSON (educational interest) in addition to the Excel path. |
| 5 | Project 8 (ICU Expansion) missing Business Unit | **Business Unit made a REQUIRED field for every project**, no defaults — user will handle all aggregation/roll-ups in their own master model, so the granularity in this tool is final. |
| 6 | Currency | All **inputs must be entered in USD** (per KHCapitalPlanner.xlsx — note: earlier version InputClaud.xlsx had used KES, but the authoritative file uses USD with a conversion factor). Interface should still support a **display toggle** between USD and local currency for US fundraising audiences (avoid "sticker shock" from raw large local-currency numbers). Exchange rate should be an adjustable global setting. |
| 7 | Rollout sequence | Build **Project 1 fully first** → user "battle tests" it personally → generate a punch-list of fixes → THEN scale to all 10 projects → THEN add a "Create New Project" feature so user can add up to 5 more (15 total) without ever touching code again. |
| 8 | Charts/Dashboards | Do NOT build yet. First: confirm feasibility of replicating Excel's charts, and propose additional dashboard ideas. (See Section 6 below — analysis is done, build is pending user's go-ahead.) |

**Pending/Unanswered:**
- User was about to manually walk through the Excel input form to generate a punch-list of any missing fields/tweaks needed in the React version (this was the task right before the recap request — not yet delivered back).
- No decision yet on which dashboards to actually build (only analysis/recommendations delivered).

---

## 4. TECHNICAL APPROACH / ARCHITECTURE

- **Stack:** Single-file React component (functional components + hooks), inline styles (no Tailwind dependency issues), Recharts for charts, lucide-react for icons.
- **Deployment path for user (non-developer):** CodeSandbox.io (free, no install). Note: local standalone HTML file approach was tried but **failed in Safari** (blank page — Safari blocks local file JS/module loading) — CodeSandbox is the reliable path going forward. Steps that work: create blank React sandbox → add `recharts` + `lucide-react` under "Dependencies" tab → paste code into `App.js` → view via the **Preview dropdown** (this was the point of confusion — preview lives behind a dropdown, not automatically visible).
- **State structure:** single `project` object per project with nested sections (timing, capital, philanthropy, operations) OR flattened field structure (latest version flattened for simplicity — see file notes below). `globalSettings` object holds shared assumptions (revenue growth, inflation rates, discount/reinvestment/finance rate, exchange rate).
- **Financial calc functions built (reusable, validated):**
  - `calculateNPV(cashFlows, rate)`
  - `calculateIRR(cashFlows)` — Newton-Raphson, 100 iterations
  - `calculateMIRR(cashFlows, financeRate, reinvestRate)` — separate finance/reinvestment rates (real-estate-appropriate)
  - `calculatePayback(cashFlows)` — with fractional year
  - Operating Margin = (stabilized revenue − stabilized expense) / stabilized revenue, measured at year 5 of operations
  - Donated labor logic: added to BOTH revenue and expense equally → zero net cash flow impact, but shows correctly in Operating Margin/financial statements (non-cash entry, important for their reporting).

---

## 5. FILE INVENTORY (all previously delivered — reference by name)

> ⚠️ These files exist only in the **prior chat's** `/mnt/user-data/outputs/` sandbox and are likely not carried over automatically. If continuing in a new chat/location, **re-upload the source Excel files** (`KHCapitalPlanner.xlsx` at minimum) so I can regenerate code artifacts. I can also just rebuild the latest `.jsx` from this recap's descriptions if the file isn't available.

| File | Purpose | Status |
|------|---------|--------|
| `project1-complete.jsx` | **LATEST / MOST CURRENT** — full Project 1 interface: all 44 fields, required-field validation w/ red borders, progress % tracker, conditional expense-override logic, business unit dropdown, global settings banner, dual export (JSON + CSV/Excel), 5 metric cards (NPV/IRR/MIRR/Payback/Op Margin), collapsible sections matching Excel groupings. **This is the one to keep iterating on.** | Delivered, awaiting user battle-test feedback |
| `BATTLE_TEST_GUIDE.md` | 10-point testing checklist + sample data set to fully populate Project 1 fields for testing; JSON import instructions (Power Query/Python) | Delivered |
| `DASHBOARD_ANALYSIS.md` | Full analysis of the 3 Bar Charts + 1 Bubble Chart found in `KHCapitalPlanner.xlsx`; confirms 100% replicable in Recharts; proposes 7 candidate dashboards (Portfolio Overview, Fundraising Tracker, Cash Flow Analysis, Business Unit Aggregation, Scenario Comparison, Project Detail Drill-down, Executive Summary) plus long list of additional financial/operational/fundraising/risk metrics beyond current overview | Delivered, decision pending |
| `IMPLEMENTATION_ANALYSIS.md` | Earlier feasibility write-up mapping `InputClaud.xlsx` (KES-based) fields into React structure — superseded by KHCapitalPlanner.xlsx (USD-based) but has useful field-grouping thinking | Superseded, historical reference |
| `phase1-complete.jsx` | Earlier full single-project version (KES-based, Global Settings banner, currency toggle, collapsible sections) — precursor to `project1-complete.jsx` | Superseded |
| `codesandbox-v2-with-mirr.jsx` | Added MIRR + reinvestment rate input + Operating Margin metric to original single demo project (10-project selector version, no full input form yet) | Superseded |
| `codesandbox-simple.jsx` / `demo.html` / `codesandbox-version.jsx` | Simplified/troubleshooting versions built while debugging CodeSandbox/Safari rendering issues | Superseded / troubleshooting artifacts |
| `project-planning-interface.jsx` | Original first full version (Tailwind-style inline CSS, 10-project selector, tabs: Overview/Assumptions/Cash Flow/Sources & Uses) | Superseded |
| `excel_to_json.py` | Python/openpyxl script to export original `KJB02142026.xlsm` → `projects.json` | Historical, tied to old file structure |
| `projects.json` | Exported data from original Excel base model | Historical, tied to old file structure |
| `IMPLEMENTATION_GUIDE.md`, `README.md`, `SIMPLE_SETUP_GUIDE.md` | Various setup/how-to docs from earlier phases | Reference only |

**Bottom line:** if picking this up fresh, the two files that matter most are **`project1-complete.jsx`** (the code) and **`BATTLE_TEST_GUIDE.md`** (how to test it), plus **`DASHBOARD_ANALYSIS.md`** for the next phase of chart work.

---

## 6. IMMEDIATE NEXT STEPS (pick up here)

1. **Get user's punch-list** from manually walking through the Excel input form side-by-side with `project1-complete.jsx` — this was in progress when the session ended.
2. **Apply fixes/tweaks** to `project1-complete.jsx` based on that punch-list.
3. **Scale to all 10 projects** — add a project-selector sidebar, replicate the form structure per project, track completion % per project.
4. **Add "Create New Project" capability** — let the user's team add up to 5 more projects (11–15) without developer involvement.
5. **Build chosen dashboards** — user has not yet picked priorities from `DASHBOARD_ANALYSIS.md`; recommended starting point was **Portfolio Overview** (bubble chart: NPV vs IRR, bubble size = capital cost) + **Fundraising Tracker** (waterfall + progress bars + pie chart of donor mix).
6. Consider building a proper **Excel export** (real `.xlsx` via a library, not just CSV) if the user wants the exported file to drop directly back into `KHCapitalPlanner.xlsx` structure.

---

## 7. HOW TO RESUME IN A NEW CHAT

Paste this whole document back to Claude, and optionally re-attach:
- `KHCapitalPlanner.xlsx` (source of truth for fields/structure)
- `project1-complete.jsx` (if available, so edits are incremental rather than rebuilt from scratch)

Then tell Claude what the punch-list from your manual Excel walkthrough turned up, and whether you want to proceed to scaling (Step 3 above) or dashboards (Step 5).
