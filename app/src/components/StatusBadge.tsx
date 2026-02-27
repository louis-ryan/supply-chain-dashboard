interface Props {
  value: string
  variant?: 'auto' | 'green' | 'amber' | 'red' | 'blue' | 'grey'
}

function resolveVariant(value: string): Props['variant'] {
  const v = value.toLowerCase()
  if (['active', 'delivered', 'in stock', 'low', 'tier 1'].some(k => v.includes(k))) return 'green'
  if (['maintenance', 'in transit', 'low stock', 'medium', 'tier 2'].some(k => v.includes(k))) return 'amber'
  if (['inactive', 'delayed', 'out of stock', 'high', 'cancelled'].some(k => v.includes(k))) return 'red'
  if (['tier 3'].some(k => v.includes(k))) return 'blue'
  return 'grey'
}

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  auto: '',
  green: 'bg-green-500/15 text-green-400 border-green-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  grey: 'bg-white/10 text-slate-400 border-white/15',
}

export function StatusBadge({ value, variant = 'auto' }: Props) {
  const resolved = variant === 'auto' ? resolveVariant(value) : variant
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variantClasses[resolved!]}`}>
      {value}
    </span>
  )
}
