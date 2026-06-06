# WingRep Notes

A simplified Notion-style block editor built for the WingRep take-home assessment.

## Quick start

```bash
npm install
cp .env.example .env.local   # add your OpenAI API key
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Stack

- **Vite + React + TypeScript** — fast client-side SPA
- **BlockNote** — block editor (paragraph, heading, bullets, DnD, formatting)
- **Zustand + localStorage** — persistence across refresh
- **Tailwind CSS** — layout and chrome
- **OpenAI gpt-4o-mini** — selection transform engine (via Vercel serverless in production)

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
- ⌘K quick search, page ⋯ menu, trash restore toast

**AI transforms**
- Highlight text → **Transform** on the formatting toolbar
- Presets: Checklist, Project plan, Meeting notes, Email draft, Clarify
- Custom transforms (up to 20) — name + description, test preview, edit/delete
- Partial selections expand to whole block(s) before transforming
- All transforms apply immediately (⌘Z to undo); custom transforms can be tested in the editor before saving
- Hover a transform in the menu for a one-line summary

## AI setup

1. Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`.
2. `npm run dev` — Vite dev middleware serves `POST /api/transform`.
3. For production on Vercel, set `OPENAI_API_KEY` in project environment variables.

## Decisions & tradeoffs

See `docs/decision-graph/` for the live decision graph, changelog, and milestone checkpoints.

**Intentionally skipped:** full Notion database filters, backend page sync, real-time collaboration.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (includes `/api/transform` middleware) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
