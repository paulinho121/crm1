import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from '../constants';
import { Sparkles } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  return (
    <aside className="w-64 h-full border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-xl flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="text-white" size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight">Nexus CRM</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={`/${item.id}`}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`${isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{t(item.id)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
          <div className="flex items-center gap-3 mb-3">
            <img src="https://picsum.photos/seed/user/40" className="w-8 h-8 rounded-full border border-zinc-700" alt="Avatar" />
            <div>
              <p className="text-sm font-semibold">Alex Rivers</p>
              <p className="text-xs text-zinc-500 italic">Admin</p>
            </div>
          </div>
          <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium transition-colors">
            Account Management
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
