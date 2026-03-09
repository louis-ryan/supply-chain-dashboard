# Supply Chain Analytics Dashboard

A responsive supply chain analytics dashboard built with React 18, TypeScript, Tailwind CSS, Recharts and TanStack Table. Designed and built as part of the Make2Flow UI/UX Developer assessment.

---

## Setup

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To build for production:

```bash
npm run build
```

**Node requirement:** Node 20.19+ or 22.12+ (Vite 7 requirement). The app builds and runs on Node 21 with a non-fatal engine warning.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Charts | Recharts |
| Tables | TanStack Table v8 |
| State / Filters | Zustand |
| Routing | React Router v7 |
| Data | In-memory mock generators (`src/data/`) |

---

## Pages

| Page | Features |
|---|---|
| **Dashboard** | 4 KPI cards, shipment volume line chart, facilities by region bar chart, supplier tier donut, recent shipments table |
| **Facilities** | 50 facilities, sortable/paginated table, region + type + status filters, bar chart + donut chart |
| **Suppliers** | 20 suppliers, compliance + on-time YoY indicators, tier/risk/country filters, compliance line chart |
| **Products** | 120 products, category bar chart, stock trend line chart, category + status + supplier filters |
| **Shipments** | 264 shipments 2020–2026, status chip filters, volume line chart, on-time KPI, date range filter |

---

## Mobile-First Approach

The mobile strategy was locked at the design stage — desktop and mobile layouts were produced in Pencil side by side before any React code was written. The goal was to answer a specific question first: *who is using this on a phone, and what do they actually need?* A logistics manager checking on delayed shipments from a warehouse floor has different needs from an analyst building a weekly report at a desk. Mobile design was treated as a constraint that forces prioritisation, not an afterthought that requires downsizing.

**Navigation: bottom tab bar, not hamburger**

A hamburger menu was ruled out early. On a dashboard with five sections, a hamburger requires two taps to navigate — one to open the menu, one to select. A bottom tab bar gives one-tap access to every section and keeps the current location visible at all times. The tabs use short labels and icons so they're legible at small sizes without truncation. On desktop the sidebar expands to show full labels; the navigation component is the same, just conditionally styled.

**Tables → cards: curated fields, not compressed columns**

Horizontal scroll tables on mobile are a failure mode — users miss columns, column widths fight for space, and the interaction model (scroll right to see more data) is invisible. The decision was to replace tables with cards that surface only the 3–4 most decision-relevant fields per entity. A Shipment card shows route, carrier, departure date and status — enough to identify the shipment and understand its state. Value and expected arrival are omitted because they're not the first question a field user asks. The full table is one breakpoint away on desktop. Cards initially showed only the first 10 results with no affordance for more; this was corrected to include a "Show all N" toggle that expands the full filtered set.

**Content hierarchy on Shipments**

The hardest mobile layout was Shipments. The first exploration put the volume chart above the status filter chips and card list, which buried the actionable content under a chart a field user checking on delayed shipments wouldn't need. The chart was moved alongside the on-time KPI so both context metrics are visible together at the top, with the status chips and list immediately below. The hierarchy now matches the user's likely question order: *how are we tracking overall → what's the current breakdown → find the specific shipment*.

**Filters: inline, wrapping**

Filters sit inline above the table on both breakpoints, wrapping to new rows on mobile rather than opening a separate drawer. A drawer would be the right call if filters were complex (10+ options, range sliders, nested conditions) but for 2–3 dropdowns and a search input the overhead of a separate interaction layer isn't justified. The Shipments date range pickers stretch to fill the row on mobile so they're easy to tap without being cramped.

**Known limitations**

The mobile card layout is a second rendering of the same data — any column additions to the desktop table need a parallel update to the card template. This is manageable at the current entity count but would be worth abstracting into a shared card component if the number of entity types grew.

---

## AI Workflow

All design work was done in Pencil (`.pen` files) before any React code was written. Claude Code generated the full 10-frame design (5 pages × desktop + mobile) in a single session, then produced three structured review documents — UI quality, UX/user perspective, and requirements conformance — which identified specific fixes. Rather than starting a new design file, targeted `batch_design` operations were applied directly to `design.pen` to fix the flat line chart placeholders, inconsistent bar colours, and missing chart baseline.

For implementation, Claude Code scaffolded the Vite project, generated all mock data (264 shipments, 50 facilities, 20 suppliers, 120 products spanning 2020–2026 with realistic seasonal variation), defined all TypeScript interfaces, and built all five pages in sequence. The `process.md` journal captures every significant decision made during the session in plain language.

The most useful AI pattern throughout was treating the design review as a structured artefact that could be referenced directly by the build agent — rather than trying to carry design intent through conversation, the review files acted as a persistent specification.

---

## Project Structure

```
app/src/
├── data/           # Mock data generators (facilities, suppliers, products, shipments)
├── components/     # Shared: Layout, KPICard, ChartCard, StatusBadge, FilterChip, EmptyState
├── pages/          # Dashboard, Facilities, Suppliers, Products, Shipments
├── store/          # Zustand store (all filter state)
├── types/          # TypeScript interfaces for all entities
```

Design artefacts live in the project root:
- `design.pen` — Pencil design file (10 frames)
- `design_1_review_UI.md` — UI quality review
- `design_1_review_USER.md` — UX / user perspective review
- `design_1_review_REQUIREMENTS.md` — Requirements conformance check
- `process.md` — AI workflow process journal
