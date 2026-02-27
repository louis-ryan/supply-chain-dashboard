import { describe, it, expect } from 'vitest'
import { facilities } from '../data/facilities'
import { suppliers } from '../data/suppliers'
import { products } from '../data/products'
import { shipments } from '../data/shipments'
import type { Region, FacilityType, FacilityStatus, SupplierTier, RiskLevel, ProductCategory, StockStatus, ShipmentStatus } from '../types'

// ---------------------------------------------------------------------------
// Helpers — mirror the useMemo filter logic from each page
// ---------------------------------------------------------------------------

function filterFacilities(
  data: typeof facilities,
  region: Region | 'All',
  type: FacilityType | 'All',
  status: FacilityStatus | 'All',
  search: string,
) {
  return data.filter(f =>
    (region === 'All' || f.region === region) &&
    (type === 'All' || f.type === type) &&
    (status === 'All' || f.status === status) &&
    (search === '' || f.name.toLowerCase().includes(search.toLowerCase()) || f.country.toLowerCase().includes(search.toLowerCase())),
  )
}

function filterSuppliers(
  data: typeof suppliers,
  tier: SupplierTier | 'All',
  risk: RiskLevel | 'All',
  country: string,
  search: string,
) {
  return data.filter(s =>
    (tier === 'All' || s.tier === tier) &&
    (risk === 'All' || s.riskLevel === risk) &&
    (country === '' || s.country.toLowerCase().includes(country.toLowerCase())) &&
    (search === '' || s.name.toLowerCase().includes(search.toLowerCase())),
  )
}

function filterProducts(
  data: typeof products,
  category: ProductCategory | 'All',
  status: StockStatus | 'All',
  supplier: string,
  search: string,
) {
  return data.filter(p =>
    (category === 'All' || p.category === category) &&
    (status === 'All' || p.status === status) &&
    (supplier === '' || p.supplierName.toLowerCase().includes(supplier.toLowerCase())) &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())),
  )
}

function filterShipments(
  data: typeof shipments,
  status: ShipmentStatus | 'All',
  dateFrom: string,
  dateTo: string,
  search: string,
) {
  return data.filter(s =>
    (status === 'All' || s.status === status) &&
    s.departureDate >= dateFrom &&
    s.departureDate <= dateTo &&
    (search === '' || s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.origin.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase())),
  )
}

// ---------------------------------------------------------------------------
// Facilities
// ---------------------------------------------------------------------------

