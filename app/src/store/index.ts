import { create } from 'zustand'
import type { Region, FacilityType, FacilityStatus, SupplierTier, RiskLevel, ProductCategory, StockStatus, ShipmentStatus } from '../types'

interface FilterState {
  // Facilities
  facilityRegion: Region | 'All'
  facilityType: FacilityType | 'All'
  facilityStatus: FacilityStatus | 'All'

  // Suppliers
  supplierTier: SupplierTier | 'All'
  supplierRisk: RiskLevel | 'All'
  supplierCountry: string

  // Products
  productCategory: ProductCategory | 'All'
  productStatus: StockStatus | 'All'
  productSupplier: string

  // Shipments
  shipmentStatus: ShipmentStatus | 'All'
  shipmentDateFrom: string
  shipmentDateTo: string

  // Actions
  setFacilityRegion: (v: Region | 'All') => void
  setFacilityType: (v: FacilityType | 'All') => void
  setFacilityStatus: (v: FacilityStatus | 'All') => void
  setSupplierTier: (v: SupplierTier | 'All') => void
  setSupplierRisk: (v: RiskLevel | 'All') => void
  setSupplierCountry: (v: string) => void
  setProductCategory: (v: ProductCategory | 'All') => void
  setProductStatus: (v: StockStatus | 'All') => void
  setProductSupplier: (v: string) => void
  setShipmentStatus: (v: ShipmentStatus | 'All') => void
  setShipmentDateFrom: (v: string) => void
  setShipmentDateTo: (v: string) => void
  resetFilters: () => void
}

const defaults = {
  facilityRegion: 'All' as const,
  facilityType: 'All' as const,
  facilityStatus: 'All' as const,
  supplierTier: 'All' as const,
  supplierRisk: 'All' as const,
  supplierCountry: '',
  productCategory: 'All' as const,
  productStatus: 'All' as const,
  productSupplier: '',
  shipmentStatus: 'All' as const,
  shipmentDateFrom: '2020-01-01',
  shipmentDateTo: '2026-12-31',
}

export const useStore = create<FilterState>(set => ({
  ...defaults,
  setFacilityRegion: v => set({ facilityRegion: v }),
  setFacilityType: v => set({ facilityType: v }),
  setFacilityStatus: v => set({ facilityStatus: v }),
  setSupplierTier: v => set({ supplierTier: v }),
  setSupplierRisk: v => set({ supplierRisk: v }),
  setSupplierCountry: v => set({ supplierCountry: v }),
  setProductCategory: v => set({ productCategory: v }),
  setProductStatus: v => set({ productStatus: v }),
  setProductSupplier: v => set({ productSupplier: v }),
  setShipmentStatus: v => set({ shipmentStatus: v }),
  setShipmentDateFrom: v => set({ shipmentDateFrom: v }),
  setShipmentDateTo: v => set({ shipmentDateTo: v }),
  resetFilters: () => set(defaults),
}))
