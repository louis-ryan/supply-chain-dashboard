interface Props {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: string
}

export function KPICard({ label, value, change, changeLabel }: Props) {
  const isPositive = change !== undefined && change >= 0
  const isNeutral = change === undefined

  return (
    <div
      className="border border-border rounded-xl p-5 flex flex-col gap-3 bg-bg-surface"
      role="region"
      aria-label={label}
    >
      <span className="text-sm text-muted">{label}</span>
      <span className="text-3xl font-semibold text-primary" aria-live="polite">{value}</span>
      {!isNeutral && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <span aria-hidden="true">{isPositive ? '↑' : '↓'}</span>
          <span>{changeLabel ?? `${Math.abs(change!)}% vs last year`}</span>
        </div>
      )}
    </div>
  )
}
