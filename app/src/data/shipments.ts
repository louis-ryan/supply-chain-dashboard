import type { Shipment, ShipmentStatus, MonthlyVolume } from '../types'
import { products } from './products'

const statuses: ShipmentStatus[] = ['Delivered', 'Delivered', 'Delivered', 'In Transit', 'In Transit', 'Delayed', 'Cancelled']
const carriers = ['Maersk', 'MSC', 'CMA CGM', 'DHL', 'FedEx', 'UPS', 'Evergreen', 'Hapag-Lloyd']

const cities = [
  'Shanghai, CN', 'Rotterdam, NL', 'Los Angeles, US', 'Singapore, SG',
  'Dubai, AE', 'Hamburg, DE', 'Tokyo, JP', 'Mumbai, IN',
  'Sydney, AU', 'São Paulo, BR', 'Chicago, US', 'Antwerp, BE',
  'Hong Kong, HK', 'Busan, KR', 'Felixstowe, UK',
]

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function isoDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

// Generate 264 shipments spanning 2020–2026 (roughly 3–4 per month)
export const shipments: Shipment[] = Array.from({ length: 264 }, (_, i) => {
  const startDate = new Date('2020-01-15')
  startDate.setDate(startDate.getDate() + i * 8)   // ~every 8 days
  const transitDays = 5 + (i * 7) % 25
  const expected = addDays(startDate, transitDays)
  const status = statuses[i % statuses.length]
  const isLate = status === 'Delayed'
  const actual = status === 'Delivered' ? isoDate(addDays(expected, (i % 3) - 1)) : undefined

  const originIdx = i % cities.length
  const destIdx = (i + 4) % cities.length

  const prod = products[i % products.length]

  return {
    id: `SHP-${new Date(startDate).getFullYear()}-${String(i + 1).padStart(4, '0')}`,
    origin: cities[originIdx],
    destination: cities[destIdx === originIdx ? (destIdx + 1) % cities.length : destIdx],
    carrier: carriers[i % carriers.length],
    status: isLate && new Date(startDate) > new Date('2025-01-01') ? 'In Transit' : status,
    departureDate: isoDate(startDate),
    expectedArrival: isoDate(expected),
    actualArrival: actual,
    value: 5000 + (i * 1873) % 195000,
    productId: prod.id,
    productName: prod.name,
  }
})

// Monthly volume Jan 2020 – Dec 2025
export const shipmentVolume: MonthlyVolume[] = (() => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return Array.from({ length: 72 }, (_, i) => {
    const y = 2020 + Math.floor(i / 12)
    const m = i % 12
    // Realistic seasonal pattern with year-over-year growth
    const base = 18 + Math.floor(i * 0.4)
    const seasonal = Math.round(Math.sin((m - 2) * 0.5) * 4)
    return { month: `${months[m]} ${y}`, volume: Math.max(10, base + seasonal) }
  })
})()

export const onTimeRate = (() => {
  const delivered = shipments.filter(s => s.status === 'Delivered')
  const onTime = delivered.filter(s => {
    if (!s.actualArrival) return false
    return new Date(s.actualArrival) <= new Date(s.expectedArrival)
  })
  return Math.round((onTime.length / Math.max(delivered.length, 1)) * 1000) / 10
})()

export const recentShipments = [...shipments]
  .sort((a, b) => b.departureDate.localeCompare(a.departureDate))
  .slice(0, 10)
