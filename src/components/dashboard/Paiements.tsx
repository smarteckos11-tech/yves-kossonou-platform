'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Download,
  TrendingUp,
  Clock,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useAppStore, Payment, PaymentMethod, PaymentStatus } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Constants ───
const methodConfig: Record<PaymentMethod, { label: string; color: string; bgColor: string }> = {
  wave: { label: 'Wave', color: '#1E88E5', bgColor: '#1E88E515' },
  orange_money: { label: 'Orange Money', color: '#F97316', bgColor: '#F9731615' },
  mtn_money: { label: 'MTN Money', color: '#EAB308', bgColor: '#EAB30815' },
  carte: { label: 'Carte', color: '#A855F7', bgColor: '#A855F715' },
};

const statusConfig: Record<PaymentStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  confirmé: { label: 'Confirmé', color: '#10B981', bgColor: '#10B98115', icon: CheckCircle2 },
  en_attente: { label: 'En attente', color: '#F59E0B', bgColor: '#F59E0B15', icon: Clock },
  échoué: { label: 'Échoué', color: '#EF4444', bgColor: '#EF444415', icon: CreditCard },
  remboursé: { label: 'Remboursé', color: '#94A3B8', bgColor: '#94A3B815', icon: RotateCcw },
};

const methodFilters: { value: string; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'wave', label: 'Wave' },
  { value: 'orange_money', label: 'Orange Money' },
  { value: 'mtn_money', label: 'MTN Money' },
  { value: 'carte', label: 'Carte' },
];

const statusFilters: { value: string; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'confirmé', label: 'Confirmé' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'échoué', label: 'Échoué' },
  { value: 'remboursé', label: 'Remboursé' },
];

