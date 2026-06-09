'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, Evenement } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Calendar, MapPin, Users, QrCode, Bell, Clock, Globe, Video,
  Plus, Edit3, Trash2, Eye, Send, X, DollarSign, Link2,
  ChevronRight, Phone, CheckCircle2, XCircle, AlertCircle, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Status Configuration ───
const statusConfig: Record<Evenement['status'], { label: string; color: string; bg: string }> = {
  'à_venir': { label: 'À venir', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  'en_cours': { label: 'En cours', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  'terminé': { label: 'Terminé', color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' },
  'annulé': { label: 'Annulé', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
};

const filterTabs: { value: string; label: string }[] = [
  { value: 'tous', label: 'Tous' },
  { value: 'à_venir', label: 'À venir' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'terminé', label: 'Terminé' },
  { value: 'annulé', label: 'Annulé' },
];

// ─── Mock Registration Data ───
interface Registration {
  id: string;
  name: string;
  phone: string;
  date: string;
  status: 'confirmé' | 'en_attente' | 'annulé';
}

const mockRegistrations: Registration[] = [
  { id: 'r1', name: 'Amadou Diallo', phone: '+221 77 123 4567', date: '2026-06-05', status: 'confirmé' },
  { id: 'r2', name: 'Fatou Ndiaye', phone: '+221 78 987 6543', date: '2026-06-07', status: 'confirmé' },
  { id: 'r3', name: 'Kouamé Yao', phone: '+225 07 12 34 56', date: '2026-06-10', status: 'en_attente' },
  { id: 'r4', name: 'Marie Toure', phone: '+223 76 54 32 10', date: '2026-06-12', status: 'confirmé' },
  { id: 'r5', name: 'Ibrahim Keita', phone: '+223 65 43 21 09', date: '2026-06-14', status: 'annulé' },
  { id: 'r6', name: 'Aïcha Bamba', phone: '+225 05 98 76 54', date: '2026-06-15', status: 'confirmé' },
  { id: 'r7', name: 'Ousmane Sy', phone: '+223 79 11 22 33', date: '2026-06-16', status: 'en_attente' },
  { id: 'r8', name: 'Aminata Dabo', phone: '+221 76 44 55 66', date: '2026-06-18', status: 'confirmé' },
];

// ─── Default New Event ───
function createDefaultEvenement(): Evenement {
  return {
    id: '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    isOnline: false,
    onlineLink: '',
    coverImage: '',
    price: 0,
    currency: 'FCFA',
    maxAttendees: 50,
    registeredCount: 0,
    qrCodeEnabled: false,
    status: 'à_venir',
    createdAt: new Date().toISOString().split('T')[0],
  };
}

// ─── Format Date in French ───
function formatDateFR(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── Main Component ───
export default function Evenements() {
  const { evenements, addEvenement, updateEvenement, deleteEvenement, capturePages, sequences } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evenement | null>(null);
  const [formData, setFormData] = useState<Evenement>(createDefaultEvenement());
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (statusFilter === 'tous') return evenements;
    return evenements.filter((e) => e.status === statusFilter);
  }, [evenements, statusFilter]);

  // Open dialog for new event
  const handleNewEvent = () => {
    setEditingEvent(null);
    setFormData(createDefaultEvenement());
    setDialogOpen(true);
  };

  // Open dialog for editing
  const handleEdit = (evt: Evenement) => {
    setEditingEvent(evt);
    setFormData({ ...evt });
    setDialogOpen(true);
  };

  // Open detail sheet
  const handleViewDetail = (evt: Evenement) => {
    setSelectedEvent(evt);
    setDetailSheetOpen(true);
  };

  // Delete event
  const handleDelete = (id: string) => {
    deleteEvenement(id);
    setDeleteConfirmId(null);
    toast.success('Événement supprimé');
  };

  // Save event (create or update)
  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error('Veuillez entrer un titre pour l\'événement');
      return;
    }
    if (!formData.date) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    if (editingEvent) {
      updateEvenement(editingEvent.id, { ...formData });
      toast.success('Événement mis à jour');
    } else {
      addEvenement({
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      });
      toast.success('Événement créé avec succès');
    }
    setDialogOpen(false);
  };

  // Form update helper
  const updateForm = (key: keyof Evenement, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Send reminder
  const handleSendReminder = () => {
    toast.success('Rappel envoyé à tous les inscrits par SMS/WhatsApp');
  };

  // Get capture page name
  const getCapturePageName = (id?: string) => {
    if (!id) return null;
    const page = capturePages.find((p) => p.id === id);
    return page?.title || null;
  };

  // Get sequence name
  const getSequenceName = (id?: string) => {
    if (!id) return null;
    const seq = sequences.find((s) => s.id === id);
    return seq?.name || null;
  };

  // Calculate registration percentage
  const getRegistrationPct = (evt: Evenement) => {
    if (evt.maxAttendees === 0) return 0;
    return Math.min(Math.round((evt.registeredCount / evt.maxAttendees) * 100), 100);
  };

  // Calculate revenue
  const getRevenue = (evt: Evenement) => {
    return evt.registeredCount * evt.price;
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Bar ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm">
            {evenements.length} événement{evenements.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNewEvent}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-[#06080f] font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-[#06B6D4]/20 transition-shadow"
        >
          <Plus className="w-4 h-4" /> Nouvel Événement
        </motion.button>
      </div>

      {/* ─── Status Filter Tabs ─── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          const count = tab.value === 'tous'
            ? evenements.length
            : evenements.filter((e) => e.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20'
                  : 'glass text-slate-400 hover:text-white hover:border-white/10'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ─── Event Cards Grid ─── */}
      {filteredEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#06B6D4]/10 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-[#06B6D4]/50" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300">Aucun événement</h3>
          <p className="text-sm text-slate-500 mt-1">Créez votre premier événement pour commencer</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((evt, i) => {
              const sConfig = statusConfig[evt.status];
              const regPct = getRegistrationPct(evt);
              const capturePageName = getCapturePageName(evt.capturePageId);
              const isFull = evt.registeredCount >= evt.maxAttendees;

              return (
                <motion.div
                  key={evt.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card className="bg-[#0c1220] border border-white/[0.06] hover:border-[#06B6D4]/20 transition-all duration-300 group overflow-hidden">
                    {/* Cover Image with Gradient Overlay */}
                    <div
                      className="relative h-36 bg-gradient-to-br from-[#0F172A] to-[#1E293B] overflow-hidden cursor-pointer"
                      onClick={() => handleViewDetail(evt)}
                    >
                      {evt.coverImage ? (
                        <img
                          src={evt.coverImage}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-10 h-10 text-[#06B6D4]/20" />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1220] via-transparent to-transparent" />

                      {/* Status Badge */}
                      <Badge
                        className="absolute top-3 left-3 shrink-0 text-[10px] font-semibold px-2.5 py-0.5 border-0"
                        style={{ background: sConfig.bg, color: sConfig.color }}
                      >
                        {sConfig.label}
                      </Badge>

                      {/* QR Code Badge */}
                      {evt.qrCodeEnabled && (
                        <Badge className="absolute top-3 right-3 bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/20 text-[10px] font-semibold px-2 py-0.5 gap-1">
                          <QrCode className="w-3 h-3" /> QR
                        </Badge>
                      )}

                      {/* Price Tag */}
                      <div className="absolute bottom-3 right-3">
                        <span className="text-sm font-bold text-[#06B6D4] bg-[#0c1220]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                          {evt.price > 0 ? `${evt.price.toLocaleString()} ${evt.currency}` : 'Gratuit'}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Title */}
                      <h3
                        className="text-sm font-bold text-white leading-tight line-clamp-2 cursor-pointer hover:text-[#06B6D4] transition-colors"
                        onClick={() => handleViewDetail(evt)}
                      >
                        {evt.title}
                      </h3>

                      {/* Date & Time */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDateFR(evt.date)}</span>
                        <span className="text-slate-600">·</span>
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{evt.time}</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        {evt.isOnline ? (
                          <>
                            <Video className="w-3.5 h-3.5 text-emerald-400" />
                            <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0 font-medium">
                              En ligne
                            </Badge>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span className="truncate">{evt.location}</span>
                          </>
                        )}
                      </div>

                      {/* Registration Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Users className="w-3 h-3" />
                            {evt.registeredCount}/{evt.maxAttendees} inscrits
                          </span>
                          <span className={`font-semibold ${isFull ? 'text-red-400' : 'text-[#10B981]'}`}>
                            {regPct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${regPct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className={`h-full rounded-full ${
                              isFull
                                ? 'bg-gradient-to-r from-red-500 to-red-400'
                                : 'bg-gradient-to-r from-[#10B981] to-emerald-400'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Linked Capture Page */}
                      {capturePageName && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Link2 className="w-3 h-3" />
                          <span className="truncate">Page : {capturePageName}</span>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex items-center gap-1 pt-2 border-t border-white/[0.04]">
                        <button
                          onClick={() => handleViewDetail(evt)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-[#10B981] hover:bg-[#10B981]/10 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inscrits
                        </button>
                        <button
                          onClick={handleSendReminder}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-all"
                        >
                          <Bell className="w-3.5 h-3.5" /> Rappel
                        </button>
                        <button
                          onClick={() => handleEdit(evt)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Modifier
                        </button>
                        {deleteConfirmId === evt.id ? (
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              onClick={() => handleDelete(evt.id)}
                              className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded-lg text-[10px] text-slate-400 hover:text-white transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(evt.id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ─── Create/Edit Event Dialog ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0c1220] border-white/[0.08] text-white max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#06B6D4]" />
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel Événement'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Titre de l'événement</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateForm('title', e.target.value)}
                placeholder="Ex: Sommet Digital Afrique 2026"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Décrivez votre événement..."
                rows={3}
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20 resize-none"
              />
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date
                </Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateForm('date', e.target.value)}
                  className="bg-white/[0.04] border-white/[0.08] text-white focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Heure
                </Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateForm('time', e.target.value)}
                  className="bg-white/[0.04] border-white/[0.08] text-white focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Lieu
              </Label>
              <Input
                value={formData.location}
                onChange={(e) => updateForm('location', e.target.value)}
                placeholder="Ex: Palais de la Culture, Abidjan"
                disabled={formData.isOnline}
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20 disabled:opacity-40"
              />
            </div>

            {/* Online Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Événement en ligne</p>
                  <p className="text-[11px] text-slate-500">Activez pour un événement virtuel</p>
                </div>
              </div>
              <Switch
                checked={formData.isOnline}
                onCheckedChange={(checked) => {
                  updateForm('isOnline', checked);
                  if (checked) updateForm('location', 'En ligne');
                  else updateForm('location', '');
                }}
              />
            </div>

            {/* Online Link (when online) */}
            <AnimatePresence>
              {formData.isOnline && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label className="text-sm text-slate-300 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" /> Lien en ligne
                  </Label>
                  <Input
                    value={formData.onlineLink || ''}
                    onChange={(e) => updateForm('onlineLink', e.target.value)}
                    placeholder="https://zoom.us/..."
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Image de couverture (URL)</Label>
              <Input
                value={formData.coverImage}
                onChange={(e) => updateForm('coverImage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20"
              />
              {formData.coverImage && (
                <div className="h-24 rounded-lg overflow-hidden border border-white/[0.06] mt-2">
                  <img
                    src={formData.coverImage}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Price & Currency Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> Prix
                </Label>
                <Input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => updateForm('price', Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-slate-300">Devise</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(val) => updateForm('currency', val)}
                >
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F172A] border-white/[0.08]">
                    <SelectItem value="FCFA" className="text-slate-200 focus:bg-white/[0.06] focus:text-white">FCFA</SelectItem>
                    <SelectItem value="EUR" className="text-slate-200 focus:bg-white/[0.06] focus:text-white">EUR</SelectItem>
                    <SelectItem value="USD" className="text-slate-200 focus:bg-white/[0.06] focus:text-white">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Max Attendees */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Nombre maximum de participants
              </Label>
              <Input
                type="number"
                value={formData.maxAttendees || ''}
                onChange={(e) => updateForm('maxAttendees', Number(e.target.value))}
                placeholder="50"
                min={1}
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20"
              />
            </div>

            {/* QR Code Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#06B6D4]" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Code QR</p>
                  <p className="text-[11px] text-slate-500">Générer un QR code pour le check-in</p>
                </div>
              </div>
              <Switch
                checked={formData.qrCodeEnabled}
                onCheckedChange={(checked) => updateForm('qrCodeEnabled', checked)}
              />
            </div>

            {/* Link to Capture Page */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" /> Page de capture liée
              </Label>
              <Select
                value={formData.capturePageId || 'none'}
                onValueChange={(val) => updateForm('capturePageId', val === 'none' ? undefined : val)}
              >
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Sélectionner une page" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-white/[0.08]">
                  <SelectItem value="none" className="text-slate-200 focus:bg-white/[0.06] focus:text-white">Aucune</SelectItem>
                  {capturePages.map((page) => (
                    <SelectItem key={page.id} value={page.id} className="text-slate-200 focus:bg-white/[0.06] focus:text-white">
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Link to Reminder Sequence */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Séquence de rappel
              </Label>
              <Select
                value={formData.reminderSequenceId || 'none'}
                onValueChange={(val) => updateForm('reminderSequenceId', val === 'none' ? undefined : val)}
              >
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Sélectionner une séquence" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-white/[0.08]">
                  <SelectItem value="none" className="text-slate-200 focus:bg-white/[0.06] focus:text-white">Aucune</SelectItem>
                  {sequences.map((seq) => (
                    <SelectItem key={seq.id} value={seq.id} className="text-slate-200 focus:bg-white/[0.06] focus:text-white">
                      {seq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status (only when editing) */}
            {editingEvent && (
              <div className="space-y-2">
                <Label className="text-sm text-slate-300">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => updateForm('status', val as Evenement['status'])}
                >
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F172A] border-white/[0.08]">
                    <SelectItem value="à_venir" className="text-slate-200 focus:bg-white/[0.06] focus:text-white">À venir</SelectItem>
                    <SelectItem value="en_cours" className="text-slate-200 focus:bg-white/[0.06] focus:text-white">En cours</SelectItem>
                    <SelectItem value="terminé" className="text-slate-200 focus:bg-white/[0.06] focus:text-white">Terminé</SelectItem>
                    <SelectItem value="annulé" className="text-slate-200 focus:bg-white/[0.06] focus:text-white">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.04]">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04]"
              >
                Annuler
              </Button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-[#06080f] font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-[#06B6D4]/20 transition-shadow"
              >
                <Plus className="w-4 h-4" /> {editingEvent ? 'Mettre à jour' : 'Créer l\'événement'}
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Event Detail Sheet ─── */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent side="right" className="bg-[#0c1220] border-white/[0.08] text-white w-full sm:max-w-xl overflow-y-auto custom-scrollbar">
          {selectedEvent && (
            <div className="space-y-6">
              <SheetHeader className="p-0">
                <SheetTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#06B6D4]" />
                  Détail de l'événement
                </SheetTitle>
              </SheetHeader>

              {/* Cover Image */}
              <div className="relative h-44 rounded-xl overflow-hidden">
                {selectedEvent.coverImage ? (
                  <img
                    src={selectedEvent.coverImage}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-[#06B6D4]/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1220] via-transparent to-transparent" />
                <Badge
                  className="absolute top-3 left-3 shrink-0 text-[10px] font-semibold px-2.5 py-0.5 border-0"
                  style={{ background: statusConfig[selectedEvent.status].bg, color: statusConfig[selectedEvent.status].color }}
                >
                  {statusConfig[selectedEvent.status].label}
                </Badge>
              </div>

              {/* Event Info */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">{selectedEvent.title}</h2>
                {selectedEvent.description && (
                  <p className="text-sm text-slate-400 leading-relaxed">{selectedEvent.description}</p>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <Calendar className="w-4 h-4 text-[#06B6D4]" />
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-sm font-medium text-white">{formatDateFR(selectedEvent.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <Clock className="w-4 h-4 text-[#06B6D4]" />
                    <div>
                      <p className="text-xs text-slate-500">Heure</p>
                      <p className="text-sm font-medium text-white">{selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    {selectedEvent.isOnline ? (
                      <Video className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <MapPin className="w-4 h-4 text-[#06B6D4]" />
                    )}
                    <div>
                      <p className="text-xs text-slate-500">Lieu</p>
                      <p className="text-sm font-medium text-white">
                        {selectedEvent.isOnline ? 'En ligne' : selectedEvent.location}
                      </p>
                      {selectedEvent.isOnline && selectedEvent.onlineLink && (
                        <a
                          href={selectedEvent.onlineLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#06B6D4] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Globe className="w-3 h-3" /> {selectedEvent.onlineLink}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <DollarSign className="w-4 h-4 text-[#06B6D4]" />
                    <div>
                      <p className="text-xs text-slate-500">Prix</p>
                      <p className="text-sm font-bold text-[#06B6D4]">
                        {selectedEvent.price > 0 ? `${selectedEvent.price.toLocaleString()} ${selectedEvent.currency}` : 'Gratuit'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-xl bg-[#06B6D4]/5 border border-[#06B6D4]/10 text-center">
                    <p className="text-lg font-bold text-[#06B6D4]">{getRegistrationPct(selectedEvent)}%</p>
                    <p className="text-[10px] text-slate-500 font-medium">Taux d'inscription</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#10B981]/5 border border-[#10B981]/10 text-center">
                    <p className="text-lg font-bold text-[#10B981]">{getRevenue(selectedEvent).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Revenus (FCFA)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                    <p className="text-lg font-bold text-white">{selectedEvent.registeredCount}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Inscrits</p>
                  </div>
                </div>

                {/* Registration Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Capacité
                    </span>
                    <span className="text-white font-medium">
                      {selectedEvent.registeredCount} / {selectedEvent.maxAttendees}
                    </span>
                  </div>
                  <Progress
                    value={getRegistrationPct(selectedEvent)}
                    className="h-2 bg-white/[0.06]"
                  />
                </div>

                {/* Linked Items */}
                {getCapturePageName(selectedEvent.capturePageId) && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <Link2 className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Page de capture</p>
                      <p className="text-sm text-white">{getCapturePageName(selectedEvent.capturePageId)}</p>
                    </div>
                  </div>
                )}
                {getSequenceName(selectedEvent.reminderSequenceId) && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <Bell className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Séquence de rappel</p>
                      <p className="text-sm text-white">{getSequenceName(selectedEvent.reminderSequenceId)}</p>
                    </div>
                  </div>
                )}

                {/* QR Code Display */}
                {selectedEvent.qrCodeEnabled && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#06B6D4]" /> Code QR de check-in
                    </h3>
                    <div className="flex items-center justify-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center p-3">
                        {/* Simulated QR Code Pattern */}
                        <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-[2px]">
                          {Array.from({ length: 64 }).map((_, idx) => {
                            const row = Math.floor(idx / 8);
                            const col = idx % 8;
                            const isCorner = (row < 3 && col < 3) || (row < 3 && col > 4) || (row > 4 && col < 3);
                            const isFilled = isCorner || Math.random() > 0.5;
                            return (
                              <div
                                key={idx}
                                className={`rounded-[1px] ${isFilled ? 'bg-[#0c1220]' : 'bg-white'}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 text-center">
                      Scannez ce code pour le check-in à l'événement
                    </p>
                  </div>
                )}

                {/* Registration List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#06B6D4]" /> Liste des inscrits
                    </h3>
                    <Badge className="bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 text-[10px] font-semibold">
                      {mockRegistrations.length} inscrits
                    </Badge>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                    {mockRegistrations.map((reg) => {
                      const statusIcon = reg.status === 'confirmé'
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        : reg.status === 'en_attente'
                          ? <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          : <XCircle className="w-3.5 h-3.5 text-red-400" />;
                      const statusLabel = reg.status === 'confirmé'
                        ? 'Confirmé'
                        : reg.status === 'en_attente'
                          ? 'En attente'
                          : 'Annulé';
                      const statusColor = reg.status === 'confirmé'
                        ? 'text-emerald-400'
                        : reg.status === 'en_attente'
                          ? 'text-amber-400'
                          : 'text-red-400';
                      return (
                        <div
                          key={reg.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#06B6D4]/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-[#06B6D4]">
                              {reg.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{reg.name}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {reg.phone}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-0.5 shrink-0">
                            <span className={`text-[10px] font-medium flex items-center gap-1 ${statusColor}`}>
                              {statusIcon} {statusLabel}
                            </span>
                            <span className="text-[10px] text-slate-600">{formatDateFR(reg.date)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.04]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendReminder}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-[#06080f] font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#06B6D4]/20 transition-shadow"
                  >
                    <Send className="w-4 h-4" /> Envoyer un rappel (SMS/WA)
                  </motion.button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDetailSheetOpen(false);
                        handleEdit(selectedEvent);
                      }}
                      className="border-[#06B6D4]/20 text-[#06B6D4] hover:bg-[#06B6D4]/10 hover:text-[#06B6D4]"
                    >
                      <Edit3 className="w-4 h-4 mr-2" /> Modifier
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDetailSheetOpen(false);
                        setDeleteConfirmId(selectedEvent.id);
                      }}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
