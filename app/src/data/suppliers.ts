import type { Supplier, SupplierTier, RiskLevel, CompliancePoint } from '../types'

const tiers: SupplierTier[] = ['Tier 1', 'Tier 1', 'Tier 2', 'Tier 2', 'Tier 3']
const risks: RiskLevel[] = ['Low', 'Low', 'Medium', 'Medium', 'High']

const supplierNames = [
  'Sino Materials Co.', 'Atlas Freight Solutions', 'Pacific Rim Logistics',
  'EuroTrans GmbH', 'GlobalParts Inc.', 'Meridian Supply Co.',
  'NordicFreight AB', 'TechSource Asia', 'MedLine Pharma',
  'AgroSupply Brazil', 'ChemTrade International', 'FastShip Korea',
  'IndoMfg Solutions', 'CapeTown Logistics', 'Nile Delta Trading',
  'Americas Cargo', 'SilkRoute Logistics', 'Balkan Industrial',
  'Gulf Materials LLC', 'AusPac Freight',
]

const countries = [
  'China', 'Germany', 'Japan', 'USA', 'South Korea', 'UK',
  'Sweden', 'India', 'France', 'Brazil', 'Netherlands', 'South Korea',
  'Indonesia', 'South Africa', 'Egypt', 'Canada', 'Singapore', 'Turkey',
  'UAE', 'Australia',
]

export const suppliers: Supplier[] = supplierNames.map((name, i) => {
  const compliance = 72 + (i * 17 + 7) % 27
  const onTime = 75 + (i * 13 + 5) % 23
  return {
    id: `SUP-${String(i + 1).padStart(3, '0')}`,
    name,
    country: countries[i % countries.length],
    tier: tiers[i % tiers.length],
    riskLevel: risks[i % risks.length],
    complianceScore: compliance,
    complianceYoY: -4 + (i * 3) % 10,
    onTimeRate: onTime,
    onTimeYoY: -3 + (i * 2) % 9,
    activeContracts: 2 + (i * 3) % 8,
    since: 2010 + (i % 14),
  }
})

export const supplierTiers = [
  { name: 'Tier 1', value: suppliers.filter(s => s.tier === 'Tier 1').length },
  { name: 'Tier 2', value: suppliers.filter(s => s.tier === 'Tier 2').length },
  { name: 'Tier 3', value: suppliers.filter(s => s.tier === 'Tier 3').length },
]

// Compliance score over time — monthly from Jan 2020 to Dec 2025
export const complianceOverTime: CompliancePoint[] = (() => {
  const points: CompliancePoint[] = []
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  let score = 78
  for (let y = 2020; y <= 2025; y++) {
    for (let m = 0; m < 12; m++) {
      score = Math.min(99, Math.max(60, score + (-1.5 + Math.sin((y * 12 + m) * 0.4) * 3)))
      points.push({ month: `${months[m]} ${y}`, score: Math.round(score * 10) / 10 })
    }
  }
  return points
})()
