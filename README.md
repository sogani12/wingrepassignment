# WingRep Notes

A simplified Notion-style block editor built for the WingRep take-home assessment.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Stack

- **Vite + React + TypeScript** — fast client-side SPA
- **BlockNote** — block editor (paragraph, heading, bullets, DnD, formatting)
- **Zustand + localStorage** — persistence across refresh
- **Tailwind CSS** — layout and chrome

## What's working

**Core (spec)**
- Block-based editor with text, headings, bullet lists
- Bold and italic inline formatting
- Drag-and-drop block reorder (BlockNote built-in handles)
- Multiple pages with sidebar navigation
- Editable page title in the canvas
- Content persists to localStorage on change

**Polish**
- Collapsible sidebar (persisted preference)
- URL routing: `/p/:pageId`, `/library`, `/trash`
- Delete confirmation → soft delete to trash
- Trash with restore, delete forever, and 30-day auto-purge on app load
- Sidebar search and sort (last edited / A–Z)
- Library view — table with search, sort, and column visibility toggles
- Empty states for no pages, no search results, and empty trash
- Focus title input when creating or restoring a page

## Decisions & tradeoffs

See `docs/decision-graph/` for the live decision graph, changelog, and milestone checkpoints.

**Intentionally skipped:** full Notion database filters, AI features, backend sync.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
