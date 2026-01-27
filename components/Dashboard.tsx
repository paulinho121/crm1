
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, Target, Zap, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { clients, deals } = useStore();
  const totalValue = deals.reduce((acc, d) => acc + d.value, 0);
  const avgProbability = Math.round(deals.reduce((acc, d) => acc + d.probability, 0) / deals.length) || 0;

  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10`}>
          {React.cloneElement(icon, { className: color.replace('bg-', 'text-') })}
        </div>
        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <p className="text-zinc-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('total_revenue')} value={`$${totalValue.toLocaleString()}`} icon={<TrendingUp size={20} />} color="bg-indigo-500" trend="+12.5%" />
        <StatCard title={t('active_clients')} value={clients.length} icon={<Users size={20} />} color="bg-blue-500" trend="+4" />
        <StatCard title={t('win_rate')} value={`${avgProbability}%`} icon={<Target size={20} />} color="bg-amber-500" trend="+2.1%" />
        <StatCard title={t('quick_deals')} value="8" icon={<Zap size={20} />} color="bg-purple-500" trend="+15%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-lg font-semibold mb-6">Revenue Forecasting</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#fafafa' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <AIInsightsSection clients={clients} deals={deals} />
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
          <h3 className="text-lg font-semibold mb-6">{t('recent_activities')}</h3>
          <div className="space-y-6">
            {deals.slice(0, 4).map((deal, idx) => (
              <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-indigo-500 transition-colors">
                  <span className="text-sm font-bold">{deal.title[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold group-hover:text-indigo-400 transition-colors">{deal.title}</p>
                  <p className="text-xs text-zinc-500">Value: ${deal.value.toLocaleString()}</p>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">2h ago</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-semibold transition-colors">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  );
};

const AIInsightsSection = ({ clients, deals }: any) => {
  const { t } = useTranslation();
  const [insights, setInsights] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { analyzeColdLeads } = await import('../services/geminiService');
        const res = await analyzeColdLeads(deals, clients);
        setInsights(res || 'Analysis complete. No critical alerts found.');
      } catch (e) {
        setInsights('AI Insight service is currently unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [deals, clients]);

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden group">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          <Sparkles className="text-white" size={18} />
        </div>
        <h3 className="text-lg font-bold">{t('ai_insights')}</h3>
        {loading && <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>}
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
          <div className="h-4 bg-zinc-800 rounded w-5/6 animate-pulse"></div>
        </div>
      ) : (
        <div className="prose prose-invert prose-sm max-w-none text-zinc-400 whitespace-pre-wrap leading-relaxed">
          {insights}
        </div>
      )}

      <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Sparkles size={120} />
      </div>
    </div>
  );
};

export default Dashboard;
