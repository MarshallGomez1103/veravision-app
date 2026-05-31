# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

**veravision-app** is a collaborative HCI (Human-Computer Interaction) research project. The primary focus is on the **frontend experience** using **Carbon Design System** (IBM) as the component library — all UI decisions should be justified through HCI principles and Carbon's design rationale (accessibility, consistency, cognitive load).

This is a desktop application built with **Electron + React + TypeScript**, scaffolded via `electron-vite`.

## Commands

```bash
npm run dev          # Start in development mode (Electron + HMR)
npm run typecheck    # Run TypeScript checks for all targets
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run build        # typecheck → build (all platforms)
npm run build:win    # Build Windows installer
npm run start        # Preview built app
```

TypeScript is split across two configs:

- `tsconfig.node.json` — main process + preload (Node environment)
- `tsconfig.web.json` — renderer process (browser environment)

Run them independently with `npm run typecheck:node` / `npm run typecheck:web`.

## Architecture

The app follows Electron's standard three-process model:

```
src/
  main/       → Electron main process (Node.js, full system access)
  preload/    → Context bridge — only safe APIs exposed to renderer
  renderer/   → React UI (browser sandbox, no direct Node access)
```

**IPC boundary**: renderer communicates with main exclusively through `window.electron` (from `@electron-toolkit/preload`) and `window.api` (custom APIs defined in `src/preload/index.ts`). Any new main-process capability must be explicitly bridged here.

**Path alias**: `@renderer` resolves to `src/renderer/src/` (configured in `electron.vite.config.ts`).

## Design System: Carbon

This project uses [Carbon Design System](https://carbondesignsystem.com/) (`@carbon/react`). When adding or modifying UI:

- Prefer Carbon components over custom implementations
- Follow Carbon's 8px spacing grid and type scale
- Use Carbon tokens for color and motion — do not hardcode hex values
- Justify component choices in terms of HCI principles (task flow, affordance, feedback, accessibility)

## Git Discipline

### Pre-push: TypeScript must pass

Before every `git push`, run `npm run typecheck`. Push is blocked if type errors exist. This is enforced via a git hook — set it up with:

```bash
# .git/hooks/pre-push
#!/bin/sh
npm run typecheck || exit 1
```

### Commit messages

Use Conventional Commits format:

```
<type>(scope): short description

Body: explain WHY, not what. Reference HCI rationale or design decisions when relevant.
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`
Scope examples: `renderer`, `main`, `preload`, `carbon`, `layout`

## Code Style

Prettier config (`.prettierrc.yaml`): single quotes, no semicolons, 100-char line width, no trailing commas.

ESLint enforces `@typescript-eslint/recommended` + React hooks rules. Run `npm run lint` before committing.

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.
