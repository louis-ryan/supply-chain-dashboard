# Mobile-First Approach

The dashboard was designed mobile-first from the outset, treating small screens as the default and progressively enhancing for larger viewports — not as an afterthought.

**Navigation:** On mobile, a fixed bottom tab bar provides thumb-friendly access to all five sections. On desktop (md+), this is replaced by a collapsible sidebar that expands to show labels at lg breakpoint.

**Tables:** All data tables are wrapped in `overflow-x-auto` containers with a sticky first column so rows can be swiped horizontally without losing row context. On narrow screens, tables are also preceded by filter controls stacked in a single column (`flex-col md:flex-row`) so they don't compete for horizontal space.

**Filter chips:** The Shipments status chips use a horizontal scroll container with negative-margin bleed (`-mx-6 px-6`) on mobile so chips extend edge-to-edge and can be swiped, while at `md+` they dissolve into the inline filter row using `md:contents`.

**Charts:** All Recharts components are wrapped in `ResponsiveContainer` with `width="100%"`, so they fill their parent and reflow naturally at every breakpoint. Charts stack vertically in a single column on mobile and shift to two- or three-column grids on desktop.

**KPI cards:** A two-column grid on mobile (`grid-cols-2`) expands to four columns on desktop (`md:grid-cols-4`), keeping cards readable at every size.

**Date inputs and search:** On mobile, date pickers and search fields stretch to full width. On desktop they revert to fixed widths and sit inline with other filter controls.

The biggest challenge was the filter/chip row on Shipments — the status chips needed to be swipeable on mobile without breaking the desktop layout. The solution was wrapping chips in a scroll container that uses `md:contents` to become transparent at desktop, letting its children flow inline naturally.
