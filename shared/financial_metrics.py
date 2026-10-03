"""
shared/financial_metrics.py
============================
Reusable financial metric calculations for both the Bond Sizing Engine
and the CCRC Master Planning module.

Economic lens — answers: "Is this a good investment?"
    npv(), irr(), mirr(), payback()

Coverage lens — answers: "Can we service this debt?"
    dscr(), debt_per_unit(), breakeven_occupancy()
    (coverage functions are in bond_sizing/engine/debt_service.py)

Ported and adapted from: explorations/kijabe/project1-complete.jsx
Original implementation validated against KHCapitalPlanner.xlsx outputs.

⚠️ REGULATORY NOTICE:
These calculations are for illustrative planning purposes only.
They do not constitute investment advice, financial advice, or advice
regarding the issuance of municipal securities under SEC Exchange Act
Section 15B, SEC Rule 15Ba1-1, or MSRB Rule G-42.
"""

import numpy_financial as npf
from typing import Optional


# ---------------------------------------------------------------------------
# NET PRESENT VALUE
# ---------------------------------------------------------------------------

def net_present_value(cash_flows: list[float], rate: float) -> float:
    """
    Calculate Net Present Value of a cash flow series.

    Args:
        cash_flows: List of cash flows by period. Index 0 = period 0 (today).
                    Negative values = outflows (construction costs, capital).
                    Positive values = inflows (revenue, entrance fees).
        rate:       Discount rate as decimal (e.g., 0.08 for 8%).

    Returns:
        NPV as a float. Positive = value-creating. Negative = value-destroying.

    Example:
        # $10M outflow at year 0, then $2M/year for 8 years at 8% discount rate
        cf = [-10_000_000] + [2_000_000] * 8
        npv = net_present_value(cf, 0.08)
    """
    return float(npf.npv(rate, cash_flows))


# ---------------------------------------------------------------------------
# INTERNAL RATE OF RETURN
# ---------------------------------------------------------------------------

def internal_rate_of_return(cash_flows: list[float]) -> Optional[float]:
    """
    Calculate Internal Rate of Return using numpy-financial (Newton-Raphson).

    Args:
        cash_flows: List of cash flows by period. Must have at least one
                    sign change (negative to positive or vice versa).

    Returns:
        IRR as decimal (e.g., 0.12 for 12%), or None if no convergence.

    Note:
        IRR assumes reinvestment at the IRR rate itself — often unrealistic
        for long-horizon CCRC projects. Use MIRR for more conservative analysis.

    Example:
        cf = [-10_000_000] + [2_000_000] * 8
        irr = internal_rate_of_return(cf)
        print(f"IRR: {irr:.1%}")
    """
    try:
        result = npf.irr(cash_flows)
        if result is None or result != result:  # NaN check
            return None
        return float(result)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# MODIFIED INTERNAL RATE OF RETURN
# ---------------------------------------------------------------------------

def modified_irr(
    cash_flows: list[float],
    finance_rate: float,
    reinvest_rate: float
) -> Optional[float]:
    """
    Calculate Modified Internal Rate of Return (MIRR).

    Uses separate rates for financing costs (negative cash flows) and
    reinvestment returns (positive cash flows). More realistic than IRR
    for real estate and CCRC project analysis.

    Args:
        cash_flows:    List of cash flows by period. Index 0 = today.
        finance_rate:  Rate applied to negative cash flows (borrowing cost).
                       Typically the bond coupon or all-in cost of debt.
        reinvest_rate: Rate applied to positive cash flows (reinvestment return).
                       Typically expected investment return on operating surpluses.

    Returns:
        MIRR as decimal, or None if calculation fails.

    Example:
        cf = [-10_000_000, -2_000_000, 1_500_000, 2_000_000, 2_500_000, 3_000_000]
        mirr = modified_irr(cf, finance_rate=0.05, reinvest_rate=0.04)
        print(f"MIRR: {mirr:.1%}")

    Note on SEER / master planning use:
        finance_rate  → bond coupon / all-in cost of debt from bond sizing module
        reinvest_rate → assumed portfolio return on days-cash-on-hand balance
    """
    try:
        result = npf.mirr(cash_flows, finance_rate, reinvest_rate)
        if result is None or result != result:
            return None
        return float(result)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# PAYBACK PERIOD
# ---------------------------------------------------------------------------

