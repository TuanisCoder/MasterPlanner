# Dashboard & Chart Analysis - KHCapitalPlanner.xlsx

## 📊 WHAT YOU BUILT IN EXCEL

### **CapitalDB Sheet - Main Dashboard**
**Location:** Top section with 3 Bar Charts

**Key Metrics Displayed:**
- NOM % (Net Operating Margin %)
- PROJECT CAPITAL (total capital costs)
- FUNDRAISING TARGET
- Net Present Value
- MIRR (Modified Internal Rate of Return)
- Payback Years
- Discount Rate (linked to outputs)
- Reinvestment Rate (linked to outputs)

**3 Bar Charts Found:**
1. **Chart 1:** Bar chart (likely comparing projects or metrics)
2. **Chart 2:** "TOTAL FUNDRAISING- CAPITAL" - Bar chart showing fundraising vs target
3. **Chart 3:** Bar chart (position suggests bottom of dashboard)

---

### **KH-Outputs Sheet - Detailed Analytics**
**Location:** Large data output section

**1 Bubble Chart Found:**
- Position: Bottom section (rows 595-627)
- Likely: Risk/Return analysis or Project comparison by size

**Data Structure (Aggregate Section):**
```
REVENUE COMPONENTS:
├─ Project revenue (by year 2026-2035)
├─ Project donated staff
├─ Philanthropy - Operations
├─ Investment Income
└─ Total revenue

EXPENSE COMPONENTS:
├─ Project expenses
├─ Project donated labor expense
├─ Depreciation expense
└─ Total Expenses

PROFITABILITY METRICS:
├─ Project Income
├─ Net Operating Margin (NOM)
└─ NOM as % of Project Revenue

FUNDRAISING ANALYSIS:
├─ Philanthropy Inflows - Project
├─ Project Capital Outflow
└─ Excess (Shortfall)

CASH FLOW ANALYSIS:
├─ Project Revenue
├─ Philanthropy - Operations
├─ Investment Income (Loss)
├─ Philanthropy Inflows - Project
├─ Project Expenses
├─ Project Capital
└─ Cash Flow
```

**Per-Project Sections:**
Same structure repeated for each of 10 projects starting at Row 49+

---

## ✅ A) CAN I REPLICATE YOUR CHARTS IN REACT?

### **YES - 100% Replicable Using Recharts**

All your charts can be perfectly recreated in React. Here's the mapping:

### **1. Bar Charts (3 in CapitalDB)**
**React Library:** Recharts BarChart
**Difficulty:** Easy
**Fidelity:** 95%+

```javascript
<BarChart data={projectData}>
  <XAxis dataKey="projectName" />
  <YAxis />
  <Bar dataKey="fundraisingTarget" fill="#10b981" />
  <Bar dataKey="fundraisingActual" fill="#059669" />
</BarChart>
```

**Can Show:**
- Fundraising Target vs Actual by Project
- Capital Costs by Project
- NOM% comparison across projects
- Any metric comparison you want

---

### **2. Bubble Chart (1 in KH-Outputs)**
**React Library:** Recharts ScatterChart with bubble sizing
**Difficulty:** Medium
**Fidelity:** 90%+

```javascript
<ScatterChart>
  <XAxis dataKey="npv" name="NPV" />
  <YAxis dataKey="irr" name="IRR" />
  <ZAxis dataKey="capitalCost" range={[60, 400]} />
  <Scatter data={projects} fill="#8b5cf6" />
</ScatterChart>
```

**Perfect For:**
- Risk/Return Analysis (IRR vs NPV, bubble size = capital cost)
- Efficiency Analysis (Operating Margin vs Payback, size = revenue)
- Portfolio Visualization (any 3 metrics)

---

### **3. Additional Charts I Can Add:**

**Line Charts** - Time series
```javascript
<LineChart data={yearlyData}>
  <Line type="monotone" dataKey="revenue" stroke="#10b981" />
  <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
</LineChart>
```

**Area Charts** - Cumulative flows (already using this for cash flow!)
**Stacked Bar Charts** - Revenue/Expense breakdown
**Pie/Donut Charts** - Philanthropy source mix
**Composed Charts** - Multiple chart types combined

---

## 🎯 B) SUGGESTED ADDITIONAL DASHBOARDS

Based on your data structure, here are high-value dashboards:

### **Dashboard 1: PORTFOLIO OVERVIEW**
**What:** All 10 projects at a glance
**Charts:**
1. **Bubble Chart:** NPV vs IRR (size = Capital Cost)
   - X-axis: NPV
   - Y-axis: IRR%
   - Bubble size: Total capital required
   - Color: Business unit (OPD=green, HOUSING=blue, etc.)
   
2. **Stacked Bar Chart:** Capital Sources
   - Each project as a bar
   - Stacked: Philanthropy (green) vs Equity needed (orange)
   - Shows funding gap at a glance

