# v0_initial — Pre-coding seed

**Date:** 2026-06-04

## What this captures

Planning state before any application code. Derived from the WingRep take-home spec and initial architecture discussion.

## Decisions locked

- **Vite** over Next.js — faster path for a client-only localStorage app
- **BlockNote** over custom editor — schedule risk mitigation
- **Zustand + localStorage** — minimal persistence layer
- **Tailwind** — fast UI iteration

## Schema extensions

Added node types not in the original schema:

- `ux_decision` — product/interaction choices (separate from `decision`)
- `question` — open unknowns for agent triage

Added edge type:

- `resolves` — decision or ux_decision → question

## Open questions (high priority)

1. `q_block_library` — validate BlockNote with a short spike
2. `q_nested_blocks` — flat blocks vs nested outlines for v1

## Next milestone (v1_architecture)

Scaffold app, define `iface_app_state`, resolve BlockNote spike, add component nodes with `file_refs`.