def payback_period(cash_flows: list[float]) -> Optional[float]:
    """
    Calculate payback period with fractional year precision.

    Args:
        cash_flows: List of cash flows by period. Index 0 = today.
                    Initial outflows should be negative.

    Returns:
        Payback period in years (fractional), or None if never recovered.

    Example:
        cf = [-10_000_000] + [2_000_000] * 8
        pb = payback_period(cf)
        print(f"Payback: {pb:.1f} years")
    """
    cumulative = 0.0
    for i, cf in enumerate(cash_flows):
        cumulative += cf
        if cumulative >= 0:
            prev = cumulative - cf
            fractional = abs(prev) / cf if cf != 0 else 0
            return float(i - 1 + fractional)
    return None


# ---------------------------------------------------------------------------
# OPERATING MARGIN
# ---------------------------------------------------------------------------

def operating_margin(revenue: float, expenses: float) -> Optional[float]:
    """
    Calculate net operating margin.

    Args:
        revenue:  Total operating revenue (stabilized year).
        expenses: Total operating expenses (stabilized year).

    Returns:
        Net operating margin as decimal (e.g., 0.12 for 12%), or None if
        revenue is zero.

    CCRC context:
        Typically measured at Year 5 of operations (stabilized occupancy).
        Includes monthly fee revenue + healthcare revenue; excludes entrance
        fee receipts (those are capital, not operating revenue).
        Excludes depreciation for operational analysis; includes it for
        financial statement presentation.
    """
    if revenue == 0:
        return None
    return (revenue - expenses) / revenue


# ---------------------------------------------------------------------------
# PRESENT VALUE HELPERS
# ---------------------------------------------------------------------------

def pv_of_lump_sum(amount: float, rate: float, periods: int) -> float:
    """
    Present value of a single future lump sum.

    Args:
        amount:  Future value amount.
        rate:    Discount rate per period (annual if periods are years).
        periods: Number of periods until receipt.

    Returns:
        Present value as float.

    Example (bank tranche balloon):
        balloon = pv_of_lump_sum(5_000_000, rate=0.05, periods=10)
    """
    return float(npf.pv(rate, periods, 0, -amount))


def pv_of_draw_schedule(
    draws: list[tuple[int, float]],
    annual_rate: float
) -> float:
    """
    Present value of a construction draw schedule.

    Args:
        draws:       List of (period, amount) tuples. Period = months from today.
        annual_rate: Annual investment/discount rate as decimal.

    Returns:
        Sum of present values of all draws.

    Example:
        draws = [(3, 2_000_000), (6, 3_000_000), (12, 4_000_000)]
        pv = pv_of_draw_schedule(draws, annual_rate=0.04)
    """
    monthly_rate = (1 + annual_rate) ** (1/12) - 1
    return sum(
        amount / (1 + monthly_rate) ** month
        for month, amount in draws
    )


# ---------------------------------------------------------------------------
# CONVENIENCE SUMMARY
# ---------------------------------------------------------------------------

def economic_summary(
    cash_flows: list[float],
    discount_rate: float,
    finance_rate: float,
    reinvest_rate: float,
    stabilized_revenue: float = 0.0,
    stabilized_expenses: float = 0.0,
) -> dict:
    """
    Compute all economic metrics in one call. Returns a dict ready for
    display or JSON serialization.

    Args:
        cash_flows:          Full project cash flow series (year 0 onward).
        discount_rate:       For NPV calculation.
        finance_rate:        For MIRR — cost of debt (bond coupon).
        reinvest_rate:       For MIRR — reinvestment return assumption.
        stabilized_revenue:  Optional — for operating margin calc.
        stabilized_expenses: Optional — for operating margin calc.

    Returns:
        {
            "npv": float,
            "irr": float or None,
            "mirr": float or None,
            "payback_years": float or None,
            "operating_margin": float or None,
        }

    ⚠️ REGULATORY NOTICE: Results are illustrative only. Not investment advice.
    """
    return {
        "npv": net_present_value(cash_flows, discount_rate),
        "irr": internal_rate_of_return(cash_flows),
        "mirr": modified_irr(cash_flows, finance_rate, reinvest_rate),
        "payback_years": payback_period(cash_flows),
        "operating_margin": operating_margin(stabilized_revenue, stabilized_expenses)
        if stabilized_revenue else None,
    }
