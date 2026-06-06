# Decision Graph Changelog

One line per update. Milestone snapshots live in `checkpoints/`.

- **2026-06-04** — Initial live graph (v0): objectives, requirements, stack decisions (Vite, BlockNote, Zustand, Tailwind), assumptions, risks, and open questions. Schema extended with `ux_decision`, `question`, and `resolves` edge.
- **2026-06-05** — v1 scaffold shipped: Vite app, BlockNote spike validated, page store + localStorage, sidebar + canvas. Resolved q_block_library, q_nested_blocks, q_title_editing. Deferred q_page_routing. Added components, iface_app_state, ux decisions.
- **2026-06-05** — Polish pass: soft-delete trash (30-day purge), delete confirm modals, sidebar search/sort, library view (search/sort/columns), empty states, page schema v2 migration (createdAt, deletedAt).
- **2026-06-05** — Fix reload white screen: moved hydration gate to `useStoreHydration` (persist.onFinishHydration), normalization in `merge` not post-hydrate callback, memoized PageEditor, skip redundant content writes.
- **2026-06-05** — Library: Columns → Properties, title always visible, click-outside to close. New pages use empty title with placeholder (Notion-style).
- **2026-06-05** — URL routing (react-router-dom: /p/:id, /library, /trash) + collapsible sidebar (persisted). Resolved q_page_routing; superseded dec_single_route.
- **2026-06-05** — Collapsed sidebar: Library + trash icon only; removed + and Pg shortcuts from icon rail.
- **2026-06-05** — Cmd+K quick search modal; page ⋯ menu (rename/trash) in sidebar + library; trash toast with restore (no delete confirm).
