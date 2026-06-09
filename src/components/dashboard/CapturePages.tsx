'use client';

import { useState, useMemo } from 'react';
import { useAppStore, CapturePage, CaptureTemplate } from '@/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Eye, Copy, Trash2, Plus, Globe, Link, Palette,
  Pencil, ExternalLink, BarChart3, MousePointerClick, TrendingUp,
  Calendar, Mail, Phone, Building2, Briefcase, X, Check,
  LayoutTemplate, Zap, ArrowRight, Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ─── Template Configuration ───
const templateConfig: Record<CaptureTemplate, {
  label: string;
  description: string;
  gradient: string;
  accentColor: string;
  bgColor: string;
  icon: React.ReactNode;
}> = {
  conference: {
    label: 'Conférence',
    description: 'Page de capture pour conférences et sommets avec design premium',
    gradient: 'from-[#0a1628] via-[#121e36] to-[#1a2744]',
    accentColor: '#06B6D4',
    bgColor: '#081120',
    icon: <Calendar className="w-6 h-6" />,
  },
  workshop: {
    label: 'Workshop',
    description: 'Ateliers pratiques et sessions interactives avec énergie créative',
    gradient: 'from-[#071a14] via-[#0d2a1f] to-[#143d2c]',
    accentColor: '#10B981',
    bgColor: '#071a14',
    icon: <Zap className="w-6 h-6" />,
  },
  webinaire: {
    label: 'Webinaire',
    description: 'Présentations en ligne et masterclasses avec focus immersive',
    gradient: 'from-[#1a0a10] via-[#2d1018] to-[#3d1520]',
    accentColor: '#E94560',
    bgColor: '#1a0a10',
    icon: <Globe className="w-6 h-6" />,
  },
  meetup: {
    label: 'Meetup',
    description: 'Rencontres networking et événements communautaires décontractés',
    gradient: 'from-[#061318] via-[#0b222c] to-[#103040]',
    accentColor: '#06B6D4',
    bgColor: '#061318',
    icon: <Link className="w-6 h-6" />,
  },
  formation: {
    label: 'Formation',
    description: 'Cours et programmes de formation avec structure pédagogique',
    gradient: 'from-[#12081a] via-[#1e0f2d] to-[#2a153d]',
    accentColor: '#A855F7',
    bgColor: '#12081a',
    icon: <Sparkles className="w-6 h-6" />,
  },
  custom: {
    label: 'Personnalisé',
    description: 'Créez votre page de capture sur mesure avec couleurs personnalisées',
    gradient: 'from-[#0f0f0f] via-[#1a1a1a] to-[#252525]',
    accentColor: '#06B6D4',
    bgColor: '#0f0f0f',
    icon: <Palette className="w-6 h-6" />,
  },
};

const templateTypes: CaptureTemplate[] = ['conference', 'workshop', 'webinaire', 'meetup', 'formation', 'custom'];

// ─── Filter Types ───
type FilterType = 'all' | 'published' | 'draft';

