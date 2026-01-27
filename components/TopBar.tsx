
import React from 'react';
import { Search, Bell, Plus, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';

interface TopBarProps {
  activeView: string;
}

const TopBar: React.FC<TopBarProps> = ({ activeView }) => {
  const { t } = useTranslation();
  const { setClientModalOpen, setDealModalOpen, setProductModalOpen } = useStore();

  const handleNewEntry = () => {
    if (activeView === 'clients') {
      setClientModalOpen(true);
    } else if (activeView === 'inventory') {
      setProductModalOpen(true);
    } else {
      setDealModalOpen(true);
    }
  };

  const getButtonLabel = () => {
    if (activeView === 'clients') return t('client');
    if (activeView === 'inventory') return t('item');
    return t('deal');
  };

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/20 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold capitalize text-zinc-100">{t(activeView)}</h2>
        <div className="h-4 w-[1px] bg-zinc-800"></div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
          <input
            type="text"
            placeholder={t('search_anything')}
            className="pl-10 pr-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all focus:w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full border border-zinc-950"></span>
        </button>
        <button
          onClick={handleNewEntry}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>{t('new')} {getButtonLabel()}</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