// ─── Animation Variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ─── KPI Card ───
function KpiCard({
  title,
  value,
  icon: Icon,
  accentColor,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  accentColor: 'gold' | 'emerald' | 'amber' | 'slate';
}) {
  const colorMap = {
    gold: { iconBg: 'bg-[#06B6D4]/15', iconColor: 'text-[#06B6D4]', border: 'hover:border-[#06B6D4]/20' },
    emerald: { iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', border: 'hover:border-emerald-500/20' },
    amber: { iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', border: 'hover:border-amber-500/20' },
    slate: { iconBg: 'bg-slate-500/15', iconColor: 'text-slate-400', border: 'hover:border-slate-500/20' },
  };
  const colors = colorMap[accentColor];

  return (
    <motion.div variants={cardVariants}>
      <Card className={`bg-white/5 backdrop-blur-sm border-white/10 ${colors.border} transition-all duration-300 group`}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.iconBg} transition-transform duration-300 group-hover:scale-110`}>
              <Icon size={18} className={colors.iconColor} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
          <div className="text-xs text-slate-500 mt-1">{title}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ───
export default function Paiements() {
  const { payments, updatePaymentStatus } = useAppStore();
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // ── Filtered payments ──
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== 'all' && p.method !== methodFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      return true;
    });
  }, [payments, methodFilter, statusFilter]);

  // ── KPI values ──
  const kpiData = useMemo(() => {
    const confirmed = payments.filter((p) => p.status === 'confirmé');
    const pending = payments.filter((p) => p.status === 'en_attente');
    const refunded = payments.filter((p) => p.status === 'remboursé');

    const totalRevenue = confirmed.reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = pending.reduce((sum, p) => sum + p.amount, 0);
    const refundedAmount = refunded.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue,
      confirmedCount: confirmed.length,
      pendingCount: pending.length,
      refundedCount: refunded.length,
      pendingAmount,
      refundedAmount,
    };
  }, [payments]);

  // ── Method breakdown ──
  const methodBreakdown = useMemo(() => {
    const breakdown: Record<PaymentMethod, number> = { wave: 0, orange_money: 0, mtn_money: 0, carte: 0 };
    payments
      .filter((p) => p.status === 'confirmé')
      .forEach((p) => {
        breakdown[p.method] += p.amount;
      });
    return breakdown;
  }, [payments]);

  const maxRevenue = Math.max(...Object.values(methodBreakdown), 1);

  // ── Export mock ──
  const handleExport = () => {
    const csvContent = [
      ['Contact', 'Montant', 'Devise', 'Méthode', 'Statut', 'Description', 'Date'].join(','),
      ...filteredPayments.map((p) =>
        [p.contactName, p.amount, p.currency, methodConfig[p.method].label, statusConfig[p.status].label, `"${p.description}"`, p.date].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `paiements_konnect_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* ── KPI Row ── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <KpiCard
          title="Total Revenus"
          value={`${kpiData.totalRevenue.toLocaleString('fr-FR')} FCFA`}
          icon={TrendingUp}
          accentColor="gold"
        />
        <KpiCard
          title="Paiements Confirmés"
          value={`${kpiData.confirmedCount}`}
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <KpiCard
          title="En Attente"
          value={`${kpiData.pendingCount}`}
          icon={Clock}
          accentColor="amber"
        />
        <KpiCard
          title="Remboursés"
          value={`${kpiData.refundedCount}`}
          icon={RotateCcw}
          accentColor="slate"
        />
      </motion.div>

      {/* ── Filter Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white w-[160px] h-9 text-xs">
              <SelectValue placeholder="Méthode" />
            </SelectTrigger>
            <SelectContent className="bg-[#0c0f1a] border-white/10">
              {methodFilters.map((f) => (
                <SelectItem key={f.value} value={f.value} className="text-white focus:bg-white/10 focus:text-white text-xs">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white w-[160px] h-9 text-xs">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent className="bg-[#0c0f1a] border-white/10">
              {statusFilters.map((f) => (
                <SelectItem key={f.value} value={f.value} className="text-white focus:bg-white/10 focus:text-white text-xs">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-xs text-slate-500">{filteredPayments.length} résultat{filteredPayments.length > 1 ? 's' : ''}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-2 hover:bg-white/10 hover:border-[#06B6D4]/20 transition-all"
        >
          <Download size={14} /> Exporter CSV
        </motion.button>
      </motion.div>

      {/* ── Payment Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/[0.03] backdrop-blur-sm border-white/10 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400 text-xs font-medium">Contact</TableHead>
                    <TableHead className="text-slate-400 text-xs font-medium">Montant</TableHead>
                    <TableHead className="text-slate-400 text-xs font-medium">Méthode</TableHead>
                    <TableHead className="text-slate-400 text-xs font-medium">Statut</TableHead>
                    <TableHead className="text-slate-400 text-xs font-medium">Description</TableHead>
                    <TableHead className="text-slate-400 text-xs font-medium">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment, i) => {
                    const mConfig = methodConfig[payment.method];
                    const sConfig = statusConfig[payment.status];
                    const StatusIcon = sConfig.icon;

                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                      >
                        <TableCell className="text-white text-sm font-medium py-3">{payment.contactName}</TableCell>
                        <TableCell className="py-3">
                          <span className="text-white text-sm font-semibold">
                            {payment.amount.toLocaleString('fr-FR')}
                          </span>
                          <span className="text-slate-500 text-xs ml-1">{payment.currency}</span>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            style={{ background: mConfig.bgColor, color: mConfig.color }}
                            className="border-0 text-[11px] font-medium"
                          >
                            {mConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            style={{ background: sConfig.bgColor, color: sConfig.color }}
                            className="border-0 text-[11px] font-medium flex items-center gap-1 w-fit"
                          >
                            <StatusIcon size={10} />
                            {sConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs py-3 max-w-[200px] truncate">{payment.description}</TableCell>
                        <TableCell className="text-slate-500 text-xs py-3">{payment.date}</TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard size={32} className="text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Aucun paiement trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Method Breakdown ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/[0.03] backdrop-blur-sm border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
              <CreditCard size={16} className="text-[#06B6D4]" />
              Répartition par méthode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(Object.keys(methodBreakdown) as PaymentMethod[]).map((method) => {
                const mConfig = methodConfig[method];
                const amount = methodBreakdown[method];
                const percent = maxRevenue > 0 ? (amount / maxRevenue) * 100 : 0;

                return (
                  <div key={method} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: mConfig.color }}
                        />
                        <span className="text-xs text-slate-300 font-medium">{mConfig.label}</span>
                      </div>
                      <span className="text-xs text-white font-semibold">
                        {amount.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: mConfig.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
