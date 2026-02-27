# Design Review — Iteration 1 — UI

**Reviewer:** Claude Code
**Date:** 2026-02-27
**File:** `design.pen`
**Frames reviewed:** Dashboard, Facilities, Suppliers, Products, Shipments (desktop + mobile, 10 frames total)

---

## Issues to fix before implementation

### 1. Chart placeholders read as unfinished
All line charts (Shipment Volume, Compliance Score, Stock Level Trend) are a flat dark rectangle with a single 2px horizontal line across the middle or bottom. Without any path variation they look broken rather than designed. Add a simple multi-point zigzag shape — even a rough one — so the intention is clear when the design file is reviewed.

### 2. Facilities — bars have no baseline
The bar chart bars float in the chart area with no x-axis or ground line. The LATAM bar is so short it's almost invisible. A 1px baseline would anchor the chart and make small values legible.

### 3. Suppliers — compliance chart is essentially empty
The chart card takes up roughly a third of the page width but communicates almost nothing beyond "a line goes up." The flat single-colour area with a line at the bottom is the weakest element in the entire design. Either enrich the placeholder or reduce the card height so the table gets more space.

### 4. Products — bar chart colours are inconsistent without explanation
Four bars are blue, one (Machinery) is green, one (Pharma) is amber. The intent was to differentiate, but without a legend the colour variation looks like a mistake. Either make all bars the same blue, or add a small colour legend beneath the chart title.

### 5. Shipments — "Filter:" label before the chips is redundant
The status chips are self-evidently filters. The label consumes horizontal space and adds visual noise. Remove it.

### 6. Dashboard — horizontal vs vertical bar chart inconsistency
The "Facilities by Region" chart on the Dashboard uses horizontal bars while the same data on the Facilities page uses vertical bars. Pick one and use it consistently across both pages.

### 7. Table columns are too narrow for the content
Several text columns (Name, Origin → Destination, Product Name) appear to overflow or truncate in the design at small sizes. Worth explicitly widening these in the implementation rather than trusting auto-sizing.

---

## What's working well

- **Status badge colour system** (green/amber/red) is consistent and scannable across all pages — the most effective piece of visual communication in the design.
- **Shipments on-time rate as a large KPI number** is a strong call. More immediate than a chart for a single percentage metric.
- **Suppliers YoY trend arrows** (↑/↓ with colour) make performance direction readable without needing to parse numbers.
- **Mobile card layouts** are genuinely rethought for small screens, not squashed desktop — each card surfaces only the 2–3 fields that matter for that entity.
- **Filter chips on mobile** avoid the extra tap overhead of dropdowns, and the "Delayed"/"High Risk" chips using red styling in their inactive state signals their purpose.
- **Page rhythm is consistent** — header → charts → filters → table across all 5 sections makes navigation predictable.

---

## Priority order for fixes

1. Chart placeholders (affects all pages, highest visual impact)
2. Facilities bar chart baseline
3. Products bar chart legend
4. Shipments "Filter:" label
5. Dashboard bar chart direction consistency
