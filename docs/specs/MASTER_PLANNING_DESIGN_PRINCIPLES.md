# Master Planning — Core Design Principle: Scarce-Information-First

**Status:** Foundational — applies to every input category in `master_planning`,
not just one module. Captured 2026-10-03.

---

## The rule

> When information is scarce, the interface should still be fast and fully
> functional. As information gets validated, depth gets added — but the
> *structure* for that depth exists from day one. Simple mode is never a
> dead end that has to be rebuilt into detailed mode later; it's a shortcut
> through a structure that was always there.

Concretely, for every input category (capital costs, revenue, operating
expenses, funding sources, and whatever else `master_planning` ends up
covering):

- **Don't force a full buildup before a number can flow through the model.**
  If the capital cost breakdown isn't known yet, let the user enter a single
  total dollar amount and move on.
- **Offer a simple proxy when the detailed driver isn't available.**
  If operating expenses can't be built up line-by-line yet, let the user
  express them as a % of revenue, a hardcoded flat number, or some other
  fast shortcut — whatever gets a usable number into the model now.
- **The detailed structure underneath is never thrown away or deferred in
  design** — it's built once, up front, as part of the data model. What's
  deferred is *data entry*, not *architecture*. A user filling in the simple
  version today should be able to come back later and fill in the detailed
  version without anything getting restructured or re-keyed.

## Why this matters

Master planning scenarios get built under real time pressure, often with
incomplete information — early-stage feasibility conversations, a client who
hasn't finished their own cost estimates yet, a board meeting next week. A
tool that *requires* full granularity before it produces a usable scenario
fails exactly when it's needed most. A tool that degrades gracefully —
usable immediately, improvable incrementally — fits how this work actually
happens.

## Implementation pattern: simple-mode override, not two separate models

The pattern is: **every input category has an optional override field that,
when set, short-circuits the detailed buildup** for that category. The
detailed fields underneath still exist in the data model (so nothing is lost
structurally), they're just not *required* — and the override, when present,
is what the model actually calculates from.

```
category_input = {
    "mode": "simple" | "detailed",      # which one is driving the calc
    "simple_value": float | None,        # single $ or % — used if mode == "simple"
    "detailed": {                        # full structure — always present,
        "line_item_1": ...,              # populated or not, regardless of mode
        "line_item_2": ...,
        # ...
    }
}
```

When `mode == "simple"`, only `simple_value` is required for the category to
be valid and flow into downstream calculations. When `mode == "detailed"`,
the individual `detailed` fields become required instead, and the model
sums/derives from those. Switching modes later doesn't require re-entering
anything already captured — the detailed fields that were filled in stay
filled in, they just weren't being read from while in simple mode.

### Working precedent for this pattern

This is not a new pattern — it already exists, working, in the Kijabe UI
prototype (see `../../reference/kijabe-ui-precedent/`). Its **"Use Expense
Override"** checkbox does exactly this: checked → a single dollar override
is the only required field; unchecked → Labor + Supplies + Admin individually
become required, and the model sums them. `master_planning` should
generalize that single-field pattern across every input category (capital,
revenue, expenses, funding), not just expenses.

## Open design questions this raises (not yet resolved)

- Does "mode" live per-category, or is there a single global
  simple-vs-detailed toggle for the whole scenario? (Leaning per-category —
  a user might have a firm capital number but a vague revenue estimate in
  the same scenario.)
- What's the UI signal that a category is running in simple mode — so a
  reviewer glancing at a scenario immediately knows which numbers are
  placeholders versus validated detail? (Kijabe's required-field red-border
  pattern is a starting point, but "this number is a placeholder" is a
  different signal than "this required field is empty.")
- Should there be a third tier beyond simple/detailed — e.g., a
  industry-benchmark default that's better than a hardcoded guess but still
  short of real detailed input? Worth considering once real scenarios
  surface the need.
