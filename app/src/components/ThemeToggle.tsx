import { useStore } from '../store'

export function ThemeToggle() {
  const { theme, toggleTheme } = useStore()
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
    >
      <span className="text-base w-5 text-center" aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
      <span className="hidden lg:block">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  )
}