describe('Facilities filter', () => {
  it('returns all facilities when no filters are applied', () => {
    expect(filterFacilities(facilities, 'All', 'All', 'All', '')).toHaveLength(facilities.length)
  })

  it('filters by region', () => {
    const result = filterFacilities(facilities, 'APAC', 'All', 'All', '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(f => f.region === 'APAC')).toBe(true)
  })

  it('filters by type', () => {
    const result = filterFacilities(facilities, 'All', 'Warehouse', 'All', '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(f => f.type === 'Warehouse')).toBe(true)
  })

  it('filters by status', () => {
    const result = filterFacilities(facilities, 'All', 'All', 'Active', '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(f => f.status === 'Active')).toBe(true)
  })

  it('filters by name search (case-insensitive)', () => {
    const result = filterFacilities(facilities, 'All', 'All', 'All', 'shanghai')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(f => f.name.toLowerCase().includes('shanghai') || f.country.toLowerCase().includes('shanghai'))).toBe(true)
  })

  it('filters by country search', () => {
    const result = filterFacilities(facilities, 'All', 'All', 'All', 'germany')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(f => f.country.toLowerCase().includes('germany') || f.name.toLowerCase().includes('germany'))).toBe(true)
  })

  it('combines region and status filters', () => {
    const result = filterFacilities(facilities, 'EMEA', 'All', 'Active', '')
    expect(result.every(f => f.region === 'EMEA' && f.status === 'Active')).toBe(true)
  })

  it('returns empty array when no facilities match', () => {
    const result = filterFacilities(facilities, 'All', 'All', 'All', 'zzznomatch')
    expect(result).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Suppliers
// ---------------------------------------------------------------------------

describe('Suppliers filter', () => {
  it('returns all suppliers when no filters are applied', () => {
    expect(filterSuppliers(suppliers, 'All', 'All', '', '')).toHaveLength(suppliers.length)
  })

  it('filters by tier', () => {
    const result = filterSuppliers(suppliers, 'Tier 1', 'All', '', '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(s => s.tier === 'Tier 1')).toBe(true)
  })

  it('filters by risk level', () => {
    const result = filterSuppliers(suppliers, 'All', 'High', '', '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(s => s.riskLevel === 'High')).toBe(true)
  })

  it('filters by country (case-insensitive partial match)', () => {
    const result = filterSuppliers(suppliers, 'All', 'All', 'ger', '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(s => s.country.toLowerCase().includes('ger'))).toBe(true)
  })

  it('filters by name search', () => {
    const result = filterSuppliers(suppliers, 'All', 'All', '', 'atlas')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(s => s.name.toLowerCase().includes('atlas'))).toBe(true)
  })

  it('combines tier and risk filters', () => {
    const result = filterSuppliers(suppliers, 'Tier 2', 'Medium', '', '')
    expect(result.every(s => s.tier === 'Tier 2' && s.riskLevel === 'Medium')).toBe(true)
  })

  it('returns empty array when no suppliers match', () => {
    const result = filterSuppliers(suppliers, 'All', 'All', 'zzznomatch', '')
    expect(result).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

describe('Products filter', () => {
  it('returns all products when no filters are applied', () => {
    expect(filterProducts(products, 'All', 'All', '', '')).toHaveLength(products.length)
  })

  it('filters by category', () => {
    const result = filterProducts(products, 'Electronics', 'All', '', '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(p => p.category === 'Electronics')).toBe(true)
  })

  it('filters by stock status', () => {
    const result = filterProducts(products, 'All', 'Low Stock', '', '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(p => p.status === 'Low Stock')).toBe(true)
  })

  it('filters by supplier name (partial, case-insensitive)', () => {
    const firstSupplier = products[0].supplierName
    const partial = firstSupplier.slice(0, 4).toLowerCase()
    const result = filterProducts(products, 'All', 'All', partial, '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(p => p.supplierName.toLowerCase().includes(partial))).toBe(true)
  })

  it('filters by name search', () => {
    const result = filterProducts(products, 'All', 'All', '', 'sensor')
    expect(result.every(p =>
      p.name.toLowerCase().includes('sensor') || p.sku.toLowerCase().includes('sensor'),
    )).toBe(true)
  })

  it('filters by SKU search', () => {
    const firstSku = products[0].sku
    const result = filterProducts(products, 'All', 'All', '', firstSku)
    expect(result.length).toBeGreaterThan(0)
    expect(result.some(p => p.sku === firstSku)).toBe(true)
  })

  it('combines category and status filters', () => {
    const result = filterProducts(products, 'Pharma', 'In Stock', '', '')
    expect(result.every(p => p.category === 'Pharma' && p.status === 'In Stock')).toBe(true)
  })

  it('returns empty array when no products match', () => {
    const result = filterProducts(products, 'All', 'All', 'zzznomatch', '')
    expect(result).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Shipments
// ---------------------------------------------------------------------------

describe('Shipments filter', () => {
  const allDates = { from: '2000-01-01', to: '2099-12-31' }

  it('returns all shipments when no filters are applied', () => {
    const result = filterShipments(shipments, 'All', allDates.from, allDates.to, '')
    expect(result).toHaveLength(shipments.length)
  })

  it('filters by status', () => {
    const result = filterShipments(shipments, 'Delivered', allDates.from, allDates.to, '')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(s => s.status === 'Delivered')).toBe(true)
  })

  it('filters by date range — from', () => {
    const result = filterShipments(shipments, 'All', '2024-01-01', allDates.to, '')
    expect(result.every(s => s.departureDate >= '2024-01-01')).toBe(true)
  })

  it('filters by date range — to', () => {
    const result = filterShipments(shipments, 'All', allDates.from, '2022-12-31', '')
    expect(result.every(s => s.departureDate <= '2022-12-31')).toBe(true)
  })

  it('filters by a bounded date range', () => {
    const result = filterShipments(shipments, 'All', '2023-01-01', '2023-12-31', '')
    expect(result.every(s => s.departureDate >= '2023-01-01' && s.departureDate <= '2023-12-31')).toBe(true)
  })

  it('filters by ID search', () => {
    const firstId = shipments[0].id
    const result = filterShipments(shipments, 'All', allDates.from, allDates.to, firstId)
    expect(result.some(s => s.id === firstId)).toBe(true)
  })

  it('filters by origin search (case-insensitive)', () => {
    const result = filterShipments(shipments, 'All', allDates.from, allDates.to, 'shanghai')
    expect(result.every(s =>
      s.id.toLowerCase().includes('shanghai') ||
      s.origin.toLowerCase().includes('shanghai') ||
      s.destination.toLowerCase().includes('shanghai'),
    )).toBe(true)
  })

  it('combines status and date range', () => {
    const result = filterShipments(shipments, 'Delayed', '2022-01-01', '2024-12-31', '')
    expect(result.every(s => s.status === 'Delayed' && s.departureDate >= '2022-01-01' && s.departureDate <= '2024-12-31')).toBe(true)
  })

  it('returns empty array when date range excludes all data', () => {
    const result = filterShipments(shipments, 'All', '2030-01-01', '2030-12-31', '')
    expect(result).toHaveLength(0)
  })

  it('returns empty array when search matches nothing', () => {
    const result = filterShipments(shipments, 'All', allDates.from, allDates.to, 'zzznomatch')
    expect(result).toHaveLength(0)
  })
})