3. **Bar Chart:** Operating Margin %
   - Compare profitability across all projects
   - Sorted high to low
   - Threshold line at target margin

**Why Useful:**
- Quick project ranking
- Identify which need more fundraising
- See profitability spread

---

### **Dashboard 2: FUNDRAISING TRACKER**
**What:** Capital campaign progress
**Charts:**
1. **Waterfall Chart:** Sources & Uses
   - Start: Total capital needed
   - Add: Each philanthropy source
   - End: Remaining equity gap
   
2. **Progress Bars:** Per-Project Funding
   - Each project's fundraising %
   - Green = >80%, Yellow = 50-80%, Red = <50%

3. **Pie Chart:** Philanthropy Source Mix
   - Friends of Kijabe: $X
   - Samaritan Purse: $Y
   - etc.

**Why Useful:**
- Track campaign progress
- Identify which donors to prioritize
- Board presentation ready

---

### **Dashboard 3: CASH FLOW ANALYSIS**
**What:** Year-by-year cash position
**Charts:**
1. **Stacked Area Chart:** Cash Flows by Type
   - Revenue (green area)
   - Expenses (red area)
   - Capital (orange area)
   - Philanthropy (blue area)
   - Net cash flow (line overlay)

2. **Bar Chart:** Annual Cash Position
   - Positive years (green bars up)
   - Negative years (red bars down)
   - Shows when cash crunch happens

3. **Line Chart:** Cumulative Cash
   - Running total over 10 years
   - Shows peak funding need
   - Identifies breakeven point

**Why Useful:**
- Understand timing of cash needs
- Plan debt/bridge financing
- See when projects become cash positive

---

### **Dashboard 4: BUSINESS UNIT AGGREGATION**
**What:** Roll-up by business unit (OPD, HOUSING, CLINIC, etc.)
**Charts:**
1. **Grouped Bar Chart:** Metrics by Business Unit
   - Total capital needed
   - Total revenue at stabilization
   - Total equity gap

2. **100% Stacked Bar:** Business Unit Mix
   - What % of total portfolio is each unit
   - By capital, by revenue, by margin

3. **Scatter Plot:** Business Unit Performance
   - X: Capital efficiency (revenue/capital)
   - Y: Operating margin %
   - Each business unit as a point

**Why Useful:**
- Strategic allocation decisions
- Balanced portfolio check
- Mission alignment (are you over-indexed on one area?)

---

### **Dashboard 5: SCENARIO COMPARISON**
**What:** Base case vs scenarios (optimistic/pessimistic)
**Charts:**
1. **Tornado Chart:** Sensitivity Analysis
   - Which assumptions matter most
   - Revenue growth impact
   - Cost escalation impact
   - Philanthropy shortfall impact

2. **Multi-Line Chart:** Scenario Cash Flows
   - Base case (solid line)
   - Optimistic (dashed green)
   - Pessimistic (dashed red)

3. **Table with Sparklines:** Key Metric Comparison
   - NPV: Base $X | Optimistic $Y | Pessimistic $Z
   - Each with mini trend chart

**Why Useful:**
- Risk assessment
- Board presentation
- Contingency planning

---

### **Dashboard 6: PROJECT DETAIL DRILL-DOWN**
**What:** Deep dive on selected project
**Charts:**
1. **Revenue Build-Up:** Stacked area showing ramp-up
   - Base revenue capacity
   - × Targeted op level
   - × Ramp-up factor
   - × Growth rate
   - Final: Annual revenue by source

2. **Expense Waterfall:** Cost components
   - Labor → Supplies → Admin → Donated → Total

3. **Monthly Cash Flow:** First 3 years
   - Show monthly (not annual) for early period
   - Critical for understanding timing

4. **Philanthropy Progress:** Gauge charts
   - Campaign % complete
   - Funding % secured
   - Time elapsed %

**Why Useful:**
- Detailed project review
- Investor due diligence
- Operational planning

---

### **Dashboard 7: EXECUTIVE SUMMARY** (Board-Ready)
**What:** 1-page overview for board meetings
**Components:**

**Top Row - Big Numbers:**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total Capital│ Philanthropy │ Equity Needed│ Portfolio NPV│
│   $XX.XM     │   $XX.XM     │   $X.XM      │   $XX.XM     │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Charts:**
1. **Portfolio Bubble Chart** (top visual)
2. **Fundraising Progress Bar** (campaign status)
3. **Cash Flow Timeline** (next 5 years)
4. **Risk Heatmap** (projects by risk/return quadrant)

**Bottom Table:**
| Project | BU | Capital | Raised | Gap | NPV | IRR | Status |
|---------|----|---------| -------|-----|-----|-----|--------|
| 1. OPD  | OPD| $19.2M  | $15M   |$4.2M|$45M |15.2%|🟡      |

