# v1_architecture — Scaffold + vertical slice

**Date:** 2026-06-05

## What changed since v0

Application code added. BlockNote spike **passed** — all core block types, formatting, and DnD work out of the box.

## Shipped

- Vite + React + TS + Tailwind scaffold
- BlockNote editor with seed content (paragraph, H2, bullets, bold/italic)
- Zustand persist → localStorage (`wingrep-notes`)
- Sidebar: page list, create, delete
- Canvas: editable title + editor
- Production build verified

## Decisions added

- `dec_flat_blocks_v1` — no custom nested outline model
- `dec_single_route` — no URL routing in v1
- `dec_blocknote_builtin_dnd` — no custom DnD library

## UX decisions added

- `ux_inline_title` — Notion-style title above editor
- `ux_sidebar_layout` — fixed left sidebar

## Questions resolved

| Question | Outcome |
|----------|---------|
| `q_block_library` | ✅ BlockNote covers spec |
| `q_nested_blocks` | ✅ Flat v1 |
| `q_title_editing` | ✅ Inline canvas title |
| `q_page_routing` | ⏸ Deferred |

## Still open

- `q_ai_scope` — ship AI or defer to v2

## Next (v2_mvp)

Manual QA checklist for all five requirements, UX polish (empty states, focus), deploy to Vercel.
