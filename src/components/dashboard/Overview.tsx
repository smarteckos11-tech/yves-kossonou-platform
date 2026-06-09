'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Eye,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Smartphone,
  CalendarDays,
  UserPlus,
  Send,
  Receipt,
  CalendarCheck,
  GitBranch,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// ─── Animation Variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

// ─── Status Badge Styling ───
function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'envoyée':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
    case 'planifiée':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
    case 'en_cours':
      return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20';
    case 'terminée':
      return 'bg-slate-500/15 text-slate-400 border-slate-500/20';
    case 'brouillon':
      return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20';
    default:
      return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20';
  }
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    envoyée: 'Envoyée',
    planifiée: 'Planifiée',
    en_cours: 'En cours',
    terminée: 'Terminée',
    brouillon: 'Brouillon',
  };
  return map[status] || status;
}

// ─── Format helpers ───
function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return n.toLocaleString('fr-FR');
  return n.toString();
}

function formatCurrency(amount: number, currency: string): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ${currency}`;
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `Il y a ${diffD}j`;
}

// ─── KPI Card Component ───
function KpiCard({
  title,
  value,
  trend,
  icon: Icon,
  accentColor,
  index,
}: {
  title: string;
  value: string;
  trend: string;
  icon: React.ElementType;
  accentColor: 'gold' | 'emerald';
  index: number;
}) {
  const isGold = accentColor === 'gold';
  const iconBg = isGold ? 'bg-[#06B6D4]/15' : 'bg-emerald-500/15';
  const iconColor = isGold ? 'text-[#06B6D4]' : 'text-emerald-400';

  return (
    <motion.div variants={cardVariants} custom={index}>
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-[#06B6D4]/20 transition-all duration-300 group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
              <Icon size={20} className={iconColor} />
            </div>
            <span className="text-xs font-semibold flex items-center gap-1 text-emerald-400">
              <ArrowUpRight size={12} />
              {trend}
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
          <div className="text-xs text-slate-500 mt-1">{title}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Component ───
export default function Overview() {
  const { contacts, campaigns, sequences, evenements, payments } = useAppStore();

  // ── Computed KPI values ──
  const kpiData = useMemo(() => {
    const totalContacts = contacts.length;
    const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
    const totalRead = campaigns.reduce((sum, c) => sum + c.readCount, 0);
    const openRate = totalSent > 0 ? Math.round((totalRead / totalSent) * 100) : 0;
    const confirmedRevenue = payments
      .filter((p) => p.status === 'confirmé')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalContacts,
      totalSent,
      openRate,
      confirmedRevenue,
    };
  }, [contacts, campaigns, payments]);

  // ── Recent campaigns (last 3) ──
  const recentCampaigns = useMemo(() => {
    return [...campaigns]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [campaigns]);

  // ── Recent activity timeline ──
  const recentActivity = useMemo(() => {
    const items: { text: string; time: string; type: 'contact' | 'campaign' | 'payment' | 'event'; color: string }[] = [];

    // Latest contact added
    const latestContact = [...contacts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    if (latestContact) {
      items.push({
        text: `Nouveau contact : ${latestContact.name}`,
        time: latestContact.createdAt,
        type: 'contact',
        color: 'bg-emerald-400',
      });
    }

    // Latest campaign sent
    const latestCampaign = [...campaigns]
      .filter((c) => c.status === 'envoyée')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latestCampaign) {
      items.push({
        text: `Campagne envoyée : ${latestCampaign.name}`,
        time: latestCampaign.createdAt,
        type: 'campaign',
        color: 'bg-[#06B6D4]',
      });
    }

    // Latest confirmed payment
    const latestPayment = [...payments]
      .filter((p) => p.status === 'confirmé')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    if (latestPayment) {
      items.push({
        text: `Paiement reçu : ${latestPayment.contactName} — ${formatCurrency(latestPayment.amount, latestPayment.currency)}`,
        time: latestPayment.date,
        type: 'payment',
        color: 'bg-amber-400',
      });
    }

    // Latest event registration
    const latestEvent = [...evenements]
      .filter((e) => e.registeredCount > 0)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latestEvent) {
      items.push({
        text: `Inscription événement : ${latestEvent.title} (${latestEvent.registeredCount} inscrits)`,
        time: latestEvent.createdAt,
        type: 'event',
        color: 'bg-rose-400',
      });
    }

    // Additional contacts
    const secondContact = [...contacts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[1];
    if (secondContact) {
      items.push({
        text: `Nouveau contact : ${secondContact.name}`,
        time: secondContact.createdAt,
        type: 'contact',
        color: 'bg-emerald-400',
      });
    }

    // Additional payment
    const secondPayment = [...payments]
      .filter((p) => p.status === 'confirmé')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[1];
    if (secondPayment) {
      items.push({
        text: `Paiement reçu : ${secondPayment.contactName} — ${formatCurrency(secondPayment.amount, secondPayment.currency)}`,
        time: secondPayment.date,
        type: 'payment',
        color: 'bg-amber-400',
      });
    }

    return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }, [contacts, campaigns, payments, evenements]);

  // ── Upcoming events (next 2) ──
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return [...evenements]
      .filter((e) => e.status === 'à_venir' && new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 2);
  }, [evenements]);

  // ── Active sequences ──
  const activeSequences = useMemo(() => {
    return sequences.filter((s) => s.isActive);
  }, [sequences]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white">
          Vue d&apos;ensemble
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Bienvenue sur votre tableau de bord KONNECT
        </p>
      </motion.div>

      {/* ── KPI Row ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <KpiCard
          title="Contacts Totaux"
          value={formatNumber(kpiData.totalContacts)}
          trend="+12%"
          icon={Users}
          accentColor="emerald"
          index={0}
        />
        <KpiCard
          title="Messages Envoyés"
          value={formatNumber(kpiData.totalSent)}
          trend="+8%"
          icon={MessageSquare}
          accentColor="gold"
          index={1}
        />
        <KpiCard
          title="Taux d'Ouverture"
          value={`${kpiData.openRate}%`}
          trend="+5%"
          icon={Eye}
          accentColor="emerald"
          index={2}
        />
        <KpiCard
          title="Revenus"
          value={formatCurrency(kpiData.confirmedRevenue, 'FCFA')}
          trend="+23%"
          icon={CreditCard}
          accentColor="gold"
          index={3}
        />
      </motion.div>

      {/* ── Two-Column Grid: Campaigns + Activity ── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Campagnes Récentes */}
        <motion.div variants={cardVariants}>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <Send size={16} className="text-[#06B6D4]" />
                  Campagnes Récentes
                </CardTitle>
                <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px]">
                  {campaigns.length} au total
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {recentCampaigns.map((campaign, i) => (
                  <motion.div
                    key={campaign.id}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: i * 0.08 }}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.06] transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-white truncate">
                          {campaign.name}
                        </span>
                      </div>
                      <Badge
                        className={`text-[10px] px-2 py-0.5 border ${getStatusBadgeStyle(campaign.status)}`}
                      >
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {/* Channel icons */}
                      <span className="flex items-center gap-1">
                        {(campaign.channel === 'sms' || campaign.channel === 'both') && (
                          <Smartphone size={12} className="text-emerald-400" />
                        )}
                        {(campaign.channel === 'whatsapp' || campaign.channel === 'both') && (
                          <MessageSquare size={12} className="text-[#06B6D4]" />
                        )}
                        <span className="capitalize">{campaign.channel === 'both' ? 'SMS + WA' : campaign.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}</span>
                      </span>
                      <span className="text-slate-600">•</span>
                      <span>{formatNumber(campaign.sentCount)} envoyés</span>
                      {campaign.sentCount > 0 && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-emerald-400/80">
                            {Math.round((campaign.deliveredCount / campaign.sentCount) * 100)}% livrés
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activité Récente */}
        <motion.div variants={cardVariants}>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-400" />
                  Activité Récente
                </CardTitle>
                <Clock size={14} className="text-slate-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar">
                {recentActivity.map((activity, i) => {
                  const typeIcon = {
                    contact: UserPlus,
                    campaign: Send,
                    payment: Receipt,
                    event: CalendarCheck,
                  }[activity.type];

                  return (
                    <motion.div
                      key={i}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="relative mt-1 flex-shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full ${activity.color}`} />
                        {i < recentActivity.length - 1 && (
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-white/[0.06]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {typeIcon && (
                            <typeIcon size={12} className="text-slate-500 flex-shrink-0" />
                          )}
                          <p className="text-sm text-slate-300 truncate">
                            {activity.text}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 ml-5">
                          {timeAgo(activity.time)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ── Bottom Row: Events + Sequences ── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Prochains Événements */}
        <motion.div variants={cardVariants}>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <CalendarDays size={16} className="text-[#06B6D4]" />
                  Prochains Événements
                </CardTitle>
                <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px]">
                  {evenements.filter((e) => e.status === 'à_venir').length} à venir
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? upcomingEvents.map((event, i) => {
                  const fillPercent = Math.round((event.registeredCount / event.maxAttendees) * 100);
                  return (
                    <motion.div
                      key={event.id}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-[#06B6D4]/15 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <CalendarDays size={11} />
                            <span>{formatDate(event.date)} à {event.time}</span>
                            {event.isOnline ? (
                              <span className="flex items-center gap-0.5 text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                En ligne
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5">
                                <MapPin size={10} />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <div className="text-sm font-bold text-[#06B6D4]">
                            {formatCurrency(event.price, event.currency)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {event.registeredCount} / {event.maxAttendees} inscrits
                        </span>
                        <span className="text-emerald-400/80 font-medium">{fillPercent}%</span>
                      </div>
                      <Progress
                        value={fillPercent}
                        className="h-1.5 bg-white/[0.06]"
                      />
                    </motion.div>
                  );
                }) : (
                  <div className="text-center py-8 text-slate-600 text-sm">
                    Aucun événement à venir
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Séquences Actives */}
        <motion.div variants={cardVariants}>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base font-semibold flex items-center gap-2">
                  <GitBranch size={16} className="text-emerald-400" />
                  Séquences Actives
                </CardTitle>
                <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px]">
                  {activeSequences.length} active{activeSequences.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {activeSequences.length > 0 ? activeSequences.map((seq, i) => {
                  const completionRate = seq.enrolledCount > 0
                    ? Math.round((seq.completedCount / seq.enrolledCount) * 100)
                    : 0;
                  return (
                    <motion.div
                      key={seq.id}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.1 }}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-emerald-500/15 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-white truncate">
                              {seq.name}
                            </h4>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {seq.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 flex-shrink-0 ml-3">
                          <CheckCircle2 size={12} className="text-emerald-400/60" />
                          <span>{seq.steps.length} étapes</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Users size={11} />
                            {seq.enrolledCount} inscrits
                          </span>
                          <span>
                            <span className="text-emerald-400/80 font-medium">{seq.completedCount}</span> terminés — {completionRate}%
                          </span>
                        </div>
                        <Progress
                          value={completionRate}
                          className="h-1.5 bg-white/[0.06]"
                        />
                      </div>
                    </motion.div>
                  );
                }) : (
                  <div className="text-center py-8 text-slate-600 text-sm">
                    Aucune séquence active
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
