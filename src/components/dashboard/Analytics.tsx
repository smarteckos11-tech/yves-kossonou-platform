'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MailCheck,
  Eye,
  MessageCircle,
  Target,
  TrendingUp,
  TrendingDown,
  Smartphone,
  MessageSquare,
  CreditCard,
  BarChart3,
  LineChart as LineChartIcon,
} from 'lucide-react';

// ─── Helpers ───
const pct = (n: number, d: number) => (d > 0 ? (n / d) * 100 : 0);
const fmt = (n: number) => n.toLocaleString('fr-FR');
const fmtPct = (n: number) => n.toFixed(1) + '%';

const rateColor = (rate: number) => {
  if (rate >= 80) return 'text-emerald-400';
  if (rate >= 60) return 'text-yellow-400';
  return 'text-red-400';
};

const rateBg = (rate: number) => {
  if (rate >= 80) return 'bg-emerald-400';
  if (rate >= 60) return 'bg-yellow-400';
  return 'bg-red-400';
};

const rateBadge = (rate: number) => {
  if (rate >= 80) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
  if (rate >= 60) return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25';
  return 'bg-red-500/15 text-red-400 border-red-500/25';
};

// ─── Animation variants ───
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

// ─── KPI Card ───
function KPICard({
  title,
  value,
  change,
  icon: Icon,
  accent,
  index,
}: {
  title: string;
  value: string;
  change: { value: string; positive: boolean };
  icon: React.ElementType;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.45, ease: 'easeOut' }}
    >
      <Card className="bg-[#0c1018] border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${accent}18` }}
            >
              <Icon size={20} style={{ color: accent }} />
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                change.positive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {change.positive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {change.value}
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {value}
          </div>
          <div className="text-xs text-slate-500 mt-1.5 font-medium">
            {title}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Horizontal Bar (Messages par Canal) ───
function ChannelBarChart({
  sms,
  whatsapp,
}: {
  sms: number;
  whatsapp: number;
}) {
  const max = Math.max(sms, whatsapp, 1);
  const smsPct = (sms / max) * 100;
  const whatsappPct = (whatsapp / max) * 100;

  return (
    <div className="space-y-5">
      {/* SMS */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 flex items-center justify-center">
              <Smartphone size={14} className="text-[#06B6D4]" />
            </div>
            <span className="text-sm text-slate-300 font-medium">SMS</span>
          </div>
          <span className="text-sm font-bold text-white">{fmt(sms)}</span>
        </div>
        <div className="h-8 bg-white/[0.04] rounded-lg overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${smsPct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="h-full rounded-lg"
            style={{
              background:
                'linear-gradient(90deg, #06B6D4, #06B6D4cc)',
            }}
          />
        </div>
      </div>

      {/* WhatsApp */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <MessageSquare size={14} className="text-emerald-400" />
            </div>
            <span className="text-sm text-slate-300 font-medium">
              WhatsApp
            </span>
          </div>
          <span className="text-sm font-bold text-white">
            {fmt(whatsapp)}
          </span>
        </div>
        <div className="h-8 bg-white/[0.04] rounded-lg overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${whatsappPct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            className="h-full rounded-lg"
            style={{
              background:
                'linear-gradient(90deg, #10B981, #10B981cc)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── SVG Line Chart (Évolution des Contacts) ───
function ContactsLineChart({ data }: { data: { day: string; count: number }[] }) {
  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const minVal = Math.min(...data.map((d) => d.count));
  const range = maxVal - minVal || 1;

  const chartW = 500;
  const chartH = 200;
  const padX = 45;
  const padY = 20;
  const innerW = chartW - padX * 2;
  const innerH = chartH - padY * 2;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * innerW,
    y: padY + innerH - ((d.count - minVal) / range) * innerH,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padY + innerH} L ${points[0].x} ${padY + innerH} Z`;

  // Grid lines
  const gridLines = 4;

  return (
    <svg
      viewBox={`0 0 ${chartW} ${chartH}`}
      className="w-full h-auto"
      style={{ maxHeight: 220 }}
    >
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const y = padY + (i / gridLines) * innerH;
        const val = Math.round(maxVal - (i / gridLines) * range);
        return (
          <g key={i}>
            <line
              x1={padX}
              y1={y}
              x2={chartW - padX}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
            <text
              x={padX - 8}
              y={y + 4}
              textAnchor="end"
              fill="#64748B"
              fontSize={10}
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* Area */}
      <path d={areaPath} fill="url(#areaGradient)" />

      {/* Line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Points & Labels */}
      {points.map((p, i) => (
        <g key={i}>
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#06080f"
            stroke="#10B981"
            strokeWidth={2}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
          />
          <text
            x={p.x}
            y={chartH - 2}
            textAnchor="middle"
            fill="#64748B"
            fontSize={10}
          >
            {data[i].day}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── Revenue Breakdown Bars ───
function RevenueBreakdown({ payments }: { payments: { method: string; amount: number; color: string; icon: React.ElementType }[] }) {
  const maxAmount = Math.max(...payments.map((p) => p.amount), 1);

  return (
    <div className="space-y-4">
      {payments.map((p, i) => {
        const barPct = (p.amount / maxAmount) * 100;
        const IconComp = p.icon;
        return (
          <div key={p.method}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${p.color}20` }}
                >
                  <IconComp size={14} style={{ color: p.color }} />
                </div>
                <span className="text-sm text-slate-300 font-medium">
                  {p.method}
                </span>
              </div>
              <span className="text-sm font-bold text-white">
                {fmt(p.amount)} FCFA
              </span>
            </div>
            <div className="h-6 bg-white/[0.04] rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barPct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 + i * 0.12 }}
                className="h-full rounded-lg"
                style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}bb)` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───
export default function Analytics() {
  const { campaigns, capturePages, contacts, payments } = useAppStore();
  const [dateRange, setDateRange] = useState('7d');

  // ─── KPI computations ───
  const kpis = useMemo(() => {
    const sentTotal = campaigns.reduce((s, c) => s + c.sentCount, 0);
    const deliveredTotal = campaigns.reduce((s, c) => s + c.deliveredCount, 0);
    const readTotal = campaigns.reduce((s, c) => s + c.readCount, 0);
    const replyTotal = campaigns.reduce((s, c) => s + c.replyCount, 0);

    const visitsTotal = capturePages.reduce((s, p) => s + p.visits, 0);
    const conversionsTotal = capturePages.reduce(
      (s, p) => s + p.conversions,
      0
    );

    const livraison = pct(deliveredTotal, sentTotal);
    const lecture = pct(readTotal, deliveredTotal);
    const reponse = pct(replyTotal, readTotal);
    const conversion = pct(conversionsTotal, visitsTotal);

    return { livraison, lecture, reponse, conversion };
  }, [campaigns, capturePages]);

  // ─── Channel messages ───
  const channelData = useMemo(() => {
    let smsCount = 0;
    let whatsappCount = 0;

    campaigns.forEach((c) => {
      if (c.channel === 'sms' || c.channel === 'both') {
        const smsMessages = c.messages.filter((m) => m.channel === 'sms');
        smsCount += c.sentCount > 0 ? Math.round(c.sentCount / (c.channel === 'both' ? 2 : 1)) : smsMessages.length * 50;
      }
      if (c.channel === 'whatsapp' || c.channel === 'both') {
        const waMessages = c.messages.filter((m) => m.channel === 'whatsapp');
        whatsappCount += c.sentCount > 0 ? Math.round(c.sentCount / (c.channel === 'both' ? 2 : 1)) : waMessages.length * 50;
      }
    });

    // Ensure meaningful data even with mock
    if (smsCount === 0 && whatsappCount === 0) {
      smsCount = 225;
      whatsappCount = 225;
    }

    return { sms: smsCount, whatsapp: whatsappCount };
  }, [campaigns]);

  // ─── Contacts evolution (last 7 days mock) ───
  const contactsEvolution = useMemo(() => {
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date();
    const data: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
      // Derive mock count based on contacts data
      const base = contacts.length + i * 2;
      const variance = Math.sin(i * 1.2) * 3;
      data.push({
        day: dayNames[dayIdx],
        count: Math.max(0, Math.round(base + variance)),
      });
    }
    return data;
  }, [contacts]);

  // ─── Revenue by payment method ───
  const revenueByMethod = useMemo(() => {
    const confirmed = payments.filter((p) => p.status === 'confirmé');
    const totals: Record<string, number> = {
      wave: 0,
      orange_money: 0,
      mtn_money: 0,
      carte: 0,
    };
    confirmed.forEach((p) => {
      totals[p.method] = (totals[p.method] || 0) + p.amount;
    });

    return [
      { method: 'Wave', amount: totals.wave, color: '#1DC7EA', icon: Smartphone },
      { method: 'Orange Money', amount: totals.orange_money, color: '#FF7900', icon: Smartphone },
      { method: 'MTN Money', amount: totals.mtn_money, color: '#FFCC00', icon: Smartphone },
      { method: 'Carte', amount: totals.carte, color: '#06B6D4', icon: CreditCard },
    ];
  }, [payments]);

  // ─── Date range options ───
  const dateRangeOptions = [
    { value: '7d', label: '7 derniers jours' },
    { value: '30d', label: '30 derniers jours' },
    { value: 'month', label: 'Ce mois' },
    { value: 'custom', label: 'Personnalisé' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ─── Top Bar ─── */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-white">
            Tableau de Performance
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Analysez les métriques de vos campagnes et pages de capture
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[220px] bg-[#0c1018] border-white/[0.08] text-slate-300 text-sm">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent className="bg-[#0c1018] border-white/[0.08]">
            {dateRangeOptions.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-slate-300 focus:bg-white/[0.06] focus:text-white"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* ─── KPI Row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Taux de Livraison"
          value={fmtPct(kpis.livraison)}
          change={{ value: '+2.4%', positive: true }}
          icon={MailCheck}
          accent="#06B6D4"
          index={0}
        />
        <KPICard
          title="Taux de Lecture"
          value={fmtPct(kpis.lecture)}
          change={{ value: '+5.1%', positive: true }}
          icon={Eye}
          accent="#10B981"
          index={1}
        />
        <KPICard
          title="Taux de Réponse"
          value={fmtPct(kpis.reponse)}
          change={{ value: '+1.8%', positive: true }}
          icon={MessageCircle}
          accent="#f59e0b"
          index={2}
        />
        <KPICard
          title="Taux de Conversion"
          value={fmtPct(kpis.conversion)}
          change={{ value: '-0.3%', positive: false }}
          icon={Target}
          accent="#ef4444"
          index={3}
        />
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages par Canal */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#0c1018] border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 flex items-center justify-center">
                  <BarChart3 size={16} className="text-[#06B6D4]" />
                </div>
                <CardTitle className="text-base font-semibold text-white">
                  Messages par Canal
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ChannelBarChart
                sms={channelData.sms}
                whatsapp={channelData.whatsapp}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Évolution des Contacts */}
        <motion.div variants={itemVariants}>
          <Card className="bg-[#0c1018] border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <LineChartIcon size={16} className="text-emerald-400" />
                </div>
                <CardTitle className="text-base font-semibold text-white">
                  Évolution des Contacts
                </CardTitle>
              </div>
              <p className="text-xs text-slate-500">
                7 derniers jours
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <ContactsLineChart data={contactsEvolution} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Campaign Performance Table ─── */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#0c1018] border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 flex items-center justify-center">
                <BarChart3 size={16} className="text-[#06B6D4]" />
              </div>
              <CardTitle className="text-base font-semibold text-white">
                Performance des Campagnes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold">
                      Campagne
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold">
                      Canal
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-right">
                      Envoyés
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-right">
                      Livrés
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-right">
                      Taux Livraison
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-right">
                      Taux Lecture
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((camp, i) => {
                    const livraisonRate = pct(camp.deliveredCount, camp.sentCount);
                    const lectureRate = pct(camp.readCount, camp.deliveredCount);
                    const channelLabel =
                      camp.channel === 'both'
                        ? 'SMS + WhatsApp'
                        : camp.channel === 'sms'
                        ? 'SMS'
                        : 'WhatsApp';

                    return (
                      <motion.tr
                        key={camp.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="font-medium text-white py-3">
                          <div>
                            {camp.name}
                            <div className="text-xs text-slate-500 mt-0.5">
                              {camp.status === 'envoyée'
                                ? 'Envoyée'
                                : camp.status === 'planifiée'
                                ? 'Planifiée'
                                : camp.status === 'brouillon'
                                ? 'Brouillon'
                                : camp.status}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              camp.channel === 'whatsapp'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : camp.channel === 'sms'
                                ? 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20'
                                : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            }`}
                          >
                            {channelLabel}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-slate-300 py-3">
                          {fmt(camp.sentCount)}
                        </TableCell>
                        <TableCell className="text-right text-slate-300 py-3">
                          {fmt(camp.deliveredCount)}
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${rateBg(livraisonRate)}`}
                                style={{ width: `${Math.min(livraisonRate, 100)}%` }}
                              />
                            </div>
                            <span className={`font-semibold text-sm ${rateColor(livraisonRate)}`}>
                              {fmtPct(livraisonRate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${rateBg(lectureRate)}`}
                                style={{ width: `${Math.min(lectureRate, 100)}%` }}
                              />
                            </div>
                            <span className={`font-semibold text-sm ${rateColor(lectureRate)}`}>
                              {fmtPct(lectureRate)}
                            </span>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                  {campaigns.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-slate-500 py-8"
                      >
                        Aucune campagne pour le moment
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Capture Page Performance ─── */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#0c1018] border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Target size={16} className="text-emerald-400" />
              </div>
              <CardTitle className="text-base font-semibold text-white">
                Performance des Pages de Capture
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold">
                      Page
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold">
                      Template
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-right">
                      Visites
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-right">
                      Conversions
                    </TableHead>
                    <TableHead className="text-slate-400 font-semibold text-right">
                      Taux Conversion
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capturePages.map((page, i) => {
                    const convRate = pct(page.conversions, page.visits);
                    const templateLabels: Record<string, string> = {
                      conference: 'Conférence',
                      workshop: 'Workshop',
                      webinaire: 'Webinaire',
                      meetup: 'Meetup',
                      formation: 'Formation',
                      custom: 'Personnalisé',
                    };

                    return (
                      <motion.tr
                        key={page.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="font-medium text-white py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: page.published
                                  ? '#10B981'
                                  : '#64748B',
                              }}
                            />
                            <div>
                              {page.title}
                              <div className="text-xs text-slate-500 mt-0.5">
                                {page.published ? 'Publiée' : 'Brouillon'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className="text-xs bg-white/[0.04] text-slate-400 border-white/[0.08]"
                          >
                            {templateLabels[page.template] || page.template}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-slate-300 py-3">
                          {fmt(page.visits)}
                        </TableCell>
                        <TableCell className="text-right text-slate-300 py-3">
                          {fmt(page.conversions)}
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${rateBg(convRate)}`}
                                style={{
                                  width: `${Math.min(convRate, 100)}%`,
                                }}
                              />
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${rateBadge(convRate)}`}
                            >
                              {fmtPct(convRate)}
                            </Badge>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                  {capturePages.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-slate-500 py-8"
                      >
                        Aucune page de capture pour le moment
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ─── Revenue Breakdown ─── */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#0c1018] border-white/[0.06] hover:border-white/[0.12] transition-colors duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 flex items-center justify-center">
                  <CreditCard size={16} className="text-[#06B6D4]" />
                </div>
                <CardTitle className="text-base font-semibold text-white">
                  Répartition des Revenus
                </CardTitle>
              </div>
              <div className="text-sm font-bold text-[#06B6D4]">
                {fmt(
                  revenueByMethod.reduce((s, r) => s + r.amount, 0)
                )}{' '}
                FCFA
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Par méthode de paiement (paiements confirmés)
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <RevenueBreakdown payments={revenueByMethod} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </motion.div>
  );
}
