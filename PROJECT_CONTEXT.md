# MasterPlanner — Working Protocol & Context

> Read this file first in any new session (Claude Code, Cline, or chat) before
> doing anything else in this repo. It's the continuity mechanism across tools
> and across time — nothing here is assumed to be remembered elsewhere.
>
> Also see `ENVIRONMENT.md` for durable setup facts (ports, model IDs,
> versions, config values) — look things up there instead of rediscovering
> them each session.

## 1. What this is

A standalone master planning / bond sizing engine for CCRC (life plan
community) development scenarios, built for Blue Ocean Advisors. See
`README.md` for the technical summary. This file is about *how we work*,
not *what the code does*.

Eventually a React client interface will sit on top of this engine, and the
engine itself may be licensed to or wrapped by SEER as a separate dependent
package — never merged directly into SEER's repo. See `/areas/blue-market.md`
and `/areas/seer.md` style framing if more business context is needed.

## 2. Origin

This repo (`MasterPlanner`) started as a clean break from an earlier,
general-purpose sandbox repo (`planning-engine-lab`). Nothing of value was
carried over — this is a fresh start, structured deliberately from day one
as a standalone product rather than an experiment.

## 3. Tooling split (as of initial setup)

- **Claude Code** — authenticated against the Pro subscription (not API
  billing). Used for structurally tricky work: the sizing math, the circular
  dependency in Class 1 sizing, anything where correctness really matters.
- **Cline (VS Code)** — switchable between a local model (Ollama/LM Studio)
  for routine/mechanical implementation, and Claude via API key for
  Claude-quality work without leaving the editor.
- **Local LLM** — Qwen3-Coder family, run via Ollama or LM Studio, on the
  Mac Studio M5 Max (128GB). Used for boilerplate and mechanical edits once
  an approach is already settled — not trusted unsupervised on the sizing
  logic itself.

Routing between these is manual — there's no harness deciding automatically.
The working split: Claude (Code or Cline) for anything with non-obvious
logic or financial correctness at stake; local model for everything else.

## 4. Repo structure — intentionally adaptable

The `master_planning/ bond_sizing/ ratio_analytics/ shared/` split reflects
the three-lens architecture (see README). This is expected to evolve as the
actual sizing logic gets built — restructure freely as better shapes become
obvious; this isn't meant to be locked in prematurely.

## 5. Recap protocol

At the end of each working session, write a recap file to `recaps/` capturing:

1. **Decisions made & open questions**
2. **Data model / schema changes** (shape of inputs/outputs, module boundaries)
3. **UI/UX decisions** (once the React client work starts)
4. **Action items / next steps**

Naming: `recaps/YYYY-MM-DD-short-topic.md`

## 6. Session log

_(Newest first.)_

- **2026-09-30** — Repo created (`MasterPlanner`, private, under TuanisCoder).
  Clean start — no carryover from `planning-engine-lab`. Package skeleton
  (`master_planning/`, `bond_sizing/`, `ratio_analytics/`, `shared/`)
  scaffolded with `pyproject.toml`, `.gitignore`, `README.md`, this file.
  Tooling decided: Claude Code on Pro subscription, Cline switchable between
  local model and Claude API, local models via Ollama/LM Studio on new Mac
  Studio M5 Max 128GB. Next: decide whether `planning-engine-lab` stays as a
  general multi-project sandbox (email pipeline, PKM/Obsidian work, etc.) —
  leaning yes, kept separate from this repo either way.

## 7. Glossary / shorthand

_(To be filled in as domain terms come up.)_
