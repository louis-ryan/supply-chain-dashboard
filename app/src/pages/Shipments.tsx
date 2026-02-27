import { useState, useMemo } from 'react'
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel,
  flexRender, createColumnHelper, type SortingState,
} from '@tanstack/react-table'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { KPICard } from '../components/KPICard'
import { StatusBadge } from '../components/StatusBadge'
import { FilterChip } from '../components/FilterChip'
import { EmptyState } from '../components/EmptyState'
import { useStore } from '../store'
import { shipments, shipmentVolume, onTimeRate } from '../data/shipments'
import { exportCsv } from '../utils/exportCsv'
import type { Shipment, ShipmentStatus } from '../types'

const col = createColumnHelper<Shipment>()

const columns = [
  col.accessor('id', {
    header: 'ID',
    cell: i => <span className="font-mono text-muted text-xs">{i.getValue()}</span>,
  }),
  col.accessor('origin', { header: 'Origin' }),
  col.accessor('destination', { header: 'Destination' }),
  col.accessor('carrier', { header: 'Carrier' }),
  col.accessor('status', {
    header: 'Status',
    cell: i => <StatusBadge value={i.getValue()} />,
  }),
  col.accessor('departureDate', { header: 'Departure' }),
  col.accessor('expectedArrival', { header: 'Expected' }),
  col.accessor('value', {
    header: 'Value',
    cell: i => <span>${(i.getValue() / 1000).toFixed(0)}k</span>,
  }),
]

const STATUS_OPTIONS: (ShipmentStatus | 'All')[] = ['All', 'In Transit', 'Delivered', 'Delayed', 'Cancelled']

export function Shipments() {
  const { shipmentStatus, shipmentDateFrom, shipmentDateTo, setShipmentStatus, setShipmentDateFrom, setShipmentDateTo } = useStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    shipments.filter(s =>
      (shipmentStatus === 'All' || s.status === shipmentStatus) &&
      s.departureDate >= shipmentDateFrom &&
      s.departureDate <= shipmentDateTo &&
      (search === '' || s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.origin.toLowerCase().includes(search.toLowerCase()) ||
        s.destination.toLowerCase().includes(search.toLowerCase()))
    ),
  [shipmentStatus, shipmentDateFrom, shipmentDateTo, search])

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const recentVolume = shipmentVolume.slice(-24)

  return (
    <div className="min-h-full">
      <PageHeader
        title="Shipments"
        subtitle="Track shipment status, volumes and on-time performance"
        actions={
          <button
            onClick={() => exportCsv(filtered.map(s => ({
              ID: s.id, Origin: s.origin, Destination: s.destination, Carrier: s.carrier,
              Status: s.status, Departure: s.departureDate, 'Expected Arrival': s.expectedArrival,
              Value: s.value,
            })), 'shipments')}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Export
          </button>
        }
      />

      <div className="px-6 space-y-6 pb-8">
        {/* Charts + KPI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard title="Shipment Volume by Month" subtitle="2024–2026" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={recentVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickFormatter={(v: string) => v.split(' ')[0]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="volume" stroke="#3B6FFF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <KPICard label="On-Time Rate" value={`${onTimeRate}%`} change={1.8} changeLabel="↑ +1.8% vs last month" />
        </div>

        {/* Status filter chips + date range + search */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-2">
          <div className="flex md:contents overflow-x-auto scrollbar-none gap-2 -mx-6 px-6 md:mx-0 md:px-0">
            {STATUS_OPTIONS.map(s => (
              <FilterChip key={s} label={s} active={shipmentStatus === s} onClick={() => setShipmentStatus(s)} danger={s === 'Delayed' || s === 'Cancelled'} />
            ))}
          </div>
          <div className="flex items-center gap-1 w-full md:w-auto md:ml-auto">
            <input type="date" aria-label="Departure date from" value={shipmentDateFrom} onChange={e => setShipmentDateFrom(e.target.value)}
              className="bg-transparent border border-border rounded-lg px-2 py-1.5 text-xs text-primary outline-none flex-1 md:flex-none" />
            <span className="text-muted text-xs" aria-hidden="true">—</span>
            <input type="date" aria-label="Departure date to" value={shipmentDateTo} onChange={e => setShipmentDateTo(e.target.value)}
              className="bg-transparent border border-border rounded-lg px-2 py-1.5 text-xs text-primary outline-none flex-1 md:flex-none" />
          </div>
          <input type="text" placeholder="Search shipments..." aria-label="Search shipments by ID, origin or destination" value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border border-border rounded-lg px-3 py-1.5 text-sm text-primary placeholder-muted outline-none focus:border-blue-500/50 w-full md:w-44" />
          <span role="status" aria-live="polite" className="text-xs text-muted md:ml-0">{filtered.length} results</span>
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Shipments">
              <thead>
                <tr className="border-b border-border">
                  {table.getFlatHeaders().map(header => (
                    <th key={header.id} scope="col"
                      aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : header.column.getCanSort() ? 'none' : undefined}
                      className="text-left px-4 py-3 text-muted font-medium text-xs cursor-pointer hover:text-primary"
                      onClick={header.column.getToggleSortingHandler()}>
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && <span className="text-blue-400" aria-hidden="true">↑</span>}
                        {header.column.getIsSorted() === 'desc' && <span className="text-blue-400" aria-hidden="true">↓</span>}
                        {header.column.getCanSort() && !header.column.getIsSorted() && <span className="text-muted" aria-hidden="true">↕</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr><td colSpan={columns.length}><EmptyState message="No shipments match your filters." /></td></tr>
                ) : table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-border hover:bg-white/[0.02]">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 text-primary">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted">
            <span role="status" aria-live="polite">Showing {Math.min(table.getState().pagination.pageIndex * 10 + 1, filtered.length)}–{Math.min((table.getState().pagination.pageIndex + 1) * 10, filtered.length)} of {filtered.length}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page" className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30">←</button>
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page" className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30">→</button>
            </div>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.slice(0, 10).map(s => (
            <div key={s.id} className="border border-border rounded-xl p-4 bg-bg-surface">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-mono text-muted">{s.id}</p>
                  <p className="text-sm font-medium text-primary mt-0.5">{s.origin} → {s.destination}</p>
                </div>
                <StatusBadge value={s.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span>{s.carrier}</span><span>·</span><span>{s.departureDate}</span><span>·</span><span>${(s.value / 1000).toFixed(0)}k</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
