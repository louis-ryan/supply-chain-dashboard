interface Props {
  label: string
  active: boolean
  onClick: () => void
  danger?: boolean
}

export function FilterChip({ label, active, onClick, danger }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
        active
          ? danger
            ? 'bg-red-500/20 text-red-400 border-red-500/50'
            : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
          : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/25'
      }`}
    >
      {label}
    </button>
  )
}
