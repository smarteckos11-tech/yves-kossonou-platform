'use client';

import { motion } from 'framer-motion';
import { Users, DollarSign, BookOpen, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '@/store/useAppStore';

const revenueData = [
  { name: 'Jan', value: 1200000 },
  { name: 'Fév', value: 1800000 },
  { name: 'Mar', value: 1500000 },
  { name: 'Avr', value: 2200000 },
  { name: 'Mai', value: 2800000 },
  { name: 'Jun', value: 2400000 },
  { name: 'Jul', value: 3100000 },
];

const kpis = [
  { title: 'Revenus', value: '15M FCFA', change: '+23%', up: true, icon: DollarSign, color: '#D4AF37' },
  { title: 'Leads', value: '342', change: '+12%', up: true, icon: Users, color: '#3B82F6' },
  { title: 'Livres Vendus', value: '1,247', change: '+18%', up: true, icon: BookOpen, color: '#10B981' },
  { title: 'Conversions', value: '8.4%', change: '-2%', up: false, icon: TrendingUp, color: '#8B5CF6' },
];

const recentActivity = [
  { text: 'Nouveau lead : Amadou Diallo', time: 'Il y a 5 min', type: 'lead' },
  { text: 'Vente : Transformation Digitale (Livre)', time: 'Il y a 15 min', type: 'sale' },
  { text: 'Inscription : Masterclass TD', time: 'Il y a 1h', type: 'formation' },
  { text: 'Nouveau lead : Fatou Ndiaye', time: 'Il y a 2h', type: 'lead' },
  { text: 'Vente : Marketing Digital (Livre)', time: 'Il y a 3h', type: 'sale' },
  { text: 'Inscription : IA pour le Business', time: 'Il y a 4h', type: 'formation' },
];

export default function Overview() {
  const { leads, books, formations, events } = useAppStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Vue d&apos;ensemble</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Bienvenue sur votre tableau de bord, Yves</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card rounded-2xl p-5 hover:border-[#D4AF37]/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${kpi.color}15` }}
              >
                <kpi.icon size={20} style={{ color: kpi.color }} />
              </div>
              <span
                className={`text-xs font-semibold flex items-center gap-1 ${
                  kpi.up ? 'text-[#10B981]' : 'text-[#EF4444]'
                }`}
              >
                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            <div className="text-xs text-[#64748B] mt-1">{kpi.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenus</h3>
            <span className="text-xs text-[#64748B] bg-white/5 px-3 py-1 rounded-full">
              6 derniers mois
            </span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{
                  background: '#0F172A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#CBD5E1',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M FCFA`, 'Revenu']}
              />
              <Area type="monotone" dataKey="value" stroke="#D4AF37" fill="url(#goldGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Activité Récente</h3>
          <div className="space-y-4 max-h-[280px] overflow-y-auto custom-scrollbar">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'lead'
                      ? 'bg-[#3B82F6]'
                      : activity.type === 'sale'
                      ? 'bg-[#10B981]'
                      : 'bg-[#8B5CF6]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#CBD5E1] truncate">{activity.text}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <div className="text-sm text-[#94A3B8] mb-2">Livres en catalogue</div>
          <div className="text-3xl font-bold gold-gradient-text">{books.length}</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="text-sm text-[#94A3B8] mb-2">Formations actives</div>
          <div className="text-3xl font-bold gold-gradient-text">{formations.length}</div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="text-sm text-[#94A3B8] mb-2">Événements à venir</div>
          <div className="text-3xl font-bold gold-gradient-text">{events.length}</div>
        </div>
      </div>
    </div>
  );
}
