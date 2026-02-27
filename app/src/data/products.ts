import type { Product, ProductCategory, StockStatus, StockTrendPoint } from '../types'
import { suppliers } from './suppliers'

const categories: ProductCategory[] = ['Electronics', 'Apparel', 'Machinery', 'Pharma', 'Food & Bev', 'Chemicals']

const productBases = [
  ['Circuit Board Assembly', 'Sensor Module', 'Power Supply Unit', 'Display Panel', 'Control Unit'],
  ['Work Jacket', 'Safety Vest', 'Industrial Gloves', 'Steel Cap Boots', 'Hard Hat'],
  ['Hydraulic Pump', 'Conveyor Belt', 'Forklift Parts', 'Crane Hook', 'Gear Assembly'],
  ['Antibiotic Compound', 'Vaccine Vial', 'Surgical Gloves', 'IV Drip Set', 'Diagnostic Kit'],
  ['Bulk Grain', 'Edible Oil Drum', 'Sugar Pallet', 'Frozen Meat Box', 'Beverage Concentrate'],
  ['Industrial Solvent', 'Polymer Resin', 'Adhesive Agent', 'Coating Compound', 'Catalyst Powder'],
]

export const products: Product[] = categories.flatMap((cat, ci) =>
  productBases[ci].flatMap((base, bi) =>
    Array.from({ length: 4 }, (_, vi) => {
      const i = ci * 20 + bi * 4 + vi
      const stock = (i * 73 + 11) % 500
      const reorder = 50 + (i * 17) % 100
      const status: StockStatus = stock === 0 ? 'Out of Stock' : stock < reorder ? 'Low Stock' : 'In Stock'
      const sup = suppliers[i % suppliers.length]
      return {
        id: `PRD-${String(i + 1).padStart(4, '0')}`,
        sku: `SKU-${cat.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
        name: `${base} v${vi + 1}`,
        category: cat,
        supplierId: sup.id,
        supplierName: sup.name,
        stockLevel: stock,
        reorderPoint: reorder,
        status,
        unitCost: 10 + (i * 23) % 990,
        leadTimeDays: 3 + (i * 7) % 28,
      }
    })
  )
)

export const productsByCategory = categories.map(cat => ({
  category: cat,
  count: products.filter(p => p.category === cat).length,
}))

// Stock level trend — monthly average across all products, Jan 2020–Dec 2025
export const stockTrend: StockTrendPoint[] = (() => {
  const points: StockTrendPoint[] = []
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  let stock = 280
  for (let y = 2020; y <= 2025; y++) {
    for (let m = 0; m < 12; m++) {
      stock = Math.min(450, Math.max(80, stock + (-8 + Math.cos((y * 12 + m) * 0.3) * 18)))
      points.push({ month: `${months[m]} ${y}`, stock: Math.round(stock) })
    }
  }
  return points
})()
