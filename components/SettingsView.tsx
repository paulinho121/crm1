
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Shield, Bell, Upload, Loader2, Image as ImageIcon, Eye } from 'lucide-react';
import { useStore } from '../store';
import Modal from './Modal';
import CommercialProposalTemplate from './CommercialProposalTemplate';

const SettingsView: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { proposalCustomization, updateProposalCustomization, uploadBrandsImage, deals, clients } = useStore();
    const [uploading, setUploading] = React.useState(false);
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Mock deal for preview if none exists
    const previewDeal = deals[0] || {
        id: 'preview-1',
        title: 'Produto de Exemplo',
        value: 1999.00,
        clientId: 'preview-client'
    };

    const previewClient = clients.find(c => c.id === previewDeal.clientId) || {
        id: 'preview-client',
        name: 'Cliente de Exemplo LTDA',
        email: 'contato@exemplo.com.br',
        address: 'Rua Principal',
        number: '123',
        city: 'Fortaleza',
        state: 'CE'
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await uploadBrandsImage(file);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const SettingCard = ({ icon, title, description, children }: any) => (
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-zinc-800 rounded-xl text-indigo-400">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-xs text-zinc-500">{description}</p>
                </div>
            </div>
            <div className="pt-2">
                {children}
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('settings')}</h1>
                <p className="text-zinc-500 mt-1">Customize your MCI experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingCard
                    icon={<Globe size={20} />}
                    title={t('language')}
                    description={t('select_language')}
                >
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: 'en', label: t('english') },
                            { id: 'pt', label: t('portuguese') }
                        ].map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => changeLanguage(lang.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${i18n.language.startsWith(lang.id)
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-750'
                                    }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </SettingCard>

                <SettingCard
                    icon={<Moon size={20} />}
                    title={t('theme')}
                    description="Switch between dark and light modes."
                >
                    <button className="px-4 py-2 bg-zinc-800 text-zinc-500 rounded-xl text-sm font-medium cursor-not-allowed border border-zinc-700/50">
                        {t('dark_mode')} (System Default)
                    </button>
                </SettingCard>

                <SettingCard
                    icon={<Bell size={20} />}
                    title="Notifications"
                    description="Manage your alert preferences."
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm text-zinc-300">Push Notifications</span>
                    </div>
                </SettingCard>

                <SettingCard
                    icon={<Shield size={20} />}
                    title="Security"
                    description="Two-factor authentication and keys."
                >
                    <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-medium transition-colors">
                        Configure 2FA
                    </button>
                </SettingCard>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-white mb-2">Customização da Proposta Comercial</h3>
                        <p className="text-xs text-zinc-500">Defina as informações padrões que aparecerão no seu PDF de orçamento.</p>
                    </div>
                    <button
                        onClick={() => setPreviewOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                        <Eye size={14} />
                        Pre-visualizar Layout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-bold text-zinc-500 uppercase">Banner de Marcas (Representadas)</span>
                            <div className="mt-2 flex flex-col gap-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative group h-32 w-full bg-zinc-950 border-2 border-dashed ${uploading ? 'border-zinc-800' : 'border-zinc-800 hover:border-indigo-500/50'} rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden`}
                                >
                                    {proposalCustomization.brandsImage && proposalCustomization.brandsImage !== '/brands-placeholder.png' ? (
                                        <>
                                            <img
                                                src={proposalCustomization.brandsImage}
                                                className="w-full h-full object-contain opacity-50 group-hover:opacity-30 transition-opacity"
                                                alt="Preview"
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Upload className="text-white mb-2" size={20} />
                                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Alterar Imagem</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-zinc-500 group-hover:text-indigo-400 transition-colors text-center px-4">
                                            {uploading ? <Loader2 className="animate-spin" size={24} /> : <ImageIcon size={24} />}
                                            <p className="text-[10px] font-bold uppercase tracking-widest">
                                                {uploading ? 'Fazendo Upload...' : 'Clique para subir o banner de marcas'}
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-600 italic">Recomendado: Imagem horizontal (PNG transparente) com as logos das fabricantes.</p>
                            </div>
                        </div>
                        <label className="block">
                            <span className="text-xs font-bold text-zinc-500 uppercase">Nome do Banco</span>
                            <input
                                type="text"
                                value={proposalCustomization.bankName}
                                onChange={(e) => updateProposalCustomization({ bankName: e.target.value })}
                                className="mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            />
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-xs font-bold text-zinc-500 uppercase">Agência</span>
                                <input
                                    type="text"
                                    value={proposalCustomization.bankAgency}
                                    onChange={(e) => updateProposalCustomization({ bankAgency: e.target.value })}
                                    className="mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                            </label>
                            <label className="block">
                                <span className="text-xs font-bold text-zinc-500 uppercase">Conta Corrente</span>
                                <input
                                    type="text"
                                    value={proposalCustomization.bankAccount}
                                    onChange={(e) => updateProposalCustomization({ bankAccount: e.target.value })}
                                    className="mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-xs font-bold text-zinc-500 uppercase">Titular da Conta (Razão Social)</span>
                            <input
                                type="text"
                                value={proposalCustomization.bankOwner}
                                onChange={(e) => updateProposalCustomization({ bankOwner: e.target.value })}
                                className="mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            />
                        </label>
                        <label className="block">
                            <span className="text-xs font-bold text-zinc-500 uppercase">Chave PIX</span>
                            <input
                                type="text"
                                value={proposalCustomization.pixKey}
                                onChange={(e) => updateProposalCustomization({ pixKey: e.target.value })}
                                className="mt-2 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            />
                        </label>
                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-3">
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 mt-0.5">
                                <Globe size={14} />
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-relaxed">
                                Estas informações serão salvas automaticamente e aplicadas a todas as novas propostas geradas no sistema.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all active:scale-95">
                    {t('save_changes')}
                </button>
            </div>

            <Modal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title="Pré-visualização da Proposta"
                maxWidth="max-w-4xl"
            >
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto no-scrollbar border border-zinc-200">
                    <CommercialProposalTemplate
                        client={previewClient as any}
                        items={[]}
                        subtotal={previewDeal.value}
                        shipping={0}
                        total={previewDeal.value}
                        date={new Date().toLocaleDateString('pt-BR')}
                    />
                </div>
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => setPreviewOpen(false)}
                        className="px-8 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-colors"
                    >
                        Fechar Visualização
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default SettingsView;
