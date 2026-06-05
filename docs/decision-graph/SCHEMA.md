# Decision Graph Schema

The graph has **nodes** and **edges**. Every node has: `id` (short snake_case, unique), `type`, `label` (concise noun phrase), `description` (1–2 sentences).

Live graph: `graph.json`  
Changelog: `CHANGELOG.md`  
Milestone snapshots: `checkpoints/`

---

## Node types

### objective

What the system is trying to achieve.

Extra fields: none

```json
{
  "id": "obj_core_requirements",
  "type": "objective",
  "label": "Core requirements work reliably",
  "description": "All spec items (blocks, pages, DnD, formatting, persistence) function without data loss."
}
```

### requirement

A hard constraint or must-have. Non-negotiable.

Extra fields: `is_functional` (bool, default true)

```json
{
  "id": "req_persistence",
  "type": "requirement",
  "label": "Survive page refresh",
  "description": "Content must persist across browser refresh.",
  "is_functional": true
}
```

### assumption

Something the plan treats as true without explicit verification.

Extra fields: `confidence` (0.0–1.0, lower = more uncertain), `validated` (bool, default false)

```json
{
  "id": "asm_blocknote_fits",
  "type": "assumption",
  "label": "BlockNote covers required block types",
  "description": "Assumes BlockNote provides paragraph, heading, bullet, DnD, and inline formatting out of the box.",
  "confidence": 0.7,
  "validated": false
}
```

### decision

An explicit **architectural or technical** choice. Stack, data model, libraries, folder structure.

Extra fields: `rationale` (string), `alternatives_considered` (list of strings)

```json
{
  "id": "dec_vite",
  "type": "decision",
  "label": "Use Vite + React + TypeScript",
  "description": "Client-side SPA scaffold for fastest path to a working editor.",
  "rationale": "Avoids Next.js hydration complexity for a localStorage-only app. Speed over prestige.",
  "alternatives_considered": ["Next.js", "Remix"]
}
```

### ux_decision

An explicit **product or interaction** choice. Separate from infrastructure — how the user experiences the app.

Extra fields: `user_problem` (string), `chosen_behavior` (string), `alternatives_considered` (list of strings), `validation_status` (`hypothesis` | `tested` | `validated` | `rejected`)

```json
{
  "id": "ux_drag_handle",
  "type": "ux_decision",
  "label": "Show drag handle on hover",
  "description": "Users reorder blocks using a visible affordance.",
  "user_problem": "Users need discoverable block reordering without accidental drags.",
  "chosen_behavior": "Drag handle appears on block hover in the left gutter.",
  "alternatives_considered": ["always visible handle", "long-press to drag", "context menu reorder"],
  "validation_status": "hypothesis"
}
```

### question

An **open unknown** that should be resolved before or during implementation. Drives agent planning.

Extra fields: `status` (`open` | `resolved` | `deferred`), `priority` (`high` | `medium` | `low`), `blocks` (optional list of component ids waiting on an answer)

```json
{
  "id": "q_nested_blocks",
  "type": "question",
  "label": "Should blocks support nesting?",
  "description": "Unclear whether nested bullets/outlines are worth the complexity in 48h.",
  "status": "open",
  "priority": "high",
  "blocks": []
}
```

### component

A concrete module, service, library, or subsystem.

Extra fields: `file_refs` (list of strings, optional), `has_tests` (bool, default false — true only when a passing test node points at it via a `verifies` edge)

```json
{
  "id": "comp_page_store",
  "type": "component",
  "label": "Page store",
  "description": "Zustand store holding pages, active page, and persistence hooks.",
  "file_refs": [],
  "has_tests": false
}
```

### interface

An API, schema, data contract, or formal boundary between components.

Extra fields: `contract` (string, optional)

```json
{
  "id": "iface_app_state",
  "type": "interface",
  "label": "Application state schema",
  "description": "Single source of truth for pages and active page id, persisted to localStorage.",
  "contract": "{ pages: Page[], activePageId: string }"
}
```

### risk

A concern, tradeoff, potential failure mode, or known limitation.

Extra fields: `severity` (0.0–1.0, higher = more severe)

```json
{
  "id": "risk_editor_complexity",
  "type": "risk",
  "label": "Custom editor blows timeline",
  "description": "Building a block editor from scratch could consume the entire 48h budget.",
  "severity": 0.9
}
```

### test

A specific testing artifact. Add only when tests are explicitly discussed.

Extra fields: `test_type` (`unit` | `integration` | `conformance` | `end-to-end` | `security`), `status` (`planned` | `written` | `passing` | `failing`)

```json
{
  "id": "tst_persistence",
  "type": "test",
  "label": "Persistence round-trip",
  "description": "Manual or automated check that page content survives refresh.",
  "test_type": "integration",
  "status": "planned"
}
```

---

## Edge types

| type | meaning | typical source → target |
|------|---------|-------------------------|
| motivated_by | exists because of an objective | Decision, UX decision, Component → Objective |
| assumes | relies on an assumption being true | Decision, Component → Assumption |
| implements | fulfils a requirement | Component, UX decision → Requirement |
| depends_on | needs another component or interface | Component → Component or Interface |
| conflicts_with | threatens a decision or requirement | Risk → Decision, UX decision, or Requirement |
| invalidates | if risk materialises, breaks an assumption | Risk → Assumption |
| exposes | provides an interface | Component → Interface |
| consumes | uses an interface | Component → Interface |
| verifies | test checks a component or interface | Test → Component or Interface |
| guards_against | test prevents a risk from reaching production | Test → Risk |
| validates | test confirms a decision was correctly implemented | Test → Decision |
| **resolves** | **answers an open question** | **Decision, UX decision → Question** |

---

## Type responsibility split

| Type | Use for |
|------|---------|
| `decision` | Stack, libraries, data model, persistence strategy, folder structure |
| `ux_decision` | Interaction patterns, empty states, navigation feel, discoverability |
| `question` | Unresolved unknowns — triage before implementing blocked work |
