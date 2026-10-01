# Recap — 2026-10-01 — Full dev environment setup complete

## Decisions made
- Repo structure finalized and committed (see 2026-09-30 recap for the
  bootstrap itself).
- Python 3.12 confirmed working (3.12.15 specifically), venv created at
  `~/Code/MasterPlanner/.venv`, package installs in editable mode with
  `openpyxl` confirmed importable.
- Claude Code: confirmed installed (v2.1.286), authenticated against Pro
  subscription, not API billing.
- LM Studio: Qwen3-Coder-30B-A3B-Instruct, MLX, 8-bit, context length
  raised from the 8192 default to 32768. Learned LM Studio's reload
  workflow — adjust the slider in the model's Load tab, click "Reload to
  Apply New Settings" (no need for manual Eject + re-Load).
- Cline fully configured with Plan/Act split:
  - **Plan Mode** → Claude Sonnet 5.5, reasoning effort High. Escalation
    path: bump to Xhigh for a hard-but-well-defined problem (same model);
    switch to Opus if Sonnet's actual output looks structurally wrong even
    at Xhigh (that signals a capability-ceiling issue, not a
    thinking-time issue).
  - **Act Mode** → LM Studio local, auto-detects running server and model,
    context window auto-syncs to whatever LM Studio has loaded (no manual
    matching needed on Cline's side).
- Anthropic API key created in a dedicated "MacStudio128GB" workspace
  (kept separate from an existing "Hermes" workspace) — **expires
  2026-12-31**, will need regenerating before then.
- Learned/confirmed: prompt caching lowers cost when the context prefix
  stays unchanged between calls; changing settings mid-session or long
  gaps between actions (past the ~5 min cache TTL) cause repeated
  expensive cache writes instead of cheap reads. Practical takeaway: work
  in reasonably tight bursts.

## Open questions
- Still none blocking — environment is fully operational end to end.
- Revisit later: whether to scope future API keys/workspaces per-project
  or per-venture (Blue Ocean Advisors) as more tools get added.

## Data model / schema changes
- None — still pre-code, environment setup only.

## Action items / next steps
- Begin actual Class 1 (New Money Project Sizing) implementation.
- First real design problem: the circular dependency between par amount,
  capitalized interest, DSRF, and underwriter discount — candidate for
  Plan Mode at Xhigh given it's well-defined but requires careful
  multi-step algebra.
- Set a personal reminder ahead of 2026-12-31 to regenerate the Anthropic
  API key before it expires.
