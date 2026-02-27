import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, children, className = '' }: Props) {
  return (
    <div style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} className={`border rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        {subtitle && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}
