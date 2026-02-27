# Supply Chain Analytics Dashboard — Claude Instructions

## Challenge Context

**Position:** UI/UX Developer at Make2Flow
**Assessment:** AI-Assisted Development
**Duration:** 4 hours recommended, 8 hours maximum
**Tools:** Claude Code + Pencil (.pen files)

---

## Challenge Requirements

### Navigation Structure
```
├── Dashboard (overview/home)
├── Facilities
├── Suppliers
├── Products
├── Shipments
└── Settings (optional)
```

### Required UI Elements (all must be present)
| Element | Usage |
|---------|-------|
| Data Tables | Sortable, paginated, with row actions, filters, expanded rows, download, grouping, pinning |
| Bar/Column Charts | Facilities by region, suppliers by tier |
| Line Charts | Monthly shipment volume, compliance scores over time |
| Trend Charts | YoY growth, performance trends with up/down indicators |
| KPI Cards | Summary metrics with visual indicators, percentage change |
| Pie/Donut Charts | Facility types distribution, risk breakdown |

### Mock Data Requirements
- 50+ facilities
- 20+ suppliers
- 100+ products
- Data spanning 2020–2026

### Mobile-First (Critical Evaluation Point)
Must work excellently on all screen sizes. Document the mobile challenges encountered and how they were solved.

---

## Tech Stack

- **Framework:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS (required)
- **Charts:** Recharts
- **Tables:** TanStack Table (react-table v8)
- **State Management:** Zustand (filters, navigation state)
- **Data:** Mock/static JSON (in-memory generation)

---

## Architecture

```
src/
├── data/           # Mock data generators (facilities, suppliers, products, shipments)
├── components/     # Shared UI: KPICard, ChartWrapper, DataTable, Sidebar, MobileNav
├── pages/          # Dashboard, Facilities, Suppliers, Products, Shipments
├── store/          # Zustand store (global filters, UI state)
├── types/          # TypeScript interfaces for all entities
└── utils/          # Data helpers, formatters, date utils
```

---

## Page Designs

### Dashboard (Home)
- 4 KPI cards: Total Facilities, Active Suppliers, Shipments This Month, On-Time Rate
- Line chart: Shipment volume over time (2020–2026)
- Bar chart: Facilities by region
- Donut chart: Supplier tier breakdown
- Recent shipments table (last 10)

### Facilities Page
- Filterable/sortable table (50+ rows, paginated)
- Filters: region, type, status
- Bar chart: facilities by region
- Donut chart: facility type distribution

### Suppliers Page
- Table with risk rating column, tier badges
- Trend indicators: YoY performance arrows
- Filters: tier, risk level, country
- Compliance score line chart

### Products Page
- Paginated table with category, SKU, stock level
- Category breakdown bar chart
- Stock level trend line chart
- Filters: category, status, supplier

### Shipments Page
- Log table with status (In Transit, Delivered, Delayed, Cancelled)
- Status filter chips
- Volume line chart by month
- On-time % trend with direction indicator
- Date range filter

---

## Mobile-First Strategy

- **Navigation:** Bottom tab bar on mobile, collapsible sidebar on desktop
- **Tables:** Horizontal scroll with sticky first column on mobile; card-style row expansion
- **Charts:** Full-width, stack vertically on mobile
- **Filters:** Slide-up drawer/sheet on mobile, inline panel on desktop
- **KPI Cards:** 2-column grid on mobile, 4-column on desktop

---

## Workflow: Design First, Then Build

All pages are designed in Pencil (`design.pen`) before any React code is written. Once a page design is approved, use the Pencil design as the reference to implement it in React. This ensures the visual direction is locked before implementation begins.

**Design → Build cycle (per page):**
1. Design the page in Pencil (desktop + mobile layouts)
2. Review and confirm the design
3. Implement the page in React, matching the Pencil design
4. Move to the next page

---

## Build Order

### Phase 1 — Design (Pencil)
1. Design Dashboard page (desktop + mobile)
2. Design Facilities page
3. Design Suppliers page
4. Design Products page
5. Design Shipments page

### Phase 2 — React Implementation
6. Scaffold Vite project, install all dependencies
7. Define TypeScript types for all entities
8. Generate realistic mock data (2020–2026)
9. Layout shell: sidebar (desktop) + bottom nav (mobile) + routing
10. Dashboard page: KPIs + all charts (from Pencil design)
11. Facilities page: table + charts + filters (from Pencil design)
12. Suppliers page: table + trend indicators + filters (from Pencil design)
13. Products page: table + charts + filters (from Pencil design)
14. Shipments page: log table + charts + date filter (from Pencil design)
15. Global filter system (Zustand)
16. README: setup instructions + mobile strategy + AI workflow docs

---

## Deliverables Checklist

- [ ] Running React app (`npm run dev`)
- [ ] All 5 sections functional with mock data
- [ ] All 6 required UI element types present
- [ ] Mobile-first responsive design
- [ ] Pencil .pen design files
- [ ] README with:
  - [ ] Setup instructions
  - [ ] Mobile-First Approach section (200–300 words)
  - [ ] AI Workflow section (100–200 words)
- [ ] AI planning context .md files

### Bonus (if time allows)
- [ ] Unit tests for filter logic
- [ ] Dark mode toggle
- [ ] CSV export functionality
- [ ] ARIA labels / keyboard navigation

---

## Evaluation Weights
| Criteria | Weight |
|----------|--------|
| AI Tool Proficiency | 25% |
| Mobile-First UX | 25% |
| Visual Elements Quality | 20% |
| Filtering System | 15% |
| Code Quality | 10% |
| Documentation | 5% |

---

## Working Notes

- Prefer reusable components over one-off solutions
- Keep mock data generation in `src/data/` as separate files per entity
- Use Zustand for global filter state so filters persist across page navigation
- Document every significant AI-assisted decision for the AI Workflow section
- Prioritize mobile layout from the start, not as an afterthought
