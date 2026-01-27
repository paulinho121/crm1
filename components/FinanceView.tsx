
import React from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Landmark, ArrowUpRight, ArrowDownRight, CheckCircle, Clock } from 'lucide-react';

const FinanceView: React.FC = () => {
  const { deals } = useStore();
  const totalRevenue = deals.reduce((acc, d) => acc + d.value, 0);
  const commissionRate = 0.15; // 15%
  const totalCommissions = totalRevenue * commissionRate;

  const data = [
    { name: 'Revenue', value: totalRevenue, color: '#4f46e5' },
    { name: 'Comm.', value: totalCommissions, color: '#a855f7' },
    { name: 'Expenses', value: totalRevenue * 0.4, color: '#ec4899' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Nexus Financials</h1>
        <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400">
          Q1 FY2024 • Jan 1 - Mar 31
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Landmark size={80} />
            </div>
            <p className="text-zinc-500 text-sm font-medium">Total Billed</p>
            <h2 className="text-4xl font-black mt-2 tracking-tight">${totalRevenue.toLocaleString()}</h2>
            <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ArrowUpRight size={18} />
              <span>+24.8% vs last month</span>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
            <p className="text-zinc-500 text-sm font-medium">Pending Commissions</p>
            <h2 className="text-3xl font-black mt-2 tracking-tight">${totalCommissions.toLocaleString()}</h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Alex Rivers (15%)</span>
                <span className="font-bold">${(totalCommissions * 0.6).toLocaleString()}</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full">
                <div className="bg-indigo-500 h-1.5 rounded-full w-[60%]"></div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Sarah Chen (15%)</span>
                <span className="font-bold">${(totalCommissions * 0.4).toLocaleString()}</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full">
                <div className="bg-purple-500 h-1.5 rounded-full w-[40%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-8">P&L Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-800">
            <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Recent Payments</h4>
            <div className="space-y-4">
              {deals.map((deal, idx) => (
                <div key={deal.id} className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${idx % 2 === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {idx % 2 === 0 ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{deal.title}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">ID: TXN-00{idx + 124}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-zinc-100">${deal.value.toLocaleString()}</p>
                    <p className="text-[10px] text-zinc-500">March {12 + idx}, 2024</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceView;
