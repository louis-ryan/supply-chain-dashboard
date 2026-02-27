interface Props {
  label: string
  value: string | number
  change?: number        // positive = up, negative = down
  changeLabel?: string
  icon?: string
}

export function KPICard({ label, value, change, changeLabel }: Props) {
  const isPositive = change !== undefined && change >= 0
  const isNeutral = change === undefined

  return (
    <div className="bg-[#1A1D27] border border-[#2E3347] rounded-xl p-5 flex flex-col gap-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-3xl font-semibold text-white">{value}</span>
      {!isNeutral && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{changeLabel ?? `${Math.abs(change!)}% vs last year`}</span>
        </div>
      )}
    </div>
  )
}
