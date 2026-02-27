import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '⊞' },
  { path: '/facilities', label: 'Facilities', icon: '🏭' },
  { path: '/suppliers', label: 'Suppliers', icon: '🤝' },
  { path: '/products', label: 'Products', icon: '📦' },
  { path: '/shipments', label: 'Shipments', icon: '🚢' },
]

function NavItem({ path, label, icon }: { path: string; label: string; icon: string }) {
  return (
    <NavLink
      to={path}
      end={path === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-blue-500/15 text-blue-400 font-medium'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`
      }
    >
      <span className="text-base w-5 text-center">{icon}</span>
      <span className="hidden lg:block">{label}</span>
    </NavLink>
  )
}

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-16 lg:w-56 bg-[#13151F] border-r border-[#2E3347] flex-shrink-0">
        <div className="p-4 border-b border-[#2E3347]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center text-white text-xs font-bold">M2</div>
            <span className="hidden lg:block text-sm font-semibold text-white">M2Flow</span>
          </div>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(item => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Bottom tab bar — mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#13151F] border-t border-[#2E3347] flex z-50">
          {navItems.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                  isActive ? 'text-blue-400' : 'text-slate-500'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
