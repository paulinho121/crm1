
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Shield, Bell } from 'lucide-react';

const SettingsView: React.FC = () => {
    const { t, i18n } = useTranslation();

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
                <p className="text-zinc-500 mt-1">Customize your Nexus experience.</p>
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

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 transition-all active:scale-95">
                    {t('save_changes')}
                </button>
            </div>
        </div>
    );
};

export default SettingsView;
