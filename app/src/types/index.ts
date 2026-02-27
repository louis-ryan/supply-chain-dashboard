// Facility
export type FacilityStatus = 'Active' | 'Maintenance' | 'Inactive'
export type FacilityType = 'Warehouse' | 'Distribution Hub' | 'Port Terminal' | 'Manufacturing' | 'Cold Storage'
export type Region = 'APAC' | 'EMEA' | 'AMER' | 'MENA' | 'LATAM'

export interface Facility {
  id: string
  name: string
  type: FacilityType
  region: Region
  country: string
  status: FacilityStatus
  capacity: number       // total capacity units
  utilisation: number    // 0–100 %
  employees: number
  established: number    // year
}

// Supplier
export type SupplierTier = 'Tier 1' | 'Tier 2' | 'Tier 3'
export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface Supplier {
  id: string
  name: string
  country: string
  tier: SupplierTier
  riskLevel: RiskLevel
  complianceScore: number   // 0–100
  complianceYoY: number     // delta %, positive = improving
  onTimeRate: number        // 0–100 %
  onTimeYoY: number
  activeContracts: number
  since: number             // year joined
}

// Product
export type ProductCategory = 'Electronics' | 'Apparel' | 'Machinery' | 'Pharma' | 'Food & Bev' | 'Chemicals'
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock'

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  supplierId: string
  supplierName: string
  stockLevel: number      // units on hand
  reorderPoint: number
  status: StockStatus
  unitCost: number        // USD
  leadTimeDays: number
}

// Shipment
export type ShipmentStatus = 'In Transit' | 'Delivered' | 'Delayed' | 'Cancelled'

export interface Shipment {
  id: string
  origin: string
  destination: string
  carrier: string
  status: ShipmentStatus
  departureDate: string   // ISO date
  expectedArrival: string
  actualArrival?: string
  value: number           // USD
  productId: string
  productName: string
}

// Chart data shapes
export interface MonthlyVolume {
  month: string   // 'Jan 2024'
  volume: number
}

export interface CompliancePoint {
  month: string
  score: number
}

export interface StockTrendPoint {
  month: string
  stock: number
}
