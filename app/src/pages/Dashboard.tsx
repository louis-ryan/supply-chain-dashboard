import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { KPICard } from '../components/KPICard'
import { ChartCard } from '../components/ChartCard'
import { StatusBadge } from '../components/StatusBadge'
import { facilities, facilitiesByRegion } from '../data/facilities'
import { suppliers, supplierTiers } from '../data/suppliers'
import { shipmentVolume, recentShipments, onTimeRate } from '../data/shipments'

const DONUT_COLORS = ['#3B6FFF', '#22C55E', '#F59E0B']

function formatValue(v: number) {
  return `$${(v / 1000).toFixed(0)}k`
}

export function Dashboard() {
  const activeSuppliers = suppliers.filter(s => s.riskLevel !== 'High').length
  // Shipments this month (most recent month in data)
  const thisMonthVol = shipmentVolume[shipmentVolume.length - 1]?.volume ?? 0
  const lastMonthVol = shipmentVolume[shipmentVolume.length - 2]?.volume ?? 0
  const volChange = lastMonthVol ? Math.round(((thisMonthVol - lastMonthVol) / lastMonthVol) * 100) : 0

  // Last 24 months for the line chart
  const recentVolume = shipmentVolume.slice(-24)

  return (
    <div className="min-h-full">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            <p className="text-sm text-slate-400 mt-0.5">Supply chain overview — Feb 2026</p>
          </div>
          <span className="hidden md:inline-flex text-xs text-slate-500 border border-[#2E3347] rounded-lg px-3 py-1.5">
            Jan 2026 — Feb 2026
          </span>
        </div>
        <span className="md:hidden inline-flex mt-2 text-xs text-slate-500 border border-[#2E3347] rounded-lg px-3 py-1.5">
          Jan 2026 — Feb 2026
        </span>
      </div>

      <div className="px-6 space-y-6 pb-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Total Facilities"
            value={facilities.length}
            change={4}
            changeLabel="+4% vs last year"
          />
          <KPICard
            label="Active Suppliers"
            value={activeSuppliers}
            change={-2}
            changeLabel="-2% vs last year"
          />
          <KPICard
            label="Shipments This Month"
            value={thisMonthVol.toLocaleString()}
            change={volChange}
            changeLabel={`${volChange >= 0 ? '+' : ''}${volChange}% vs last month`}
          />
          <KPICard
            label="On-Time Rate"
            value={`${onTimeRate}%`}
            change={1.8}
            changeLabel="+1.8% vs last year"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Shipment volume line chart — spans 2 cols */}
          <ChartCard title="Shipment Volume" subtitle="2024–2026" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={recentVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E3347" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={(v: string) => v.split(' ')[0]}
                  tick={{ fill: '#8B91A8', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis tick={{ fill: '#8B91A8', fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{ background: '#1A1D27', border: '1px solid #2E3347', borderRadius: 8, color: '#F0F2F8' }}
                  itemStyle={{ color: '#3B6FFF' }}
                />
                <Line type="monotone" dataKey="volume" stroke="#3B6FFF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Facilities by region horizontal bar */}
          <ChartCard title="Facilities by Region" subtitle="2026">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={facilitiesByRegion} layout="vertical" barSize={10}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="region"
                  type="category"
                  tick={{ fill: '#8B91A8', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={42}
                />
                <Tooltip
                  contentStyle={{ background: '#1A1D27', border: '1px solid #2E3347', borderRadius: 8, color: '#F0F2F8' }}
                />
                <Bar dataKey="count" fill="#3B6FFF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Supplier tier donut */}
          <ChartCard title="Supplier Tier Breakdown" className="flex flex-col">
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={supplierTiers}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {supplierTiers.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2">
                {supplierTiers.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: DONUT_COLORS[i] }} />
                    <span className="text-slate-400">{t.name}</span>
                    <span className="text-white font-medium ml-auto pl-4">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* Recent shipments table — spans 2 cols */}
          <div style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }} className="lg:col-span-2 border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2E3347]">
              <h3 className="text-sm font-semibold text-white">Recent Shipments</h3>
              <span className="text-xs text-blue-400 cursor-pointer hover:underline">View all →</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#2E3347]">
                    {['ID', 'Route', 'Carrier', 'Departure', 'Value', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-slate-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentShipments.map(s => (
                    <tr key={s.id} className="border-b border-[#1E2130] hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-mono text-slate-400">{s.id}</td>
                      <td className="px-4 py-3 text-white max-w-[140px] truncate">{s.origin} → {s.destination}</td>
                      <td className="px-4 py-3 text-slate-400">{s.carrier}</td>
                      <td className="px-4 py-3 text-slate-400">{s.departureDate}</td>
                      <td className="px-4 py-3 text-white">{formatValue(s.value)}</td>
                      <td className="px-4 py-3"><StatusBadge value={s.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
