# Design Review — Iteration 1 — UX / User Perspective

**Reviewer:** Claude Code
**Date:** 2026-02-27
**Perspective:** Logistics or operations manager who needs to quickly understand the health of a supply chain and act on problems.

---

## What works

**Shipments page answers the most urgent question first.** The on-time rate (87.4%) is the first thing visible in the top-right card, and the delayed row is visually distinct before you've even read the table. For a user checking in on the state of active shipments, this is the right hierarchy.

**The Suppliers compliance column does real work.** The combination of a percentage (94.2%), a colour (green), and a trend arrow (↑ +3.1%) in a single row gives a supply chain manager everything they need to assess a supplier relationship without opening a detail view. This is exactly the kind of at-a-glance health signal the brief was asking for.

**Status badges are legible across all entity types.** Facility status (Active / Maintenance), supplier risk (Low / Medium / High), product stock levels (In Stock / Low Stock / Out of Stock), and shipment status (Delivered / In Transit / Delayed) all use the same green/amber/red system. A user moving between pages doesn't need to re-learn what colours mean.

---

## What's missing or unclear

**No way to see cross-entity problems at a glance.** If a high-risk supplier feeds a low-stock product that's on a delayed shipment, there's no surface in the current design that connects those dots. The Dashboard KPIs are siloed — four independent numbers rather than a view that shows "here's where your chain is under stress right now." A risk or alert summary section on the Dashboard would address this.

**Facilities page doesn't answer "which facilities are causing problems."** Capacity percentage is shown in the table, but there's no visual that makes overloaded or underperforming facilities stand out. A user scanning the Facilities page to find problems has to read every row. A simple capacity utilisation bar or colour-coded capacity column would make problem facilities scannable.

**The Shipments date filter isn't visible enough.** The date range selector sits in the top-right header and currently shows a fixed range. For a shipments log, date filtering is a primary action — a user investigating a delayed delivery will immediately want to narrow to a window. The filter should be closer to the table, or the date chips (e.g. "Today / This week / This month") should be part of the status chip row.

**Products page has no supplier linkage visible.** The table shows which supplier provides each product, but there's no way to filter products by supplier risk level. If a Tier 3 / high-risk supplier is suddenly delayed, the operations manager needs to immediately see which products are affected. A "Supplier Risk" column or filter on the Products table would close that gap.

**No empty state or loading state designed.** For a supply chain tool where data might be filtered to zero results (e.g. "show me all delayed shipments in LATAM last month"), the empty table state is important. An empty rectangle with no message is ambiguous — it could mean "no results" or "still loading" or "something broke." This needs to be designed before implementation.

**Mobile Shipments — the volume chart is above the filters and cards.** On mobile, a user managing shipments in the field wants to see the list immediately, not scroll past a chart. The chart should move below the cards, or be collapsed by default behind a "Show chart" toggle.
