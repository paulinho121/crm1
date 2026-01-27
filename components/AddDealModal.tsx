
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { DealStatus } from '../types';

interface AddDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialStageId?: string;
}

const AddDealModal: React.FC<AddDealModalProps> = ({ isOpen, onClose, initialStageId }) => {
    const { t } = useTranslation();
    const { addDeal, clients, stages } = useStore();
    const [formData, setFormData] = useState({
        title: '',
        clientId: '',
        value: '',
        stageId: initialStageId || stages[0]?.id || 'lead',
        probability: '50'
    });

    // Update local state if initialStageId changes
    useEffect(() => {
        if (isOpen && initialStageId) {
            setFormData(prev => ({ ...prev, stageId: initialStageId }));
        }
    }, [isOpen, initialStageId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.clientId || !formData.value) return;

        addDeal({
            title: formData.title,
            clientId: formData.clientId,
            value: parseFloat(formData.value),
            stageId: formData.stageId,
            status: DealStatus.OPEN,
            probability: parseInt(formData.probability)
        });

        setFormData({ title: '', clientId: '', value: '', stageId: stages[0]?.id || 'lead', probability: '50' });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('new_deal')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('deal_title')}</label>
                    <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Cloud Migration Project"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('client')}</label>
                    <select
                        required
                        value={formData.clientId}
                        onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    >
                        <option value="">{t('select_client')}</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('value')} ($)</label>
                        <input
                            required
                            type="number"
                            value={formData.value}
                            onChange={e => setFormData({ ...formData, value: e.target.value })}
                            placeholder="0.00"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('prob')} (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.probability}
                            onChange={e => setFormData({ ...formData, probability: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('initial_stage')}</label>
                    <select
                        value={formData.stageId}
                        onChange={e => setFormData({ ...formData, stageId: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    >
                        {stages.map(stage => (
                            <option key={stage.id} value={stage.id}>{t(stage.id)}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 mt-4"
                >
                    {t('new_deal')}
                </button>
            </form>
        </Modal>
    );
};

export default AddDealModal;
