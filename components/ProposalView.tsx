
import React, { useState } from 'react';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { FileText, Wand2, Send, Clock, Eye } from 'lucide-react';
import { generateProposalDraft } from '../services/geminiService';

const ProposalView: React.FC = () => {
  const { t } = useTranslation();
  const { deals, clients } = useStore();
  const [selectedDealId, setSelectedDealId] = useState('');
  const [drafting, setDrafting] = useState(false);
  const [proposalContent, setProposalContent] = useState('');

  const handleGenerate = async () => {
    if (!selectedDealId) return;
    setDrafting(true);
    const deal = deals.find(d => d.id === selectedDealId);
    const client = clients.find(c => c.id === deal?.clientId);

    if (deal && client) {
      const draft = await generateProposalDraft(deal.title, client.name, deal.value);
      setProposalContent(draft || 'Error generating draft.');
    }
    setDrafting(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('proposals_and_contracts')}</h1>
          <p className="text-zinc-500 mt-1">{t('proposals_desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Editor/Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">{t('select_deal')}</label>
            <select
              value={selectedDealId}
              onChange={(e) => setSelectedDealId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
            >
              <option value="">{t('choose_deal')}</option>
              {deals.map(deal => (
                <option key={deal.id} value={deal.id}>{deal.title} (${deal.value.toLocaleString()})</option>
              ))}
            </select>

            <button
              onClick={handleGenerate}
              disabled={!selectedDealId || drafting}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
            >
              {drafting ? <ClockLoader /> : <Wand2 size={18} />}
              {drafting ? t('drafting...') : t('ai_generate')}
            </button>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-sm border-b border-zinc-800 pb-3">{t('draft_actions')}</h3>
            <button className="w-full flex items-center justify-between px-4 py-2 hover:bg-zinc-800 rounded-lg text-sm transition-colors text-zinc-400 hover:text-white">
              <span className="flex items-center gap-3"><Eye size={16} /> {t('preview_mode')}</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 hover:bg-zinc-800 rounded-lg text-sm transition-colors text-zinc-400 hover:text-white">
              <span className="flex items-center gap-3"><Send size={16} /> {t('send_to_client')}</span>
            </button>
          </div>
        </div>

        {/* Right: Preview Panel */}
        <div className="lg:col-span-8 bg-zinc-900/30 border border-zinc-800 rounded-3xl min-h-[600px] flex flex-col p-1">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <FileText className="text-zinc-500" size={16} />
              <span className="text-xs font-bold text-zinc-400">PROPOSAL_DRAFT_2024.PDF</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
            </div>
          </div>
          <div className="flex-1 p-12 bg-white text-zinc-900 rounded-b-3xl overflow-y-auto no-scrollbar font-serif">
            {proposalContent ? (
              <div className="prose prose-sm prose-zinc leading-relaxed whitespace-pre-wrap">
                {proposalContent}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-300 gap-4 opacity-50">
                <FileText size={64} strokeWidth={1} />
                <p className="font-sans text-sm italic">{t('select_deal_to_start')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClockLoader = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
);

export default ProposalView;
