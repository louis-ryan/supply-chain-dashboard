# M2Flow — Supply Chain Analytics Dashboard

A full-featured supply chain analytics dashboard built with React 18, TypeScript, Tailwind CSS, Recharts, and TanStack Table. Covers facilities, suppliers, products, and shipments with rich data visualisations, filtering, CSV export, dark/light mode, and a mobile-first responsive layout.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### Install and run

```bash
# From the repo root
cd app
npm install
npm run dev
```

The app will start at `http://localhost:5173`.

### Run tests

```bash
cd app
npm test          # watch mode
npm test -- --run # single run (CI)
```

### Build for production

```bash
cd app
npm run build
```

Output goes to `app/dist/`. The included `vercel.json` at the repo root handles deployment to Vercel automatically.

---

## Pages

| Page | Key Features |
|------|-------------|
| **Dashboard** | 4 KPI cards, shipment volume line chart, facilities by region bar chart, supplier tier donut chart, recent shipments table |
| **Facilities** | Sortable/paginated table (50+ rows), region + type + status filters, bar + donut charts |
| **Suppliers** | Risk rating column, tier badges, YoY trend arrows, compliance line chart, tier + risk + country filters |
| **Products** | Category breakdown bar chart, stock level line chart, category + status + supplier filters |
| **Shipments** | Status chips, volume line chart, on-time % trend, date range filter, swipeable status chips on mobile |

All pages include CSV export and full ARIA labelling.

---

## Mobile-First Approach

See [MOBILE_FIRST.md](../MOBILE_FIRST.md) for the full write-up covering navigation, tables, filter chips, charts, KPI cards, and the key challenges solved.

---

## AI Workflow

See [AI_WORKFLOW.md](../AI_WORKFLOW.md) for the full write-up covering approach, key AI-assisted decisions, and what would be improved with more time.

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Tables | TanStack Table v8 |
| State / filters | Zustand |
| Testing | Vitest |
| Data | In-memory mock data (2020–2026) |

---

## Project Structure

```
app/src/
├── data/        # Mock data generators (facilities, suppliers, products, shipments)
├── components/  # Shared UI: KPICard, ChartCard, FilterChip, Layout, ThemeToggle
├── pages/       # Dashboard, Facilities, Suppliers, Products, Shipments
├── store/       # Zustand store (global filters, theme state)
├── types/       # TypeScript interfaces for all entities
├── utils/       # exportCsv, formatters
└── test/        # Vitest filter logic tests (33 tests)
```
