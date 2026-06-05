'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

const revenueData = [
  { name: 'Jan', revenus: 1200000, depenses: 400000 },
  { name: 'Fév', revenus: 1800000, depenses: 500000 },
  { name: 'Mar', revenus: 1500000, depenses: 350000 },
  { name: 'Avr', revenus: 2200000, depenses: 600000 },
  { name: 'Mai', revenus: 2800000, depenses: 450000 },
  { name: 'Jun', revenus: 2400000, depenses: 550000 },
];

const leadsBySource = [
  { name: 'Site Web', value: 40, color: '#D4AF37' },
  { name: 'Réseaux Sociaux', value: 25, color: '#3B82F6' },
  { name: 'Événements', value: 20, color: '#8B5CF6' },
  { name: 'Références', value: 15, color: '#10B981' },
];

const conversionData = [
  { name: 'Sem 1', taux: 6.2 },
  { name: 'Sem 2', taux: 7.5 },
  { name: 'Sem 3', taux: 8.1 },
  { name: 'Sem 4', taux: 7.8 },
  { name: 'Sem 5', taux: 9.2 },
  { name: 'Sem 6', taux: 8.4 },
];

const topMetrics = [
  { title: 'Taux de Conversion', value: '8.4%', change: '+1.2%', icon: Target, color: '#D4AF37' },
  { title: 'Coût par Lead', value: '2,500 FCFA', change: '-8%', icon: DollarSign, color: '#10B981' },
  { title: 'Leads ce mois', value: '42', change: '+15%', icon: Users, color: '#3B82F6' },
  { title: 'ROI', value: '340%', change: '+22%', icon: TrendingUp, color: '#8B5CF6' },
];

export default function Analytics() {
  const [period, setPeriod] = useState('6m');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-[#94A3B8] text-sm mt-1">Analysez vos performances</p>
        </div>
        <div className="flex gap-2">
          {['1m', '3m', '6m', '1y'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                  : 'glass text-[#94A3B8]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topMetrics.map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${metric.color}15` }}>
                <metric.icon size={18} style={{ color: metric.color }} />
              </div>
              <span className="text-xs text-[#10B981] font-medium">{metric.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            <div className="text-xs text-[#64748B] mt-1">{metric.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Revenus vs Dépenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#CBD5E1', fontSize: '12px' }}
                formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M FCFA`]}
              />
              <Area type="monotone" dataKey="revenus" stroke="#D4AF37" fill="url(#revGrad)" strokeWidth={2} name="Revenus" />
              <Area type="monotone" dataKey="depenses" stroke="#EF4444" fill="url(#expGrad)" strokeWidth={2} name="Dépenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Leads par Source</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={leadsBySource}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {leadsBySource.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#CBD5E1', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {leadsBySource.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-[#94A3B8]">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Taux de Conversion</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={conversionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `${v}%`} />
            <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#CBD5E1', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, 'Taux']} />
            <Bar dataKey="taux" fill="#D4AF37" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