**Why Useful:**
- Board can see everything in 30 seconds
- Print-friendly
- Makes you look super organized

---

## 💎 ADDITIONAL USEFUL METRICS BEYOND CURRENT OVERVIEW

### **Financial Metrics to Add:**

1. **Return on Investment (ROI)**
   - Simple: (Total Revenue - Total Cost) / Total Cost
   - Easier to explain than IRR to non-finance people

2. **Cash-on-Cash Return**
   - Annual cash flow / Equity invested
   - Real estate industry standard

3. **Debt Service Coverage Ratio (DSCR)**
   - If they'll have debt: Net Operating Income / Debt Service
   - Tells if project can support loans

4. **Capital Efficiency**
   - Annual Revenue / Capital Invested
   - How productive is each dollar of capital

5. **Breakeven Analysis**
   - Occupancy % needed to breakeven
   - Revenue needed to cover fixed costs

6. **Margin Metrics:**
   - Gross Margin (Revenue - Direct Costs)
   - EBITDA Margin (before depreciation/interest)
   - Net Margin (bottom line)

---

### **Operational Metrics:**

1. **Capacity Utilization**
   - Actual units / Total capacity
   - Track ramp-up progress

2. **Revenue Per Unit**
   - Total revenue / Units delivered
   - Efficiency metric

3. **Cost Per Unit**
   - Total expenses / Units delivered
   - Track economies of scale

4. **Labor Productivity**
   - Revenue / Labor cost
   - or: Units / FTE

5. **Time to Stabilization**
   - Months from opening to target occupancy
   - Critical for cash flow planning

---

### **Fundraising Metrics:**

1. **Fundraising Velocity**
   - $ raised per month during campaign
   - Predict when you'll hit goal

2. **Donor Concentration**
   - % from top 3 donors
   - Risk metric

3. **Cost to Raise $1**
   - Campaign expenses / $ raised
   - Efficiency metric

4. **Pledge Fulfillment Rate**
   - $ received / $ pledged
   - Realistic planning

---

### **Risk Metrics:**

1. **Volatility/Sensitivity Indicators**
   - How much NPV changes with ±10% revenue
   - Which assumptions matter most

2. **Downside Protection**
   - Worst-case NPV
   - Maximum loss scenario

3. **Probability of Success**
   - Monte Carlo simulation
   - % chance NPV > 0

4. **Time at Risk**
   - Months with negative cash flow
   - Duration of funding need

---

## 🎨 VISUALIZATION RECOMMENDATIONS

### **Color Coding Strategy:**
```
Business Units:
- OPD: Green (#10b981)
- HOUSING: Blue (#3b82f6)
- CLINIC: Teal (#0891b2)
- HOSPITAL: Purple (#8b5cf6)
- ADMIN: Orange (#f59e0b)

Status Indicators:
- On Track: Green
- At Risk: Yellow/Orange
- Critical: Red
- Complete: Dark Green with checkmark

Financial Health:
- Positive: Green
- Break-even: Gray
- Negative: Red
```

### **Interactive Features:**
- Click project to drill down
- Hover for details
- Toggle business units on/off
- Date range slider
- Scenario selector

---

## 📝 SUMMARY & RECOMMENDATIONS

### **✅ Your Excel Charts - 100% Replicable**
All 4 charts (3 bar + 1 bubble) can be perfectly recreated in React with Recharts library.

### **🎯 Priority Dashboards to Build (In Order):**

**Phase 1 (After inputs working):**
1. **Portfolio Overview** - See all 10 projects at once
2. **Fundraising Tracker** - Track campaign progress

**Phase 2 (After multi-select working):**
3. **Cash Flow Analysis** - Understand timing
4. **Business Unit Aggregation** - Strategic view

**Phase 3 (Polish):**
5. **Executive Summary** - Board presentation
6. **Project Detail Drill-Down** - Deep dives
7. **Scenario Comparison** - Risk planning

### **💡 Quick Wins (Easy to Add):**
- ROI percentage
- Capital efficiency ratio  
- Fundraising progress bars
- Capacity utilization %
- Portfolio bubble chart

### **🚀 Advanced (If Needed Later):**
- Scenario modeling
- Monte Carlo simulation
- Sensitivity tornado charts
- Monthly cash flow (vs annual)

---

## 🎬 NEXT STEPS

1. **✅ You battle test the input form** (current task)
2. **Fix any issues** you find
3. **Scale to 10 projects** with multi-select
4. **Then choose 2-3 dashboards** to build from above
5. **Iterate based on what's most useful**

I recommend starting with **Portfolio Overview** and **Fundraising Tracker** since those give maximum value for stakeholder presentations.

---

**Want me to mock up any specific dashboard once inputs are finalized? I can create the visualization code for whichever ones you prioritize!**
