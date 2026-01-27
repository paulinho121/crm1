
import React, { useState } from 'react';
import Modal from './Modal';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { ClientType } from '../types';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { addClient } = useStore();
    const [loadingCep, setLoadingCep] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        taxId: '',
        cep: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        stateRegistration: '',
        type: ClientType.CORPORATE,
        tags: ''
    });

    const formatTaxId = (value: string, type: ClientType) => {
        const digits = value.replace(/\D/g, '');
        if (type === ClientType.INDIVIDUAL) {
            // CPF: 000.000.000-00
            return digits
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        } else {
            // CNPJ: 00.000.000/0001-00
            return digits
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        }
    };

    const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatTaxId(e.target.value, formData.type);
        setFormData({ ...formData, taxId: formatted });
    };

    const formatCep = (value: string) => {
        return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
    };

    const [loadingCnpj, setLoadingCnpj] = useState(false);

    const handleCnpjBlur = async () => {
        if (formData.type !== ClientType.CORPORATE) return;
        const cnpj = formData.taxId.replace(/\D/g, '');
        if (cnpj.length !== 14) return;

        setLoadingCnpj(true);
        try {
            // Using a public API for CNPJ lookup (Receitaws via CORS proxy or direct if allowed)
            // Note: browser-side calls to some CNPJ APIs might need a proxy or specific service
            const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
            const data = await response.json();

            if (data && !data.error) {
                setFormData(prev => ({
                    ...prev,
                    name: data.razao_social || data.estabelecimento.nome_fantasia || prev.name,
                    cep: data.estabelecimento.cep || prev.cep,
                    address: data.estabelecimento.logradouro || prev.address,
                    number: data.estabelecimento.numero || prev.number,
                    complement: data.estabelecimento.complemento || prev.complement,
                    neighborhood: data.estabelecimento.bairro || prev.neighborhood,
                    city: data.estabelecimento.cidade.nome || prev.city,
                    state: data.estabelecimento.estado.sigla || prev.state
                }));
            }
        } catch (error) {
            console.error('Error fetching CNPJ:', error);
        } finally {
            setLoadingCnpj(false);
        }
    };

    const handleCepBlur = async () => {
        const cep = formData.cep.replace(/\D/g, '');
        if (cep.length !== 8) return;

        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    address: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf
                }));
            }
        } catch (error) {
            console.error('Error fetching CEP:', error);
        } finally {
            setLoadingCep(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;

        addClient({
            name: formData.name,
            email: formData.email,
            taxId: formData.taxId,
            stateRegistration: formData.stateRegistration,
            cep: formData.cep,
            address: formData.address,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            type: formData.type,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            customFields: []
        });

        setFormData({
            name: '', email: '', taxId: '', stateRegistration: '',
            cep: '', address: '', number: '', complement: '',
            neighborhood: '', city: '', state: '',
            type: ClientType.CORPORATE, tags: ''
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t('new')} ${t('client')}`} maxWidth="max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('client_name')}</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Wayne Enterprises"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="relative">
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                                {formData.type === ClientType.INDIVIDUAL ? 'CPF' : 'CNPJ'}
                            </label>
                            <input
                                type="text"
                                value={formData.taxId}
                                onChange={handleTaxIdChange}
                                onBlur={handleCnpjBlur}
                                placeholder={formData.type === ClientType.INDIVIDUAL ? '000.000.000-00' : '00.000.000/0001-00'}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                            {loadingCnpj && <Loader2 className="absolute right-3 bottom-3 text-indigo-500 animate-spin" size={16} />}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">I.E (Opcional)</label>
                            <input
                                type="text"
                                value={formData.stateRegistration}
                                onChange={e => setFormData({ ...formData, stateRegistration: e.target.value })}
                                placeholder="Inscrição Estadual"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('email')}</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="contact@company.com"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('type')}</label>
                        <select
                            value={formData.type}
                            onChange={e => {
                                const newType = e.target.value as ClientType;
                                setFormData({ ...formData, type: newType, taxId: '' });
                            }}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        >
                            <option value={ClientType.CORPORATE}>{t('corporate')}</option>
                            <option value={ClientType.INDIVIDUAL}>{t('individual')}</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2 mb-4 text-indigo-400">
                        <MapPin size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Endereço</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="relative">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">CEP</label>
                            <input
                                type="text"
                                value={formData.cep}
                                onChange={e => setFormData({ ...formData, cep: formatCep(e.target.value) })}
                                onBlur={handleCepBlur}
                                placeholder="00000-000"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                            {loadingCep && <Loader2 className="absolute right-3 bottom-2.5 text-indigo-500 animate-spin" size={14} />}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Rua / Logradouro</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                placeholder="Auto-completado pelo CEP"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Número</label>
                            <input
                                type="text"
                                value={formData.number}
                                onChange={e => setFormData({ ...formData, number: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                placeholder="123"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Complemento</label>
                            <input
                                type="text"
                                value={formData.complement}
                                onChange={e => setFormData({ ...formData, complement: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                placeholder="Sali, Apto, Bloco..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Bairro</label>
                            <input
                                type="text"
                                value={formData.neighborhood}
                                onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Cidade</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Estado (UF)</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                placeholder="SP"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/50">
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">{t('tags')}</label>
                    <input
                        type="text"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="VIP, Lead, Tech"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 mt-4"
                >
                    {t('new')} {t('client')}
                </button>
            </form>
        </Modal>
    );
};

export default AddClientModal;
