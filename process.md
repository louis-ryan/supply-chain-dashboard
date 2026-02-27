
# Process Journal
## Supply Chain Analytics Dashboard — Make2Flow Assessment

This journal is written automatically by a Claude Code agent after each work session.
It captures decisions, progress, and reasoning in plain language for the AI Workflow
documentation section of the submission.

---

## 2026-02-27

**17:04** — Started the challenge. Read through the brief and discussed the approach with Claude Code before writing anything. Decided on Vite + React 18 + TypeScript + Tailwind + Recharts + TanStack Table + Zustand. Wrote a CLAUDE.md to lock in the requirements and build plan so the context persists across sessions.

**17:20** — Set up a process journal agent using Claude Code hooks. The agent fires on the `Stop` event after each response and writes a short human-readable entry here. This file will feed directly into the AI Workflow section of the README.

**17:35** — Spent a while getting the journalling agent right. The first attempt used a bash script that logged raw tool events — file edits, commands run, timestamps — but it read more like a server log than a developer journal. Scrapped it and switched to a `type: "agent"` hook on the Stop event instead, which gives Claude enough context to write something that actually sounds human. Also discovered that the hookify plugin is already installed and handles Stop hooks, which explains some of the hook matching behaviour we were seeing in the debug logs. Still debugging why the agent hook isn't auto-firing yet — most likely the session needs a restart to pick up the new `.claude/settings.json`.

**17:38** — Manual entry written to confirm file is writable. If the journalling hook is working, it should add an entry automatically after this response ends.

**17:52** — Designed the remaining 4 pages in Pencil (Facilities, Suppliers, Products, Shipments), each with desktop and mobile layouts. `design.pen` now has 10 frames covering all 5 sections. All pages share the same dark theme, sidebar/bottom-nav shell, and structural rhythm: header → charts → filters → table. Key mobile decision: tables become cards showing only the 2–3 most important fields — no horizontal scroll, no squashing. On Shipments the on-time rate became a big KPI number rather than a second chart; on Suppliers the YoY trend arrows and colour-coded compliance % do most of the visual work. Phase 2 (React implementation) starts next.

**18:06** — Went through all 10 design frames and wrote up the UI issues in `design_1_review_UI.md`. Main problems: chart placeholders are too flat and read as broken, the Facilities bar chart has no baseline, the Products bar chart uses unexplained colour variation, and the Shipments filter label is redundant. The status badge system and mobile card layouts came out well and don't need changes.

**18:14** — Added a UX review in `design_1_review_USER.md`, assessed from the perspective of a logistics manager using the tool day-to-day. The Shipments page hierarchy and the Suppliers compliance column work well. Bigger gaps: no cross-entity risk view on the Dashboard, the Facilities page doesn't make problem facilities scannable, and the Products table has no way to filter by supplier risk level. Also flagged that mobile Shipments puts the chart above the list, which is the wrong priority for a field user.

**18:22** — Did a full requirements conformance check against `CLAUDE.md` and wrote it up in `design_1_review_REQUIREMENTS.md`. All 5 pages are present with desktop and mobile layouts, and all 6 required UI element types are represented. Main gaps before implementation: table headers need sort and download affordances, the flat line chart placeholders don't clearly communicate intent, and there are no empty states designed for zero-result filter scenarios.

**18:30** — Started a `design_2.pen` to apply the review changes in a clean file, but the output wasn't matching the quality of the original — the charts and layout felt rougher and less considered. Scrapped it, took screenshots of all the key frames in `design.pen` instead, and decided to update the original file directly with targeted fixes.

**18:54** — Applied the review fixes directly to `design.pen`. Replaced all three flat line chart placeholders, fixed the Products bar colours, removed the Shipments filter label, and added a baseline to the Facilities bar chart. Design signed off.

**19:00** — Started React implementation. Scaffolded the Vite + React 18 + TypeScript project, configured Tailwind v4 via `@tailwindcss/vite`, and installed all dependencies (Recharts, TanStack Table, Zustand, React Router). Set up the full `src/` directory structure.

