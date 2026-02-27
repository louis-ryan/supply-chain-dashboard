import { useState, useMemo } from 'react'
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel,
  flexRender, createColumnHelper, type SortingState,
} from '@tanstack/react-table'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { ChartCard } from '../components/ChartCard'
import { StatusBadge } from '../components/StatusBadge'
import { EmptyState } from '../components/EmptyState'
import { useStore } from '../store'
import { products, productsByCategory, stockTrend } from '../data/products'
import { exportCsv } from '../utils/exportCsv'
import type { Product, ProductCategory, StockStatus } from '../types'

const col = createColumnHelper<Product>()

const columns = [
  col.accessor('sku', {
    header: 'SKU',
    cell: i => <span className="font-mono text-muted text-xs">{i.getValue()}</span>,
  }),
  col.accessor('name', { header: 'Product Name' }),
  col.accessor('category', { header: 'Category' }),
  col.accessor('supplierName', { header: 'Supplier' }),
  col.accessor('stockLevel', {
    header: 'Stock',
    cell: i => <span className="text-primary">{i.getValue().toLocaleString()}</span>,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: i => <StatusBadge value={i.getValue()} />,
  }),
  col.accessor('unitCost', {
    header: 'Unit Cost',
    cell: i => <span>${i.getValue().toFixed(2)}</span>,
  }),
  col.accessor('leadTimeDays', { header: 'Lead Time' }),
]

export function Products() {
  const { productCategory, productStatus, productSupplier, setProductCategory, setProductStatus, setProductSupplier } = useStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    products.filter(p =>
      (productCategory === 'All' || p.category === productCategory) &&
      (productStatus === 'All' || p.status === productStatus) &&
      (productSupplier === '' || p.supplierName.toLowerCase().includes(productSupplier.toLowerCase())) &&
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
    ),
  [productCategory, productStatus, productSupplier, search])

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

  const categories: (ProductCategory | 'All')[] = ['All', 'Electronics', 'Apparel', 'Machinery', 'Pharma', 'Food & Bev', 'Chemicals']
  const statuses: (StockStatus | 'All')[] = ['All', 'In Stock', 'Low Stock', 'Out of Stock']
  const recentStock = stockTrend.slice(-24)

  return (
    <div className="min-h-full">
      <PageHeader
        title="Products"
        subtitle="Manage product inventory, SKUs and stock levels"
        actions={
          <button
            onClick={() => exportCsv(filtered.map(p => ({
              SKU: p.sku, Name: p.name, Category: p.category, Supplier: p.supplierName,
              Stock: p.stockLevel, Status: p.status, 'Unit Cost': p.unitCost, 'Lead Time (days)': p.leadTimeDays,
            })), 'products')}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Export
          </button>
        }
      />

      <div className="px-6 space-y-6 pb-8">
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Products by Category">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={productsByCategory} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} width={24} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Bar dataKey="count" fill="#3B6FFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Stock Level Trend" subtitle="2024–2025">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={recentStock}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickFormatter={(v: string) => v.split(' ')[0]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="stock" stroke="#3B6FFF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3">
          <input type="text" placeholder="Search products..." aria-label="Search products by name or SKU" value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-primary placeholder-muted outline-none focus:border-blue-500/50 w-full md:w-44" />
          <select aria-label="Filter by category" value={productCategory} onChange={e => setProductCategory(e.target.value as ProductCategory | 'All')}
            className="bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-primary outline-none focus:border-blue-500/50 w-full md:w-auto">
            {categories.map(c => <option key={c} value={c}>Category: {c}</option>)}
          </select>
          <select aria-label="Filter by stock status" value={productStatus} onChange={e => setProductStatus(e.target.value as StockStatus | 'All')}
            className="bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-primary outline-none focus:border-blue-500/50 w-full md:w-auto">
            {statuses.map(s => <option key={s} value={s}>Status: {s}</option>)}
          </select>
          <input type="text" placeholder="Supplier..." aria-label="Filter by supplier name" value={productSupplier} onChange={e => setProductSupplier(e.target.value)}
            className="bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-primary placeholder-muted outline-none focus:border-blue-500/50 w-full md:w-36" />
          <span role="status" aria-live="polite" className="text-xs text-muted md:ml-auto">{filtered.length} products</span>
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Products">
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
                  <tr><td colSpan={columns.length}><EmptyState /></td></tr>
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
          {filtered.slice(0, 10).map(p => (
            <div key={p.id} className="border border-border rounded-xl p-4 bg-bg-surface">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-primary">{p.name}</p>
                  <p className="text-xs text-muted">{p.sku} · {p.supplierName}</p>
                </div>
                <StatusBadge value={p.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span>{p.category}</span><span>·</span><span>{p.stockLevel.toLocaleString()} units</span><span>·</span><span>${p.unitCost.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
