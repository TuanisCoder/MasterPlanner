# Recap — 2026-09-30 — Repo bootstrap

## Decisions made
- `MasterPlanner` created as its own dedicated, private GitHub repo —
  separate from the general-purpose `planning-engine-lab` sandbox (which
  stays for unrelated work: email pipeline, PKM/Obsidian, etc.).
- Treated as a clean start; nothing carried over from the old lab repo.
- Repo structure: `master_planning/`, `bond_sizing/`, `ratio_analytics/`,
  `shared/`, `recaps/` — explicitly adaptable, not locked in.
- Tooling split decided:
  - Claude Code, logged in via Pro subscription (not API key) — for
    structurally tricky / correctness-sensitive work.
  - Cline in VS Code, switchable between a local model (Ollama/LM Studio,
    Qwen3-Coder) and Claude via API key.
  - Local models run on new Mac Studio M5 Max, 128GB RAM.
- Cloned locally to `~/Code/MasterPlanner` on the internal drive (884GB
  free — no need for external storage).

## Open questions
- Exact Python version to standardize on — system Python on this machine is
  3.10.12; `pyproject.toml` currently targets `>=3.10` to match what's
  already installed, revisit if a newer version gets installed deliberately.
- Whether/when to pull `planning-engine-lab` into a proper multi-repo
  structure of its own, vs. leaving it as an informal sandbox indefinitely.
- SEER integration path (licensing vs. dependency import) — not yet decided,
  noted as a future consideration in PROJECT_CONTEXT.md.

## Data model / schema changes
- None yet — package skeleton only, no sizing logic implemented.

## Action items / next steps
- Set up Python venv and install in editable mode (`pip install -e ".[dev]"`).
- Verify Claude Code login is on Pro, not API billing (`/status`).
- Get Ollama or LM Studio running with a Qwen3-Coder model pulled.
- Configure Cline with two profiles (local model, Claude via API key).
- Begin Class 1 (New Money Project Sizing) implementation — the circular
  dependency between par, CAPI, DSRF, and UW discount is the first real
  design challenge.

## Addendum — Python version
- Decided on Python 3.12 (not 3.10, not 3.13/3.14) — mature enough that
  numeric/data libraries have stable wheels, modern enough to not be
  building forward on an outdated runtime. `pyproject.toml` updated to
  `requires-python = ">=3.12"`; README setup instructions updated to
  install via `brew install python@3.12` and build the venv from that
  interpreter explicitly rather than system Python (which is 3.10.12).
