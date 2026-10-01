# Environment Reference

> Durable setup facts, config values, and reference details for this dev
> environment. Not session history (see `recaps/`) and not working protocol
> (see `PROJECT_CONTEXT.md`) — just things worth looking up instead of
> re-discovering. Update this as the environment evolves; keep stale values
> out rather than appending forever.

## Machine
- Mac Studio, Apple M5 Max, 128GB unified memory
- macOS, device name: `mariosmacstudio`

## Repo
- GitHub: `https://github.com/TuanisCoder/MasterPlanner.git` (private)
- Local clone: `~/Code/MasterPlanner`
- Default branch: `main`

## Python
- Confirmed working: **Python 3.12.15** (installed via `brew install python@3.12`)
- System Python (do not use for this project): 3.10.12
- Venv created and verified at `~/Code/MasterPlanner/.venv`:
  ```bash
  /opt/homebrew/bin/python3.12 -m venv .venv
  source .venv/bin/activate
  pip install -e ".[dev]"
  ```
  To resume work in a new terminal session, just run:
  ```bash
  cd ~/Code/MasterPlanner
  source .venv/bin/activate
  ```
- `openpyxl` confirmed importable (v3.1.5) — package install verified working,
  not just "ran without error."
- Note: once the venv is active, a Homebrew warning about `pip3.12` being
  "shadowed" is expected and harmless — it just confirms the venv's own pip
  is correctly taking priority over the global Homebrew one.

## Claude Code
- Installed via: `npm install -g --allow-scripts=@anthropic-ai/claude-code @anthropic-ai/claude-code`
- Version at install: 2.1.286
- **Authenticated via Pro subscription**, not API key — confirm anytime with `/status` inside a Claude Code session
- Launch from repo root: `cd ~/Code/MasterPlanner && claude`

## LM Studio (local model server)
- Model loaded: **Qwen3 Coder 30B A3B Instruct**
  - Format: MLX
  - Quantization: 8-bit
  - Size on disk: 32.46 GB
  - API model identifier: `qwen3-coder-30b-a3b-instruct-mlx`
  - Context length: **32768** (bumped up from the 8192 default — plenty of
    headroom on 128GB RAM; raise further later if Cline starts truncating
    large files)
  - To change context length: model's **Load** tab in LM Studio has a
    context length slider; after adjusting, click **"Reload to Apply New
    Settings"** underneath it — no need to manually Eject + re-Load.
- Server base URL: `http://127.0.0.1:1234/v1`
- Compatible endpoint style: OpenAI-compatible (also offers Anthropic-compatible)
- **LM Studio must be running with the server started for Cline's local
  profile to work** — check the Developer tab, Status should read "Running"

## Cline (VS Code extension)
- Account: free Cline account created via GitHub sign-in (cline.bot) — this
  is Cline's own hosted free-model router, separate from the LM
  Studio/Anthropic provider config below; not used for this project.
- **LM Studio provider** (configured): API Provider = "LM Studio",
  auto-detects the running local server, model field auto-populated with
  `qwen3-coder-30b-a3b-instruct-mlx`. Context Window field auto-syncs to
  whatever context length the loaded model in LM Studio actually has — no
  need to manually match it on the Cline side.
- **Claude (API) provider** — configured for Plan Mode. Key name:
  `cline-masterplanner-macstudio` (or similar), under a dedicated
  "MacStudio128GB" Anthropic Console workspace (separate from Hermes'
  workspace). Billed against API credits, separate from the Pro
  subscription (which only covers Claude Code).
  **⚠️ Key expires 2026-12-31** — will need to be regenerated before then
  or Cline's Claude/Plan Mode will stop authenticating.
- **Plan/Act mode split** (configured):
  - **Plan Mode** → Anthropic, model **Claude Sonnet 5.5**
    (`claude-sonnet-5-5`), reasoning effort **High**. Escalate to Xhigh
    for a specific hard-but-well-defined problem (e.g. the circular
    dependency in Class 1 sizing); escalate the *model* to Opus instead
    if a Sonnet answer looks structurally wrong even at Xhigh — that's a
    capability-ceiling problem, not a thinking-time problem.
  - **Act Mode** → LM Studio, `qwen3-coder-30b-a3b-instruct-mlx`,
    context auto-synced to the loaded model (currently 32768).
- **Prompt caching note**: caching only triggers on an unchanged context
  prefix; changing settings mid-session or leaving long gaps between
  actions (past the cache TTL, usually ~5 min) causes repeated expensive
  cache writes instead of cheap reads. Work in reasonably tight bursts.

## Known gotchas
- Claude Code will silently use API billing instead of Pro if `ANTHROPIC_API_KEY`
  is set in the shell environment — checked clean at initial setup
  (`echo $ANTHROPIC_API_KEY` returned nothing)
- `npm install -g` on this machine requires `--allow-scripts` flag for
  packages with postinstall scripts (npm's newer security default)

## Exploration track — UI ideation model (planned, not yet downloaded)
- Separate from the main coding stack (Qwen3-Coder) — a dedicated model for
  rough React/UI ideation before bringing concepts to Claude for real
  implementation and polish.
- **Model: GLM-4.5-Air** (106B total params, ~12B active, MoE) — chosen
  over the better-ranked Kimi K2.5 and GLM-5 because both are too large
  for this machine even at extreme quantization (Kimi K2.5 needs ~240GB
  minimum; GLM-5 is 744B params). GLM family generally regarded as strong
  on frontend/UI aesthetic sense among open-weight models.
- **Quantization: 6-bit (~80GB)** as the practical default — leaves ~48GB
  headroom for macOS, LM Studio, VS Code, browser, and context while
  running. 8-bit (~106GB, max quality) is an option for dedicated sessions
  with other apps closed, but leaves only ~22GB headroom — tighter.
- **Workflow: single model at a time, not dual-resident.** Since Cline
  auto-detects whatever's currently loaded in LM Studio, switching modes
  is just: eject Qwen3-Coder in LM Studio's Developer tab → load
  GLM-4.5-Air instead → Cline picks it up automatically on next
  interaction, no reconfiguration needed on Cline's side.
- To do when actually setting this up: search "GLM-4.5-Air" in LM Studio's
  model search, look for an MLX build at 6-bit (or 8-bit), download, and
  test the eject/reload swap workflow described above.
