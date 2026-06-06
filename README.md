# WingRep Notes

A simplified Notion-style block editor built for the WingRep take-home assessment.

**Live demo:** [wingrepassignment.vercel.app](https://wingrepassignment.vercel.app)

Data is stored per-browser in localStorage — reviewers get a fresh workspace on first visit.

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

### Architecture

| Choice | Why | What we skipped |
|--------|-----|-----------------|
| **Vite + React + TS** (not Next.js) | Fastest path to a client-only SPA; no hydration edge cases with localStorage | Server-rendered pages, built-in API routes |
| **BlockNote** (not custom editor) | Highest schedule risk removed — blocks, slash menu, DnD, and formatting work out of the box | Full control over editor internals |
| **Zustand + localStorage** | Minimal persistence layer; one source of truth, survives refresh | Backend sync, multi-device data |
| **Tailwind** | Fast layout and polish without a design-system build-out | Component library (shadcn, etc.) |

BlockNote's built-in drag handles cover DnD — no custom `@dnd-kit` layer. Flat block list for v1; BlockNote handles list indent natively.

### Product & UX

Core spec shipped first, then polish:

- **Soft-delete trash** with 30-day auto-purge — safer than hard delete, no backend needed
- **Library view** — table with search, sort, and column toggles over page metadata; not a full Notion database or filter builder (~80% value at ~20% cost)
- **URL routing** (`/p/:pageId`, `/library`, `/trash`) — shareable links and browser back/forward; added after v1 when polish time allowed
- **Collapsible sidebar**, ⌘K quick search, page ⋯ menu, trash restore toast
- **Inline canvas title** with empty placeholder (Notion-style) instead of sidebar-only editing
- **Hydration gate** — Zustand persist can race on reload; app waits for `onFinishHydration` before rendering to avoid white-screen flicker

### AI transforms

LLM as a **transform engine**, not a chat sidebar — aligned with WingRep's "AI does real work" angle:

- Highlight text → **Transform** on the formatting toolbar → structured markdown blocks replace the selection
- Five hardcoded presets + up to 20 **custom transforms** (name + description, stored in localStorage)
- Partial selections expand to whole block(s) via BlockNote's `getSelection()`
- `gpt-4o-mini` behind a Vercel serverless route (`/api/transform`) so the API key stays off the client; Vite dev middleware mirrors the same route locally
- Custom transforms can be tested in the editor modal before saving; all transforms apply immediately (⌘Z to undo)

### Intentionally skipped

Full Notion database filters, nested outline blocks, backend page sync, real-time collaboration, and a chat-based AI UI.

### Full decision history

For objectives, requirements, risks, UX decisions, and how they connect: see [`docs/decision-graph/`](docs/decision-graph/).

- **`graph.json`** — live graph, updated throughout development
- **`CHANGELOG.md`** — one-line log of what changed and when
- **`checkpoints/`** — milestone snapshots (v0 planning → v1 architecture → polish → AI)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (includes `/api/transform` middleware) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
