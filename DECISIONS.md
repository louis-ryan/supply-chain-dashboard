# Architecture Decision Records

Short records of the significant decisions made during this project. Written to document *why*, not just *what*.

---

## ADR-001 — Static mock data over a mock API

**Decision:** All data lives in-memory as TypeScript arrays in `src/data/`, generated at module load time. No mock server (MSW, JSON Server, etc.).

**Reasoning:** The assessment brief specifies mock/static JSON data. A mock API would add latency simulation, network error states, and service worker setup — all of which are valuable in a production prototype but would consume time without adding to what's being evaluated here (visual design, filtering, mobile UX). The trade-off is that loading and error states are not exercised at runtime, which is called out explicitly in `design-system.pen` as a gap.

**Consequence:** If the project were extended, swapping `src/data/*.ts` exports for `useSWR` or `react-query` calls would be straightforward since the data shape and TypeScript types are already defined.

---

## ADR-002 — Zustand for filter state over React Context or URL params

**Decision:** All filter state (selected status, date range, search text, etc.) lives in a single Zustand store.

**Reasoning:** Filters needed to persist across page navigation — if a user sets the Shipments date range and navigates to Dashboard and back, the filter should still be active. React Context would work but requires a provider wrapper and causes more re-renders. URL params would be the most shareable solution but add encoding/decoding complexity and weren't a stated requirement. Zustand gives persistence-across-navigation with minimal boilerplate and no provider tree.

**Consequence:** Filters survive navigation but reset on full page reload. This is the right default for a dashboard (users expect state to persist within a session). If shareable filter URLs were needed, Zustand's `subscribe` API could sync state to `URLSearchParams` without changing the component interface.

---

## ADR-003 — Tables become cards on mobile, not horizontally scrollable

**Decision:** Data tables are hidden on mobile (`hidden md:block`) and replaced with a parallel card layout that surfaces 3–4 key fields per row.

**Reasoning:** Horizontal scroll tables on mobile are a known UX failure mode — users frequently miss columns, column widths fight for space, and sticky-column implementations are fragile with dynamic data. The alternative is to ask: *what does a field user actually need to see at a glance?* For shipments that's route, status, and date. For suppliers it's name, tier, risk, and compliance trend. A card layout lets each entity show exactly those fields at a comfortable tap target size, without requiring horizontal interaction. The trade-off is that not all columns are visible — but that's a feature, not a bug, since the desktop table is one tap away.

**Consequence:** The card layout is a second rendering of the same data, which means any column additions to the table need a parallel update to the card. This is manageable at this scale but would be worth abstracting if the entity count grew significantly.

---

## ADR-004 — Recharts over Victory, Nivo, or D3 direct

**Decision:** Recharts for all charting.

**Reasoning:** Recharts is the most widely used React chart library by install count and has the best Tailwind/CSS variable integration story — `stroke` and `fill` props accept `var(--token)` strings directly, which is essential for the light/dark theme switch to work without JavaScript. Victory and Nivo both have stronger animation and customisation stories but are heavier and require more configuration to work with CSS variable theming. D3 direct would give maximum control but is inappropriate for a 4–8 hour assessment — the time cost of building even a basic line chart from scratch is not justified.

**Consequence:** Recharts tooltip customisation is limited without a custom `content` prop. The current tooltips work but don't format values (e.g. showing raw numbers instead of `$42k`). This is a known gap and would be the first chart improvement in a follow-up pass.

---

## ADR-005 — Design system in a separate file from screen designs

**Decision:** `design-system.pen` is a standalone file. Screen designs live in `design.pen`.

**Reasoning:** A design system is a reference library — components, tokens, states. Screen designs are compositions that reference those components. Mixing both in one file makes the library hard to navigate and creates a temptation to define components in-context rather than abstractly. Separating them also reflects how production design systems work (a Figma component library is a separate file from the product designs that use it). The separation enforces that tokens and component specs are defined once and referenced, not duplicated per-screen.

**Consequence:** Updates to tokens in `design-system.pen` need to be manually synced to `app/src/index.css`. A `UserPromptSubmit` Claude Code hook exists to automate this — running "sync tokens" triggers an agent that reads the Pencil variables and updates the CSS `:root` block.
