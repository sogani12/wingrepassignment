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

## What's working (v1)

- Block-based editor with text, headings, bullet lists
- Bold and italic inline formatting
- Drag-and-drop block reorder (BlockNote built-in handles)
- Multiple pages with sidebar navigation
- Editable page title in the canvas
- Content persists to localStorage on change

## Decisions & tradeoffs

See `docs/decision-graph/` for the live decision graph, changelog, and milestone checkpoints.

**Intentionally skipped for v1:** nested block outlines, URL-based routing, AI features, backend sync.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
