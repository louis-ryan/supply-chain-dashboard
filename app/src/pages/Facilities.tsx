import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { useStore } from '../store'
import { facilities, facilitiesByRegion, facilitiesByType } from '../data/facilities'
import { exportCsv } from '../utils/exportCsv'
import type { Facility, Region, FacilityType, FacilityStatus } from '../types'

const DONUT_COLORS = ['#3B6FFF', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6']

const col = createColumnHelper<Facility>()

const columns = [
  col.accessor('id', {
    header: 'ID',
    cell: i => <span className="font-mono text-muted text-xs">{i.getValue()}</span>,
  }),
  col.accessor('name', { header: 'Facility Name' }),
  col.accessor('region', { header: 'Region' }),
  col.accessor('type', { header: 'Type' }),
  col.accessor('country', { header: 'Country' }),
  col.accessor('status', {
    header: 'Status',
    cell: i => <StatusBadge value={i.getValue()} />,
  }),
  col.accessor('utilisation', {
    header: 'Utilisation',
    cell: i => {
      const v = i.getValue()
      const colour = v >= 85 ? 'bg-red-500' : v >= 70 ? 'bg-amber-500' : 'bg-green-500'
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full ${colour} rounded-full`} style={{ width: `${v}%` }} />
          </div>
          <span className="text-xs text-muted">{v}%</span>
        </div>
      )
    },
  }),
  col.accessor('employees', { header: 'Employees' }),
]

export function Facilities() {
  const { facilityRegion, facilityType, facilityStatus, setFacilityRegion, setFacilityType, setFacilityStatus } = useStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    facilities.filter(f =>
      (facilityRegion === 'All' || f.region === facilityRegion) &&
      (facilityType === 'All' || f.type === facilityType) &&
      (facilityStatus === 'All' || f.status === facilityStatus) &&
      (search === '' || f.name.toLowerCase().includes(search.toLowerCase()) || f.country.toLowerCase().includes(search.toLowerCase()))
    ),
  [facilityRegion, facilityType, facilityStatus, search])

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const regions: (Region | 'All')[] = ['All', 'APAC', 'EMEA', 'AMER', 'MENA', 'LATAM']
  const types: (FacilityType | 'All')[] = ['All', 'Warehouse', 'Distribution Hub', 'Port Terminal', 'Manufacturing', 'Cold Storage']
  const statuses: (FacilityStatus | 'All')[] = ['All', 'Active', 'Maintenance', 'Inactive']

  return (
    <div className="min-h-full">
      <PageHeader
        title="Facilities"
        subtitle="Manage and monitor all distribution facilities"
        actions={
          <button
            onClick={() => exportCsv(filtered.map(f => ({
              ID: f.id, Name: f.name, Region: f.region, Type: f.type,
              Country: f.country, Status: f.status, Utilisation: `${f.utilisation}%`, Employees: f.employees,
            })), 'facilities')}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Export
          </button>
        }
      />

      <div className="px-6 space-y-6 pb-8">
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Facilities by Region" subtitle="All time">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={facilitiesByRegion} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="region" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} width={24} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Bar dataKey="count" fill="#3B6FFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Facility Types" subtitle="Distribution">
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={facilitiesByType} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="count">
                    {facilitiesByType.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 flex-1">
                {facilitiesByType.map((t, i) => (
                  <div key={t.type} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: DONUT_COLORS[i] }} />
                    <span className="text-muted truncate">{t.type}</span>
                    <span className="text-primary font-medium ml-auto">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3">
          <input
            type="text"
            placeholder="Search facilities..."
            aria-label="Search facilities by name or country"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-primary placeholder-muted outline-none focus:border-blue-500/50 w-full md:w-48"
          />
          <select aria-label="Filter by region" value={facilityRegion} onChange={e => setFacilityRegion(e.target.value as Region | 'All')}
            className="bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-primary outline-none focus:border-blue-500/50 w-full md:w-auto">
            {regions.map(r => <option key={r} value={r}>Region: {r}</option>)}
          </select>
          <select aria-label="Filter by type" value={facilityType} onChange={e => setFacilityType(e.target.value as FacilityType | 'All')}
            className="bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-primary outline-none focus:border-blue-500/50 w-full md:w-auto">
            {types.map(t => <option key={t} value={t}>Type: {t}</option>)}
          </select>
          <select aria-label="Filter by status" value={facilityStatus} onChange={e => setFacilityStatus(e.target.value as FacilityStatus | 'All')}
            className="bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-primary outline-none focus:border-blue-500/50 w-full md:w-auto">
            {statuses.map(s => <option key={s} value={s}>Status: {s}</option>)}
          </select>
          <span role="status" aria-live="polite" className="text-xs text-muted md:ml-auto">{filtered.length} facilities</span>
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Facilities">
              <thead>
                <tr className="border-b border-border">
                  {table.getFlatHeaders().map(header => (
                    <th
                      key={header.id}
                      scope="col"
                      aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : header.column.getCanSort() ? 'none' : undefined}
                      className="text-left px-4 py-3 text-muted font-medium text-xs cursor-pointer select-none hover:text-primary"
                      onClick={header.column.getToggleSortingHandler()}
                    >
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
                  <tr><td colSpan={columns.length}><EmptyState /></td></tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="border-b border-border hover:bg-white/[0.02]">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-3 text-primary">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted">
            <span role="status" aria-live="polite">
              Showing {table.getState().pagination.pageIndex * 10 + 1}–{Math.min((table.getState().pagination.pageIndex + 1) * 10, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page" className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30">←</button>
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <button key={i} onClick={() => table.setPageIndex(i)}
                  className={`px-2 py-1 rounded ${table.getState().pagination.pageIndex === i ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 hover:bg-white/10'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30">→</button>
            </div>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.slice(0, 10).map(f => (
            <div key={f.id} className="border border-border rounded-xl p-4 bg-bg-surface">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-primary">{f.name}</p>
                  <p className="text-xs text-muted">{f.id} · {f.country}</p>
                </div>
                <StatusBadge value={f.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span>{f.type}</span><span>·</span><span>{f.region}</span><span>·</span><span>{f.utilisation}% util.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
