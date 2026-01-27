
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "dashboard": "Dashboard",
            "clients": "Clients",
            "pipeline": "Pipeline",
            "proposals": "Proposals",
            "finance": "Finance",
            "settings": "Settings",
            "new_client": "New Client",
            "new_deal": "New Deal",
            "language": "Language",
            "select_language": "Select your preferred language",
            "english": "English",
            "portuguese": "Portuguese",
            "spanish": "Spanish",
            "theme": "Theme",
            "dark_mode": "Dark Mode",
            "save_changes": "Save Changes",
            "total_revenue": "Total Revenue",
            "active_clients": "Active Clients",
            "win_rate": "Win Rate",
            "quick_deals": "Quick Deals",
            "recent_activities": "Recent Activities",
            "ai_insights": "Nexus AI Insights"
        }
    },
    pt: {
        translation: {
            "dashboard": "Painel",
            "clients": "Clientes",
            "pipeline": "Funil de Vendas",
            "proposals": "Propostas",
            "finance": "Financeiro",
            "settings": "Configurações",
            "new_client": "Novo Cliente",
            "new_deal": "Novo Negócio",
            "language": "Idioma",
            "select_language": "Selecione seu idioma de preferência",
            "english": "Inglês",
            "portuguese": "Português",
            "spanish": "Espanhol",
            "theme": "Tema",
            "dark_mode": "Modo Escuro",
            "save_changes": "Salvar Alterações",
            "total_revenue": "Receita Total",
            "active_clients": "Clientes Ativos",
            "win_rate": "Taxa de Ganho",
            "quick_deals": "Fechamentos Rápidos",
            "recent_activities": "Atividades Recentes",
            "ai_insights": "Insights da Nexus AI"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
