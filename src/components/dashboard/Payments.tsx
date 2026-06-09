'use client';

import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Globe, ArrowUpRight, ArrowDownRight, TrendingUp, Wallet } from 'lucide-react';

const paymentMethods = [
  { name: 'Wave Business', icon: Smartphone, color: '#1A6DFF', balance: '2,450,000 FCFA', transactions: 156 },
  { name: 'Orange Money', icon: Smartphone, color: '#FF6600', balance: '1,890,000 FCFA', transactions: 98 },
  { name: 'MTN Money', icon: Smartphone, color: '#FFCC00', balance: '980,000 FCFA', transactions: 45 },
  { name: 'Stripe', icon: Globe, color: '#635BFF', balance: '3,200,000 FCFA', transactions: 67 },
];

const transactions = [
  { id: 'TX-001', date: '2026-06-04', method: 'Wave', amount: 150000, type: 'income', description: 'Masterclass TD - Inscription' },
  { id: 'TX-002', date: '2026-06-04', method: 'Stripe', amount: 35000, type: 'income', description: 'Livre - Transformation Digitale' },
  { id: 'TX-003', date: '2026-06-03', method: 'Orange Money', amount: 100000, type: 'income', description: 'Formation Marketing Digital' },
  { id: 'TX-004', date: '2026-06-03', method: 'MTN Money', amount: 50000, type: 'income', description: 'Événement - Workshop IA' },
  { id: 'TX-005', date: '2026-06-02', method: 'Wave', amount: 75000, type: 'income', description: 'Coaching individuel' },
  { id: 'TX-006', date: '2026-06-02', method: 'Stripe', amount: 200000, type: 'income', description: 'Formation IA Business' },
  { id: 'TX-007', date: '2026-06-01', method: 'Orange Money', amount: 25000, type: 'income', description: 'Livre - Marketing Digital' },
  { id: 'TX-008', date: '2026-06-01', method: 'Wave', amount: 50000, type: 'expense', description: 'Publicité Facebook' },
];

export default function Payments() {
  const totalRevenue = paymentMethods.reduce((acc, m) => acc + parseInt(m.balance.replace(/[^\d]/g, '')), 0);
  const totalTransactions = paymentMethods.reduce((acc, m) => acc + m.transactions, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Paiements</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Gérez vos paiements et transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center">
              <Wallet size={20} className="text-[#06B6D4]" />
            </div>
            <span className="text-sm text-[#94A3B8]">Solde Total</span>
          </div>
          <div className="text-2xl font-bold turquoise-gradient-text">{(totalRevenue / 1000000).toFixed(1)}M FCFA</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-[#10B981]" />
            </div>
            <span className="text-sm text-[#94A3B8]">Transactions</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalTransactions}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
              <CreditCard size={20} className="text-[#3B82F6]" />
            </div>
            <span className="text-sm text-[#94A3B8]">Moyens de Paiement</span>
          </div>
          <div className="text-2xl font-bold text-white">{paymentMethods.length}</div>
        </motion.div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentMethods.map((method, i) => (
          <motion.div
            key={method.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${method.color}20` }}
              >
                <method.icon size={20} style={{ color: method.color }} />
              </div>
              <span className="text-sm font-semibold text-white">{method.name}</span>
            </div>
            <div className="text-lg font-bold text-white mb-1">{method.balance}</div>
            <div className="text-xs text-[#64748B]">{method.transactions} transactions</div>
          </motion.div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Historique des Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-[#64748B] border-b border-white/5">
                <th className="text-left py-3 font-medium">ID</th>
                <th className="text-left py-3 font-medium">Date</th>
                <th className="text-left py-3 font-medium">Description</th>
                <th className="text-left py-3 font-medium">Méthode</th>
                <th className="text-right py-3 font-medium">Montant</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="text-sm border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-[#94A3B8]">{tx.id}</td>
                  <td className="py-3 text-[#94A3B8]">{tx.date}</td>
                  <td className="py-3 text-white">{tx.description}</td>
                  <td className="py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#94A3B8]">{tx.method}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`font-medium ${tx.type === 'income' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()} FCFA
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
