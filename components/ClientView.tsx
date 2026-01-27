
import React from 'react';
import { useStore } from '../store';
import { ClientType } from '../types';
import { useTranslation } from 'react-i18next';
import { Mail, MoreHorizontal, Filter, Download } from 'lucide-react';

const ClientView: React.FC = () => {
  const { t } = useTranslation();
  const { clients } = useStore();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('clients')}</h1>
          <p className="text-zinc-500 mt-1">Manage all your relationships in one place.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:bg-zinc-900 rounded-lg text-sm transition-colors">
            <Filter size={16} />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:bg-zinc-900 rounded-lg text-sm transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('client_name')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('type')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('email')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('tags')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${client.type === ClientType.CORPORATE ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {client.name[0]}
                    </div>
                    <span className="font-medium">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${client.type === ClientType.CORPORATE ? 'text-indigo-400 border border-indigo-500/30' : 'text-amber-400 border border-amber-500/30'}`}>
                    {client.type === ClientType.CORPORATE ? t('corporate') : t('individual')}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400 text-sm">{client.email}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {client.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-500 hover:text-white">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientView;
