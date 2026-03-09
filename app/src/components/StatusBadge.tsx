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
  green: 'bg-success/15 text-success border-success/30',
  amber: 'bg-warning/15 text-warning border-warning/30',
  red:   'bg-danger/15 text-danger border-danger/30',
  blue:  'bg-accent/15 text-accent border-accent/30',
  grey:  'bg-secondary/10 text-muted border-secondary/15',
}

export function StatusBadge({ value, variant = 'auto' }: Props) {
  const resolved = variant === 'auto' ? resolveVariant(value) : variant
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${variantClasses[resolved!]}`}>
      {value}
    </span>
  )
}
