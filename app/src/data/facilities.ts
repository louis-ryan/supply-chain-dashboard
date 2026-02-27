import type { Facility, FacilityType, FacilityStatus, Region } from '../types'

const regions: Region[] = ['APAC', 'EMEA', 'AMER', 'MENA', 'LATAM']
const types: FacilityType[] = ['Warehouse', 'Distribution Hub', 'Port Terminal', 'Manufacturing', 'Cold Storage']
const statuses: FacilityStatus[] = ['Active', 'Active', 'Active', 'Maintenance', 'Inactive']

const regionCountries: Record<Region, string[]> = {
  APAC: ['China', 'Japan', 'South Korea', 'Australia', 'Singapore', 'India', 'Vietnam', 'Thailand'],
  EMEA: ['Germany', 'UK', 'France', 'Netherlands', 'Poland', 'UAE', 'Turkey', 'Italy'],
  AMER: ['USA', 'Canada', 'Mexico', 'Brazil', 'Chile'],
  MENA: ['Saudi Arabia', 'UAE', 'Egypt', 'Qatar', 'Kuwait'],
  LATAM: ['Brazil', 'Argentina', 'Colombia', 'Peru', 'Chile'],
}

const facilityNames = [
  'Shanghai Logistics Hub', 'Rotterdam Port Terminal', 'Chicago Distribution Centre',
  'Dubai Logistics Park', 'Singapore Mega Hub', 'Los Angeles Port Terminal',
  'Frankfurt Distribution Hub', 'Mumbai Warehouse Complex', 'Sydney Cold Storage',
  'São Paulo Distribution Centre', 'Tokyo Manufacturing Facility', 'London Logistics Hub',
  'Shenzhen Electronics Hub', 'Hamburg Port Terminal', 'Dallas Warehouse',
  'Cairo Distribution Centre', 'Seoul Manufacturing Park', 'Amsterdam Cold Storage',
  'Mexico City Logistics Hub', 'Jakarta Distribution Centre', 'Bangkok Warehouse',
  'Istanbul Port Terminal', 'Johannesburg Hub', 'Nairobi Distribution Centre',
  'Buenos Aires Warehouse', 'Ho Chi Minh City Hub', 'Kuala Lumpur Logistics',
  'Warsaw Distribution Centre', 'Milan Warehouse Complex', 'Toronto Cold Storage',
  'Vancouver Port Terminal', 'Madrid Distribution Hub', 'Cairo Logistics Park',
  'Riyadh Warehouse', 'Doha Distribution Centre', 'Casablanca Port Terminal',
  'Lagos Logistics Hub', 'Accra Warehouse', 'Karachi Distribution Centre',
  'Chennai Manufacturing Facility', 'Taipei Electronics Warehouse', 'Osaka Cold Storage',
  'Guangzhou Distribution Hub', 'Chengdu Logistics Centre', 'Xi\'an Warehouse',
  'Lyon Cold Storage', 'Marseille Port Terminal', 'Barcelona Distribution Hub',
  'Porto Logistics Centre', 'Athens Warehouse',
]

export const facilities: Facility[] = facilityNames.map((name, i) => {
  const region = regions[i % regions.length]
  const countries = regionCountries[region]
  const country = countries[i % countries.length]
  const utilisation = 40 + Math.floor(((i * 37 + 13) % 55))
  return {
    id: `FAC-${String(i + 1).padStart(3, '0')}`,
    name,
    type: types[i % types.length],
    region,
    country,
    status: statuses[i % statuses.length],
    capacity: 5000 + (i * 1237) % 45000,
    utilisation,
    employees: 50 + (i * 83) % 950,
    established: 2000 + (i % 24),
  }
})

export const facilitiesByRegion = regions.map(r => ({
  region: r,
  count: facilities.filter(f => f.region === r).length,
}))

export const facilitiesByType = types.map(t => ({
  type: t,
  count: facilities.filter(f => f.type === t).length,
  value: facilities.filter(f => f.type === t).length,
}))
