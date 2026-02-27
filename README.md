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

The mobile strategy was decided at the design stage before any code was written, with desktop and mobile layouts produced in Pencil side by side. The key decisions were:

**Navigation:** A bottom tab bar replaces the sidebar on mobile (`md:hidden` / `hidden md:flex`). Tab labels are kept short and icons are used at all sizes. On desktop the sidebar expands at `lg:` to show full labels; at `md:` it collapses to icon-only width.

**Tables → Cards:** Full data tables are hidden on mobile (`hidden md:block` on the table wrapper). Each page has a parallel mobile card layout that surfaces only the 2–3 most decision-relevant fields per row — for example, a Shipment card shows route, carrier, date and status but omits value and expected arrival. This avoids horizontal scroll entirely.

**Charts:** All charts use `ResponsiveContainer width="100%"` so they fill the viewport on any screen width. On mobile they stack vertically in a single column (`grid-cols-1`); on desktop they sit in 2- or 3-column grids.

**Filters:** On desktop, filters sit inline above the table. On mobile the same controls are accessible in a row that wraps naturally. Date range pickers on Shipments are placed in the page header so they don't push content on small screens.

**KPI cards:** Use a `grid-cols-2` layout on mobile (2 columns) and `lg:grid-cols-4` on desktop, matching the Pencil design.

The biggest challenge was Shipments: the volume chart was above the status cards in early mobile explorations, which buried the list under a chart a field user wouldn't need immediately. The chart was moved to the top row alongside the on-time KPI card so both are visible together, with the status chips and table below.

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
