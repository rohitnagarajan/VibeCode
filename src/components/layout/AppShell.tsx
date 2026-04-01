import { NavLink } from 'react-router-dom';
import { LayoutGrid, Radio, Settings, Tv2, ExternalLink } from 'lucide-react';

const NAV = [
  { to: '/', icon: LayoutGrid, label: 'Library' },
  { to: '/studio', icon: Radio, label: 'Live Studio' },
  { to: '/settings', icon: Settings, label: 'Brand' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  function openOutput() {
    window.open(window.location.origin + import.meta.env.BASE_URL + '#/output', 'teamcast-output',
      'width=1280,height=720,toolbar=no,menubar=no,scrollbars=no');
  }

  return (
    <div className="flex h-screen bg-[#0d1117] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-none flex flex-col bg-[#161b27] border-r border-white/5">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Tv2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">TeamCast</span>
          </div>
          <p className="text-xs text-white/40 mt-1 ml-0.5">Live Graphics Studio</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Output Window button */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={openOutput}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <ExternalLink size={14} />
            Open Output Window
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