**19:18** — Finished the full implementation. Defined TypeScript interfaces for all five entity types, generated realistic mock data (50 facilities, 20 suppliers, 120 products, 264 shipments spanning 2020–2026 with seasonal variation). Built the layout shell with a collapsible sidebar on desktop and bottom tab bar on mobile. Implemented all five pages — Dashboard, Facilities, Suppliers, Products, Shipments — each with charts, sortable/paginated TanStack tables, Zustand-backed filters, and parallel mobile card layouts. All filter state is global and persists across navigation. Build is clean with zero TypeScript errors. Wrote the README with setup instructions, mobile strategy, and AI workflow sections. Replaced all three flat 2px line chart placeholders (Suppliers compliance, Products stock trend, Shipments volume) with actual multi-point zigzag paths with visible strokes — they now clearly read as line charts. Fixed the Products bar chart so all bars are uniform blue instead of the unexplained green/amber mix. Removed the redundant "Filter:" label from the Shipments status chips. Added bottom-alignment and a 1px baseline to the Facilities bar chart. Design is now in a clean state ready for React implementation.

**19:28** — Removed the universal CSS reset block (`* { box-sizing, margin, padding }`) from `index.css`. Tailwind's own preflight handles this already, and having both causes conflicts.

**19:33** — Stripped the year from the XAxis tick labels on the Shipment Volume chart. The month name alone is enough since the subtitle already shows the date range.

**19:41** — Stripped the year from the XAxis tick labels on the Suppliers compliance chart and the Products stock level trend chart, matching the treatment already applied to the Dashboard and Shipments charts.

**19:44** — Applied the mobile filter stacking pattern to the Suppliers and Products pages. On mobile, each filter control now takes up a full row and stretches to fill the width. On desktop the row stays inline as before. This matches the same treatment already applied to Facilities.

**19:48** — Made the Shipments status filter chips horizontally scrollable on mobile. The chip row bleeds to the screen edge with negative margin and scrolls without a visible scrollbar, keeping the chips full-size and legible rather than wrapping or truncating.

**19:52** — Increased horizontal padding on FilterChip and added `whitespace-nowrap` so labels like "In Transit" and "Cancelled" never line-wrap inside the chip.

**19:55** — Applied the mobile filter stacking pattern to the remaining Shipments filter controls (date range pickers, search input, result count). On mobile each sits on its own full-width row; the date inputs stretch to fill the row side-by-side. Desktop layout unchanged.

**20:15** — Git Init and pushed to Github.

**20:30** — Added unit tests for filter logic using Vitest. Installed Vitest, configured it with a `node` environment to avoid a CJS/ESM conflict in jsdom, and wrote 33 tests across four describe blocks covering Facilities, Suppliers, Products, and Shipments. Tests cover the default (all-results) case, each individual filter dimension, combined filters, and the empty-result edge case. All 33 pass. Test command: `npm test`.

**20:41** — Wired up the Export buttons on all four data pages. Built a `exportCsv` utility in `src/utils/exportCsv.ts` that serialises an array of objects to a properly escaped CSV string and triggers a browser download. Each page's Export button now exports the current filtered view — so if you've filtered to APAC facilities, you get only those rows in the CSV.

**20:57** — Added ARIA labels and accessibility attributes across the app. Tables now have `aria-label` and `scope="col"` on headers with `aria-sort` wired to the sort state. Sort indicator arrows are marked `aria-hidden`. Filter inputs and selects have `aria-label` values. Result counts and pagination spans have `role="status" aria-live="polite"` so screen readers announce changes. Both navs have `aria-label` landmarks. KPI cards have `role="region"`.

**21:15** — Implemented a light/dark mode toggle on desktop. Added CSS custom properties for the five key colour tokens (`--bg-base`, `--bg-surface`, `--bg-sidebar`, `--border`, `--text-primary`) with a `[data-theme="light"]` override block. The `toggleTheme` action in the Zustand store flips the `data-theme` attribute on `<html>`. A `ThemeToggle` button (☀/🌙) sits in the sidebar footer on desktop. Build is clean, all tests still pass.

**21:38** — Replaced the `!important` CSS overrides approach for light mode text with a proper design system. Registered all six colour tokens as Tailwind v4 `@theme` variables in `index.css`, mapping each CSS variable to a Tailwind colour namespace (`--color-primary`, `--color-muted`, `--color-bg-surface`, `--color-bg-sidebar`, `--color-border`). This makes `text-primary`, `text-muted`, `bg-bg-surface`, `bg-bg-sidebar`, and `border-border` real Tailwind utilities that resolve dynamically through the CSS variable layer — no overrides, no specificity fights. Updated all five pages, all shared components (KPICard, ChartCard, Layout, PageHeader), and all Recharts `stroke`/`fill` color props to use CSS variable references. The app now switches cleanly between dark and light mode with zero `!important` declarations in the stylesheet.