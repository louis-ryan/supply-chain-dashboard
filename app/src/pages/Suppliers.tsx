import { useState, useMemo } from 'react'
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel,
  flexRender, createColumnHelper, type SortingState,
} from '@tanstack/react-table'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { useStore } from '../store'
import { suppliers, supplierTiers, complianceOverTime } from '../data/suppliers'
import { exportCsv } from '../utils/exportCsv'
import type { Supplier, SupplierTier, RiskLevel } from '../types'

const DONUT_COLORS = ['#3B6FFF', '#22C55E', '#F59E0B']

const col = createColumnHelper<Supplier>()

const columns = [
  col.accessor('name', { header: 'Supplier' }),
  col.accessor('tier', {
    header: 'Tier',
    cell: i => <StatusBadge value={i.getValue()} />,
  }),
  col.accessor('country', { header: 'Country' }),
  col.accessor('riskLevel', {
    header: 'Risk',
    cell: i => <StatusBadge value={i.getValue()} />,
  }),
  col.accessor('complianceScore', {
    header: 'Compliance',
    cell: i => {
      const v = i.getValue()
      const row = i.row.original
      const colour = row.complianceYoY >= 0 ? 'text-green-400' : 'text-red-400'
      return (
        <div className="flex items-center gap-2">
          <span className="text-white">{v}%</span>
          <span className={`text-xs ${colour}`}>
            {row.complianceYoY >= 0 ? '↑' : '↓'} {Math.abs(row.complianceYoY)}%
          </span>
        </div>
      )
    },
  }),
  col.accessor('onTimeRate', {
    header: 'On-Time',
    cell: i => {
      const v = i.getValue()
      const row = i.row.original
      const colour = row.onTimeYoY >= 0 ? 'text-green-400' : 'text-red-400'
      return (
        <div className="flex items-center gap-2">
          <span className="text-white">{v}%</span>
          <span className={`text-xs ${colour}`}>
            {row.onTimeYoY >= 0 ? '↑' : '↓'} {Math.abs(row.onTimeYoY)}%
          </span>
        </div>
      )
    },
  }),
  col.accessor('activeContracts', { header: 'Contracts' }),
  col.accessor('since', { header: 'Since' }),
]

export function Suppliers() {
  const { supplierTier, supplierRisk, supplierCountry, setSupplierTier, setSupplierRisk, setSupplierCountry } = useStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    suppliers.filter(s =>
      (supplierTier === 'All' || s.tier === supplierTier) &&
      (supplierRisk === 'All' || s.riskLevel === supplierRisk) &&
      (supplierCountry === '' || s.country.toLowerCase().includes(supplierCountry.toLowerCase())) &&
      (search === '' || s.name.toLowerCase().includes(search.toLowerCase()))
    ),
  [supplierTier, supplierRisk, supplierCountry, search])

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

  const tiers: (SupplierTier | 'All')[] = ['All', 'Tier 1', 'Tier 2', 'Tier 3']
  const risks: (RiskLevel | 'All')[] = ['All', 'Low', 'Medium', 'High']

  // Show last 24 months of compliance
  const recentCompliance = complianceOverTime.slice(-24)

  return (
    <div className="min-h-full">
      <PageHeader
        title="Suppliers"
        subtitle="Monitor supplier performance and compliance scores"
        actions={
          <button
            onClick={() => exportCsv(filtered.map(s => ({
              ID: s.id, Name: s.name, Country: s.country, Tier: s.tier,
              Risk: s.riskLevel, Compliance: `${s.complianceScore}%`, 'On-Time': `${s.onTimeRate}%`,
              Contracts: s.activeContracts, Since: s.since,
            })), 'suppliers')}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Export
          </button>
        }
      />

      <div className="px-6 space-y-6 pb-8">
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard title="Compliance Score Over Time" subtitle="2024–2025" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={recentCompliance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E3347" vertical={false} />
                <XAxis dataKey="month" tickFormatter={(v: string) => v.split(' ')[0]} tick={{ fill: '#8B91A8', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: '#8B91A8', fontSize: 10 }} tickLine={false} axisLine={false} domain={[60, 100]} width={28} />
                <Tooltip contentStyle={{ background: '#1A1D27', border: '1px solid #2E3347', borderRadius: 8, color: '#F0F2F8' }} />
                <Line type="monotone" dataKey="score" stroke="#22C55E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Supplier Tiers">
            <div className="flex flex-col items-center gap-3">
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={supplierTiers} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                    {supplierTiers.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5 w-full">
                {supplierTiers.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full" style={{ background: DONUT_COLORS[i] }} />
                    <span className="text-slate-400">{t.name}</span>
                    <span className="text-white font-medium ml-auto">{t.value}</span>
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
            placeholder="Search suppliers..."
            aria-label="Search suppliers by name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 w-full md:w-44"
          />
          <select aria-label="Filter by tier" value={supplierTier} onChange={e => setSupplierTier(e.target.value as SupplierTier | 'All')}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500/50 w-full md:w-auto">
            {tiers.map(t => <option key={t} value={t}>Tier: {t}</option>)}
          </select>
          <select aria-label="Filter by risk level" value={supplierRisk} onChange={e => setSupplierRisk(e.target.value as RiskLevel | 'All')}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500/50 w-full md:w-auto">
            {risks.map(r => <option key={r} value={r}>Risk: {r}</option>)}
          </select>
          <input
            type="text"
            placeholder="Country..."
            aria-label="Filter by country"
            value={supplierCountry}
            onChange={e => setSupplierCountry(e.target.value)}
            className="bg-transparent border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 w-full md:w-32"
          />
          <span role="status" aria-live="polite" className="text-xs text-slate-500 md:ml-auto">{filtered.length} suppliers</span>
        </div>

        {/* Table */}
        <div style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }} className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Suppliers">
              <thead>
                <tr className="border-b border-[#2E3347]">
                  {table.getFlatHeaders().map(header => (
                    <th key={header.id}
                      scope="col"
                      aria-sort={header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : header.column.getCanSort() ? 'none' : undefined}
                      className="text-left px-4 py-3 text-slate-500 font-medium text-xs cursor-pointer hover:text-slate-300"
                      onClick={header.column.getToggleSortingHandler()}>
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && <span className="text-blue-400" aria-hidden="true">↑</span>}
                        {header.column.getIsSorted() === 'desc' && <span className="text-blue-400" aria-hidden="true">↓</span>}
                        {header.column.getCanSort() && !header.column.getIsSorted() && <span className="text-slate-600" aria-hidden="true">↕</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr><td colSpan={columns.length}><EmptyState /></td></tr>
                ) : table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-[#1E2130] hover:bg-white/[0.02]">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 text-white">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#2E3347] text-xs text-slate-400">
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
            <div key={s.id} style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }} className="border rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.country}</p>
                </div>
                <div className="flex gap-1.5">
                  <StatusBadge value={s.tier} />
                  <StatusBadge value={s.riskLevel} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-400">Compliance: <span className="text-white">{s.complianceScore}%</span></span>
                <span className={s.complianceYoY >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {s.complianceYoY >= 0 ? '↑' : '↓'} {Math.abs(s.complianceYoY)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
