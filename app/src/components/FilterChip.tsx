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
            ? 'bg-danger/20 text-danger border-danger/50'
            : 'bg-accent/20 text-accent border-accent/50'
          : 'bg-secondary/5 text-muted border-border hover:border-secondary/25'
      }`}
    >
      {label}
    </button>
  )
}