// ─── Form Fields Options ───
const fieldOptions = [
  { id: 'name', label: 'Nom', icon: <FileText className="w-3.5 h-3.5" /> },
  { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
  { id: 'phone', label: 'Téléphone', icon: <Phone className="w-3.5 h-3.5" /> },
  { id: 'company', label: 'Entreprise', icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: 'role', label: 'Fonction', icon: <Briefcase className="w-3.5 h-3.5" /> },
];

// ─── Color Presets ───
const bgPresets = [
  '#081120', '#0F172A', '#0a1628', '#071a14', '#1a0a10',
  '#061318', '#12081a', '#0f0f0f', '#1a1a2e', '#0d1117',
];
const accentPresets = [
  '#06B6D4', '#10B981', '#E94560', '#06B6D4', '#A855F7',
  '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#8B5CF6',
];

// ─── Default form state ───
const defaultFormState = {
  title: '',
  template: 'conference' as CaptureTemplate,
  headline: '',
  subheadline: '',
  ctaText: "S'inscrire",
  coverImage: '',
  fields: ['name', 'email'] as string[],
  backgroundColor: '#081120',
  accentColor: '#06B6D4',
  linkedEventId: '',
  linkedSequenceId: '',
};

export default function CapturePages() {
  const {
    capturePages, addCapturePage, updateCapturePage,
    deleteCapturePage, toggleCapturePagePublish,
    evenements, sequences
  } = useAppStore();

  // ─── State ───
  const [filter, setFilter] = useState<FilterType>('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultFormState);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ─── Filtered pages ───
  const filteredPages = useMemo(() => {
    switch (filter) {
      case 'published': return capturePages.filter(p => p.published);
      case 'draft': return capturePages.filter(p => !p.published);
      default: return capturePages;
    }
  }, [capturePages, filter]);

  // ─── Stats ───
  const totalVisits = capturePages.reduce((s, p) => s + p.visits, 0);
  const totalConversions = capturePages.reduce((s, p) => s + p.conversions, 0);
  const avgConversionRate = totalVisits > 0 ? ((totalConversions / totalVisits) * 100).toFixed(1) : '0';

  // ─── Handlers ───
  const handleSelectTemplate = (template: CaptureTemplate) => {
    const config = templateConfig[template];
    setForm({
      ...defaultFormState,
      template,
      backgroundColor: config.bgColor,
      accentColor: config.accentColor,
    });
    setShowTemplates(false);
    setEditingId(null);
    setShowEditor(true);
  };

  const handleEditPage = (page: CapturePage) => {
    setForm({
      title: page.title,
      template: page.template,
      headline: page.headline,
      subheadline: page.subheadline,
      ctaText: page.ctaText,
      coverImage: page.coverImage,
      fields: [...page.fields],
      backgroundColor: page.backgroundColor,
      accentColor: page.accentColor,
      linkedEventId: page.linkedEventId || '',
      linkedSequenceId: page.linkedSequenceId || '',
    });
    setEditingId(page.id);
    setShowEditor(true);
  };

  const handleSave = (publish?: boolean) => {
    if (editingId) {
      updateCapturePage(editingId, {
        title: form.title,
        headline: form.headline,
        subheadline: form.subheadline,
        ctaText: form.ctaText,
        coverImage: form.coverImage,
        fields: form.fields,
        backgroundColor: form.backgroundColor,
        accentColor: form.accentColor,
        linkedEventId: form.linkedEventId || undefined,
        linkedSequenceId: form.linkedSequenceId || undefined,
        published: publish !== undefined ? publish : undefined,
      });
    } else {
      const newPage: CapturePage = {
        id: Date.now().toString(),
        title: form.title,
        template: form.template,
        headline: form.headline,
        subheadline: form.subheadline,
        ctaText: form.ctaText,
        coverImage: form.coverImage,
        fields: form.fields,
        backgroundColor: form.backgroundColor,
        accentColor: form.accentColor,
        published: publish === true,
        visits: 0,
        conversions: 0,
        linkedEventId: form.linkedEventId || undefined,
        linkedSequenceId: form.linkedSequenceId || undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      addCapturePage(newPage);
    }
    setShowEditor(false);
    setEditingId(null);
    setForm(defaultFormState);
  };

  const handleDelete = (id: string) => {
    deleteCapturePage(id);
    setDeleteConfirm(null);
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/capture/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const toggleField = (fieldId: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.includes(fieldId)
        ? prev.fields.filter(f => f !== fieldId)
        : [...prev.fields, fieldId],
    }));
  };

  // ─── Helper: Get linked event name ───
  const getEventName = (eventId?: string) => {
    if (!eventId) return null;
    const evt = evenements.find(e => e.id === eventId);
    return evt?.title || null;
  };

  // ─── Helper: Conversion rate ───
  const getConvRate = (page: CapturePage) => {
    if (page.visits === 0) return '0%';
    return ((page.conversions / page.visits) * 100).toFixed(1) + '%';
  };

  return (
    <div className="space-y-6">
      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Visites totales', value: totalVisits.toLocaleString(), icon: <Eye className="w-4 h-4" />, color: '#06B6D4' },
          { label: 'Conversions', value: totalConversions.toLocaleString(), icon: <MousePointerClick className="w-4 h-4" />, color: '#10B981' },
          { label: 'Taux moyen', value: `${avgConversionRate}%`, icon: <TrendingUp className="w-4 h-4" />, color: '#F59E0B' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl p-4 flex items-center gap-4"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Top Bar ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['all', 'published', 'draft'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30'
                  : 'text-slate-400 hover:text-slate-300 border border-transparent hover:border-white/5'
              }`}
            >
              {f === 'all' ? 'Toutes' : f === 'published' ? 'Publiées' : 'Brouillons'}
              <span className="ml-1.5 text-[10px] opacity-60">
                {f === 'all'
                  ? capturePages.length
                  : f === 'published'
                  ? capturePages.filter(p => p.published).length
                  : capturePages.filter(p => !p.published).length}
              </span>
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowTemplates(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-[#06080f] font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#06B6D4]/20"
        >
          <Plus className="w-4 h-4" /> Nouvelle Page
        </motion.button>
      </div>

      {/* ─── Page Cards Grid ─── */}
      {filteredPages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#06B6D4]/10 flex items-center justify-center mb-4">
            <LayoutTemplate className="w-8 h-8 text-[#06B6D4]/40" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Aucune page de capture</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            {filter === 'all'
              ? 'Créez votre première page de capture à partir d\'un modèle prêt à l\'emploi.'
              : filter === 'published'
              ? 'Aucune page publiée. Publiez une page pour la rendre accessible.'
              : 'Aucun brouillon. Toutes vos pages sont publiées !'}
          </p>
          {filter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowTemplates(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-[#06080f] font-semibold text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Choisir un modèle
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPages.map((page, i) => {
            const config = templateConfig[page.template];
            const evtName = getEventName(page.linkedEventId);
            return (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl overflow-hidden hover:border-white/10 transition-all group"
              >
                {/* Cover / Preview */}
                <div
                  className="h-36 relative flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${page.backgroundColor}, ${page.backgroundColor}dd)` }}
                >
                  {/* Decorative accent circle */}
                  <div
                    className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10"
                    style={{ backgroundColor: page.accentColor }}
                  />
                  <div
                    className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full opacity-8"
                    style={{ backgroundColor: page.accentColor, opacity: 0.06 }}
                  />
                  {page.coverImage ? (
                    <img
                      src={page.coverImage}
                      alt={page.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <span style={{ color: page.accentColor, opacity: 0.6 }}>
                        {config.icon}
                      </span>
                      <span className="text-xs font-medium" style={{ color: page.accentColor, opacity: 0.5 }}>
                        {config.label}
                      </span>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className="border-0 text-[10px] font-semibold"
                      style={{
                        backgroundColor: page.published ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.2)',
                        color: page.published ? '#10B981' : '#94A3B8',
                      }}
                    >
                      {page.published ? 'Publiée' : 'Brouillon'}
                    </Badge>
                  </div>

                  {/* Template type badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className="border-0 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${page.accentColor}20`,
                        color: page.accentColor,
                      }}
                    >
                      {config.label}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-white truncate">{page.title}</h3>

                  {page.headline && (
                    <p className="text-xs text-slate-500 line-clamp-1">{page.headline}</p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                        <Eye className="w-3 h-3" />
                      </div>
                      <p className="text-xs font-bold text-white">{page.visits}</p>
                      <p className="text-[10px] text-slate-500">Visites</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                        <MousePointerClick className="w-3 h-3" />
                      </div>
                      <p className="text-xs font-bold text-white">{page.conversions}</p>
                      <p className="text-[10px] text-slate-500">Conv.</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/[0.03]">
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                        <TrendingUp className="w-3 h-3" />
                      </div>
                      <p className="text-xs font-bold" style={{ color: page.accentColor }}>{getConvRate(page)}</p>
                      <p className="text-[10px] text-slate-500">Taux</p>
                    </div>
                  </div>

                  {/* Linked event */}
                  {evtName && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/[0.03] rounded-lg px-2.5 py-1.5">
                      <Calendar className="w-3 h-3 text-[#06B6D4]" />
                      <span className="truncate">{evtName}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                      title="Aperçu"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditPage(page)}
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-[#06B6D4] transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleCapturePagePublish(page.id)}
                      className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${
                        page.published ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-slate-300'
                      }`}
                      title={page.published ? 'Dépublier' : 'Publier'}
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCopyLink(page.id)}
                      className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Copier le lien"
                    >
                      {copiedId === page.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </motion.button>
                    <div className="flex-1" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirm(page.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TEMPLATE GALLERY DIALOG                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="bg-[#0a0f1e] border-white/10 text-white max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 flex items-center justify-center">
                <LayoutTemplate className="w-4 h-4 text-[#06B6D4]" />
              </div>
              Choisir un modèle
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-400 -mt-2 mb-4">
            Sélectionnez un modèle prêt à l&apos;emploi pour créer votre page de capture en quelques clics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templateTypes.map((type, i) => {
              const config = templateConfig[type];
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                  onClick={() => handleSelectTemplate(type)}
                >
                  {/* Template Preview */}
                  <div
                    className={`h-40 bg-gradient-to-br ${config.gradient} flex flex-col items-center justify-center gap-3 relative overflow-hidden`}
                  >
                    {/* Decorative elements */}
                    <div
                      className="absolute -right-8 -top-8 w-24 h-24 rounded-full"
                      style={{ backgroundColor: config.accentColor, opacity: 0.08 }}
                    />
                    <div
                      className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full"
                      style={{ backgroundColor: config.accentColor, opacity: 0.05 }}
                    />
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage: `radial-gradient(circle at 30% 50%, ${config.accentColor}, transparent 70%)`,
                      }}
                    />

                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10"
                      style={{ backgroundColor: `${config.accentColor}15` }}
                    >
                      <span style={{ color: config.accentColor }}>{config.icon}</span>
                    </div>
                    <span
                      className="text-sm font-bold relative z-10"
                      style={{ color: config.accentColor }}
                    >
                      {config.label}
                    </span>
                  </div>

                  {/* Template Info */}
                  <div className="p-4 bg-[#0a0f1e] space-y-3">
                    <p className="text-xs text-slate-400 line-clamp-2">{config.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                      style={{
                        backgroundColor: `${config.accentColor}15`,
                        color: config.accentColor,
                        border: `1px solid ${config.accentColor}25`,
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Utiliser ce modèle
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CREATE / EDIT PAGE DIALOG                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={showEditor} onOpenChange={(open) => { setShowEditor(open); if (!open) { setEditingId(null); } }}>
        <DialogContent className="bg-[#0a0f1e] border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/15 flex items-center justify-center">
                <Pencil className="w-4 h-4 text-[#06B6D4]" />
              </div>
              {editingId ? 'Modifier la page' : 'Créer une page de capture'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Template type (read-only after creation) */}
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-medium">Type de modèle</Label>
              <div className="flex items-center gap-2">
                <Badge
                  className="border-0 text-xs font-semibold py-1 px-3"
                  style={{
                    backgroundColor: `${templateConfig[form.template].accentColor}15`,
                    color: templateConfig[form.template].accentColor,
                  }}
                >
                  {templateConfig[form.template].icon}
                  <span className="ml-1.5">{templateConfig[form.template].label}</span>
                </Badge>
                {editingId && (
                  <span className="text-[10px] text-slate-500">(non modifiable)</span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label className="text-slate-300 text-xs font-medium">Titre de la page *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Sommet Digital 2026"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#06B6D4]/50"
              />
            </div>

            {/* Headline & Subheadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs font-medium">Titre principal</Label>
                <Input
                  value={form.headline}
                  onChange={(e) => setForm(prev => ({ ...prev, headline: e.target.value }))}
                  placeholder="Ex: Le Plus Grand Rassemblement Digital"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#06B6D4]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs font-medium">Sous-titre</Label>
                <Textarea
                  value={form.subheadline}
                  onChange={(e) => setForm(prev => ({ ...prev, subheadline: e.target.value }))}
                  placeholder="Ex: Rejoignez 500+ leaders du digital..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#06B6D4]/50 min-h-[38px] resize-none"
                  rows={1}
                />
              </div>
            </div>

            {/* CTA & Cover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs font-medium">Texte du bouton CTA</Label>
                <Input
                  value={form.ctaText}
                  onChange={(e) => setForm(prev => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="Ex: Réserver Ma Place"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#06B6D4]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs font-medium">URL de l&apos;image de couverture</Label>
                <Input
                  value={form.coverImage}
                  onChange={(e) => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#06B6D4]/50"
                />
              </div>
            </div>

            {/* Form Fields Selector */}
            <div className="space-y-3">
              <Label className="text-slate-300 text-xs font-medium">Champs du formulaire</Label>
              <div className="flex flex-wrap gap-2">
                {fieldOptions.map((field) => (
                  <label
                    key={field.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-xs ${
                      form.fields.includes(field.id)
                        ? 'border-[#06B6D4]/30 bg-[#06B6D4]/10 text-[#06B6D4]'
                        : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Checkbox
                      checked={form.fields.includes(field.id)}
                      onCheckedChange={() => toggleField(field.id)}
                      className="data-[state=checked]:bg-[#06B6D4] data-[state=checked]:border-[#06B6D4] data-[state=checked]:text-[#06080f]"
                    />
                    {field.icon}
                    {field.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-slate-300 text-xs font-medium flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" /> Couleur de fond
                </Label>
                <div className="flex flex-wrap gap-2">
                  {bgPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => setForm(prev => ({ ...prev, backgroundColor: color }))}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${
                        form.backgroundColor === color ? 'border-[#06B6D4] scale-110' : 'border-transparent hover:border-white/20'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-slate-300 text-xs font-medium flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Couleur d&apos;accent
                </Label>
                <div className="flex flex-wrap gap-2">
                  {accentPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => setForm(prev => ({ ...prev, accentColor: color }))}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${
                        form.accentColor === color ? 'border-white scale-110' : 'border-transparent hover:border-white/20'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview bar */}
            <div className="rounded-xl overflow-hidden border border-white/5">
              <p className="text-[10px] text-slate-500 px-3 py-1.5 bg-white/[0.02] border-b border-white/5">
                Aperçu des couleurs
              </p>
              <div
                className="h-16 flex items-center justify-center gap-3"
                style={{ backgroundColor: form.backgroundColor }}
              >
                <span className="text-xs font-medium text-white/60">Exemple</span>
                <button
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-[#06080f]"
                  style={{ backgroundColor: form.accentColor }}
                >
                  {form.ctaText || "S'inscrire"}
                </button>
              </div>
            </div>

            {/* Linked Event & Sequence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs font-medium flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Événement lié
                </Label>
                <Select
                  value={form.linkedEventId || 'none'}
                  onValueChange={(val) => setForm(prev => ({ ...prev, linkedEventId: val === 'none' ? '' : val }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Aucun événement" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F172A] border-white/10">
                    <SelectItem value="none" className="text-slate-400">Aucun événement</SelectItem>
                    {evenements.map((evt) => (
                      <SelectItem key={evt.id} value={evt.id} className="text-white">
                        {evt.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs font-medium flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" /> Séquence d&apos;auto-inscription
                </Label>
                <Select
                  value={form.linkedSequenceId || 'none'}
                  onValueChange={(val) => setForm(prev => ({ ...prev, linkedSequenceId: val === 'none' ? '' : val }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Aucune séquence" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F172A] border-white/10">
                    <SelectItem value="none" className="text-slate-400">Aucune séquence</SelectItem>
                    {sequences.map((seq) => (
                      <SelectItem key={seq.id} value={seq.id} className="text-white">
                        {seq.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <DialogFooter className="flex-row gap-3 pt-4 border-t border-white/5">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-white hover:bg-white/5"
              >
                Annuler
              </Button>
            </DialogClose>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleSave(false)}
                disabled={!form.title.trim()}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/10"
              >
                {editingId ? 'Enregistrer' : 'Enregistrer en brouillon'}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleSave(true)}
                disabled={!form.title.trim()}
                className="bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-[#06080f] font-semibold hover:from-[#22D3EE] hover:to-[#06B6D4] shadow-lg shadow-[#06B6D4]/20"
              >
                <Globe className="w-4 h-4 mr-2" />
                {editingId ? 'Mettre à jour & Publier' : 'Créer & Publier'}
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DELETE CONFIRMATION DIALOG                                     */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent className="bg-[#0a0f1e] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Supprimer la page
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-400">
            Êtes-vous sûr de vouloir supprimer cette page de capture ? Cette action est irréversible.
          </p>
          <DialogFooter className="flex-row gap-3">
            <DialogClose asChild>
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5">
                Annuler
              </Button>
            </DialogClose>
            <Button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
