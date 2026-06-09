'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, Campaign, CampaignMessage, ChannelType, CampaignStatus } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare, Smartphone, Send, Clock, Copy, Trash2, Plus, Zap,
  Edit3, Users, Calendar, X, Beaker, ImageIcon, Link2, Type
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Status Config ───
const statusConfig: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  brouillon: { label: 'Brouillon', color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' },
  planifiée: { label: 'Planifiée', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  envoyée: { label: 'Envoyée', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  en_cours: { label: 'En cours', color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
  terminée: { label: 'Terminée', color: '#94A3B8', bg: 'rgba(148,163,184,0.12)' },
};

const filterTabs: { value: string; label: string }[] = [
  { value: 'tous', label: 'Tous' },
  { value: 'brouillon', label: 'Brouillon' },
  { value: 'planifiée', label: 'Planifiée' },
  { value: 'envoyée', label: 'Envoyée' },
  { value: 'terminée', label: 'Terminée' },
];

const segmentOptions = ['Tous', 'Prospects chauds', 'Prospects froids', 'Clients', 'Nouveaux'];

// ─── Channel Badge ───
function ChannelBadge({ channel }: { channel: ChannelType }) {
  if (channel === 'sms') {
    return (
      <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 gap-1 font-medium">
        <Smartphone className="w-3 h-3" /> SMS
      </Badge>
    );
  }
  if (channel === 'whatsapp') {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 gap-1 font-medium">
        <MessageSquare className="w-3 h-3" /> WhatsApp
      </Badge>
    );
  }
  return (
    <div className="flex gap-1.5">
      <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 gap-1 font-medium">
        <Smartphone className="w-3 h-3" /> SMS
      </Badge>
      <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 gap-1 font-medium">
        <MessageSquare className="w-3 h-3" /> WA
      </Badge>
    </div>
  );
}

// ─── Stat Box ───
function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5" style={{ background: `${color}10` }}>
      <span className="text-base font-bold" style={{ color }}>{value}</span>
      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
    </div>
  );
}

// ─── Empty Message Object ───
function createEmptyMessage(channel: 'sms' | 'whatsapp', variant?: 'A' | 'B'): CampaignMessage {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    content: '',
    channel,
    variant,
  };
}

// ─── Default New Campaign ───
function createDefaultCampaign(): Campaign {
  return {
    id: '',
    name: '',
    channel: 'sms',
    status: 'brouillon',
    targetSegment: 'Tous',
    targetTags: [],
    messages: [createEmptyMessage('sms')],
    scheduledAt: '',
    sentCount: 0,
    deliveredCount: 0,
    readCount: 0,
    replyCount: 0,
    abTestEnabled: false,
    createdAt: new Date().toISOString().split('T')[0],
  };
}

// ─── Main Component ───
export default function Campagnes() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<Campaign>(createDefaultCampaign());
  const [tagInput, setTagInput] = useState('');
  const [messageTab, setMessageTab] = useState<'sms' | 'whatsapp'>('sms');
  const [variantTab, setVariantTab] = useState<'A' | 'B'>('A');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now');

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    if (statusFilter === 'tous') return campaigns;
    return campaigns.filter((c) => c.status === statusFilter);
  }, [campaigns, statusFilter]);

  // Open dialog for new campaign
  const handleNewCampaign = () => {
    setEditingCampaign(null);
    setFormData(createDefaultCampaign());
    setMessageTab('sms');
    setVariantTab('A');
    setScheduleMode('now');
    setTagInput('');
    setDialogOpen(true);
  };

  // Open dialog for editing
  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({ ...campaign, messages: campaign.messages.length > 0 ? [...campaign.messages] : [createEmptyMessage(campaign.channel === 'both' ? 'sms' : campaign.channel)] });
    setMessageTab(formData.messages[0]?.channel || 'sms');
    setVariantTab('A');
    setScheduleMode(campaign.scheduledAt ? 'schedule' : 'now');
    setTagInput('');
    setDialogOpen(true);
  };

  // Duplicate campaign
  const handleDuplicate = (campaign: Campaign) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (copie)`,
      status: 'brouillon',
      sentCount: 0,
      deliveredCount: 0,
      readCount: 0,
      replyCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      messages: campaign.messages.map((m) => ({ ...m, id: Date.now().toString() + Math.random().toString(36).slice(2, 6) })),
    };
    addCampaign(newCampaign);
    toast.success('Campagne dupliquée');
  };

  // Delete campaign
  const handleDelete = (id: string) => {
    deleteCampaign(id);
    toast.success('Campagne supprimée');
  };

  // Save campaign (create or update)
  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Veuillez entrer un nom de campagne');
      return;
    }

    // Build final messages array based on channel and AB test
    let finalMessages = [...formData.messages];

    // Ensure messages exist for both channels if 'both'
    if (formData.channel === 'both' || formData.channel === 'whatsapp') {
      const hasWhatsApp = finalMessages.some((m) => m.channel === 'whatsapp');
      if (!hasWhatsApp) {
        finalMessages.push(createEmptyMessage('whatsapp'));
      }
    }
    if (formData.channel === 'both' || formData.channel === 'sms') {
      const hasSMS = finalMessages.some((m) => m.channel === 'sms');
      if (!hasSMS) {
        finalMessages.push(createEmptyMessage('sms'));
      }
    }

    // A/B test: ensure variant B messages exist
    if (formData.abTestEnabled) {
      const hasVariantB = finalMessages.some((m) => m.variant === 'B');
      if (!hasVariantB) {
        const variantAMessage = finalMessages.find((m) => m.variant === 'A' || !m.variant);
        if (variantAMessage) {
          finalMessages.push({ ...variantAMessage, id: Date.now().toString(), variant: 'B', content: '' });
        }
      }
    }

    // Set status
    let status: CampaignStatus = formData.status;
    if (scheduleMode === 'now' && editingCampaign === null) {
      status = 'envoyée';
    } else if (scheduleMode === 'schedule' && formData.scheduledAt) {
      status = 'planifiée';
    }

    if (editingCampaign) {
      updateCampaign(editingCampaign.id, {
        ...formData,
        messages: finalMessages,
        status,
      });
      toast.success('Campagne mise à jour');
    } else {
      addCampaign({
        ...formData,
        id: Date.now().toString(),
        messages: finalMessages,
        status,
        createdAt: new Date().toISOString().split('T')[0],
      });
      toast.success('Campagne créée');
    }
    setDialogOpen(false);
  };

  // Form update helpers
  const updateForm = (key: keyof Campaign, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateMessage = (messageId: string, updates: Partial<CampaignMessage>) => {
    setFormData((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => (m.id === messageId ? { ...m, ...updates } : m)),
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.targetTags.includes(tag)) {
      updateForm('targetTags', [...formData.targetTags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    updateForm('targetTags', formData.targetTags.filter((t) => t !== tag));
  };

  // Add WhatsApp button
  const addWhatsAppButton = (messageId: string) => {
    const msg = formData.messages.find((m) => m.id === messageId);
    const currentButtons = msg?.buttons || [];
    updateMessage(messageId, { buttons: [...currentButtons, { label: '', url: '' }] });
  };

  const updateWhatsAppButton = (messageId: string, index: number, field: 'label' | 'url', value: string) => {
    const msg = formData.messages.find((m) => m.id === messageId);
    if (!msg?.buttons) return;
    const updated = [...msg.buttons];
    updated[index] = { ...updated[index], [field]: value };
    updateMessage(messageId, { buttons: updated });
  };

  const removeWhatsAppButton = (messageId: string, index: number) => {
    const msg = formData.messages.find((m) => m.id === messageId);
    if (!msg?.buttons) return;
    updateMessage(messageId, { buttons: msg.buttons.filter((_, i) => i !== index) });
  };

  // Get message for current tab + variant
  const getActiveMessage = (): CampaignMessage | undefined => {
    const channel = messageTab;
    const variant = formData.abTestEnabled ? variantTab : undefined;
    return formData.messages.find((m) => {
      if (m.channel !== channel) return false;
      if (variant) return m.variant === variant;
      return !m.variant || m.variant === 'A';
    });
  };

  // Get or create message
  const getOrCreateMessage = (): CampaignMessage => {
    const existing = getActiveMessage();
    if (existing) return existing;
    // Create one
    const newMsg = createEmptyMessage(messageTab, formData.abTestEnabled ? variantTab : undefined);
    setFormData((prev) => ({ ...prev, messages: [...prev.messages, newMsg] }));
    return newMsg;
  };

  const activeMessage = getOrCreateMessage();

  // Character limit
  const charLimit = messageTab === 'sms' ? 160 : 1024;
  const charCount = activeMessage?.content?.length || 0;

  // Delivery rate
  const getDeliveryRate = (campaign: Campaign) => {
    if (campaign.sentCount === 0) return 0;
    return Math.round((campaign.deliveredCount / campaign.sentCount) * 100);
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Bar ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm">
            {campaigns.length} campagne{campaigns.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNewCampaign}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-[#06080f] font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-[#06B6D4]/20 transition-shadow"
        >
          <Plus className="w-4 h-4" /> Nouvelle Campagne
        </motion.button>
      </div>

      {/* ─── Status Filter ─── */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.value;
          const count = tab.value === 'tous' ? campaigns.length : campaigns.filter((c) => c.status === tab.value).length;
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

      {/* ─── Campaign Cards Grid ─── */}
      {filteredCampaigns.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#06B6D4]/10 flex items-center justify-center mb-4">
            <Send className="w-8 h-8 text-[#06B6D4]/50" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300">Aucune campagne</h3>
          <p className="text-sm text-slate-500 mt-1">Créez votre première campagne SMS ou WhatsApp</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredCampaigns.map((campaign, i) => {
              const deliveryRate = getDeliveryRate(campaign);
              const sConfig = statusConfig[campaign.status];
              return (
                <motion.div
                  key={campaign.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card className="bg-[#0c1220] border border-white/[0.06] hover:border-[#06B6D4]/20 transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-5 space-y-4">
                      {/* Header: Name + Status */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 flex-1">{campaign.name}</h3>
                        <Badge
                          className="shrink-0 text-[10px] font-semibold px-2 py-0.5 border-0"
                          style={{ background: sConfig.bg, color: sConfig.color }}
                        >
                          {sConfig.label}
                        </Badge>
                      </div>

                      {/* Channel Badges */}
                      <div className="flex items-center gap-2">
                        <ChannelBadge channel={campaign.channel} />
                        {campaign.abTestEnabled && (
                          <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 gap-1 font-medium text-[10px]">
                            <Beaker className="w-3 h-3" /> A/B
                          </Badge>
                        )}
                      </div>

                      {/* Target Segment */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>{campaign.targetSegment}</span>
                        {campaign.targetTags.length > 0 && (
                          <span className="text-slate-500">
                            &middot; {campaign.targetTags.slice(0, 2).join(', ')}
                            {campaign.targetTags.length > 2 ? ` +${campaign.targetTags.length - 2}` : ''}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      {campaign.sentCount > 0 && (
                        <div className="grid grid-cols-4 gap-1.5">
                          <StatBox label="Envoyés" value={campaign.sentCount} color="#06B6D4" />
                          <StatBox label="Livrés" value={campaign.deliveredCount} color="#10B981" />
                          <StatBox label="Lus" value={campaign.readCount} color="#06B6D4" />
                          <StatBox label="Rép." value={campaign.replyCount} color="#F59E0B" />
                        </div>
                      )}

                      {/* Delivery Rate Progress */}
                      {campaign.sentCount > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Taux de livraison</span>
                            <span className="font-semibold text-[#10B981]">{deliveryRate}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${deliveryRate}%` }}
                              transition={{ duration: 0.8, delay: i * 0.05 }}
                              className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-emerald-400"
                            />
                          </div>
                        </div>
                      )}

                      {/* Scheduled Date */}
                      {campaign.scheduledAt && campaign.status === 'planifiée' && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-400/80">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Planifiée : {new Date(campaign.scheduledAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                        <button
                          onClick={() => handleEdit(campaign)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Modifier
                        </button>
                        <button
                          onClick={() => handleDuplicate(campaign)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" /> Dupliquer
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ─── Create/Edit Campaign Dialog ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0c1220] border-white/[0.08] text-white max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#06B6D4]" />
              {editingCampaign ? 'Modifier la campagne' : 'Nouvelle campagne'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Nom de la campagne</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Ex: Lancement Sommet Digital"
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20"
              />
            </div>

            {/* Channel Selector */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Canal</Label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: 'sms' as ChannelType, label: 'SMS', icon: Smartphone, color: '#0EA5E9' },
                  { value: 'whatsapp' as ChannelType, label: 'WhatsApp', icon: MessageSquare, color: '#10B981' },
                  { value: 'both' as ChannelType, label: 'Les deux', icon: Send, color: '#06B6D4' },
                ] as const).map((ch) => (
                  <button
                    key={ch.value}
                    onClick={() => {
                      updateForm('channel', ch.value);
                      if (ch.value === 'whatsapp') setMessageTab('whatsapp');
                      else setMessageTab('sms');
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      formData.channel === ch.value
                        ? 'border-opacity-40 bg-opacity-10'
                        : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] text-slate-400'
                    }`}
                    style={
                      formData.channel === ch.value
                        ? { borderColor: `${ch.color}40`, background: `${ch.color}10`, color: ch.color }
                        : {}
                    }
                  >
                    <ch.icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Segment */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Segment cible</Label>
              <Select
                value={formData.targetSegment}
                onValueChange={(val) => updateForm('targetSegment', val)}
              >
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Sélectionner un segment" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-white/[0.08]">
                  {segmentOptions.map((seg) => (
                    <SelectItem key={seg} value={seg} className="text-slate-200 focus:bg-white/[0.06] focus:text-white">
                      {seg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Target Tags */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Tags cibles</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Ajouter un tag..."
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="border-[#06B6D4]/30 text-[#06B6D4] hover:bg-[#06B6D4]/10 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.targetTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.targetTags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 gap-1 pr-1 font-medium"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Message Composer ─── */}
            <div className="space-y-3">
              <Label className="text-sm text-slate-300 flex items-center gap-2">
                <Type className="w-4 h-4" /> Compositeur de message
              </Label>

              {/* Channel Tab */}
              {(formData.channel === 'both') && (
                <Tabs value={messageTab} onValueChange={(v) => setMessageTab(v as 'sms' | 'whatsapp')}>
                  <TabsList className="bg-white/[0.04] border border-white/[0.06]">
                    <TabsTrigger value="sms" className="data-[state=active]:bg-sky-500/15 data-[state=active]:text-sky-400 text-slate-400">
                      <Smartphone className="w-3.5 h-3.5 mr-1.5" /> SMS
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> WhatsApp
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              {/* A/B Test Variant Tabs */}
              {formData.abTestEnabled && (
                <Tabs value={variantTab} onValueChange={(v) => setVariantTab(v as 'A' | 'B')}>
                  <TabsList className="bg-white/[0.04] border border-white/[0.06]">
                    <TabsTrigger value="A" className="data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 text-slate-400">
                      Variante A
                    </TabsTrigger>
                    <TabsTrigger value="B" className="data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 text-slate-400">
                      Variante B
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              {/* Text Content */}
              <div className="space-y-2">
                <Textarea
                  value={activeMessage?.content || ''}
                  onChange={(e) => {
                    const msgId = activeMessage?.id;
                    if (msgId) updateMessage(msgId, { content: e.target.value });
                  }}
                  placeholder={
                    messageTab === 'sms'
                      ? 'Écrivez votre message SMS...'
                      : 'Écrivez votre message WhatsApp...'
                  }
                  rows={5}
                  className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20 resize-none"
                />
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`${charCount > charLimit ? 'text-red-400' : 'text-slate-500'}`}>
                    {charCount} / {charLimit} caractères
                  </span>
                  {messageTab === 'sms' && charCount > 0 && (
                    <span className="text-slate-500">
                      {Math.ceil(charCount / 160)} SMS
                    </span>
                  )}
                </div>
              </div>

              {/* WhatsApp-specific: Media & Buttons */}
              {messageTab === 'whatsapp' && (
                <div className="space-y-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  {/* Media URL */}
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> Média (optionnel)
                    </Label>
                    <Input
                      value={activeMessage?.mediaUrl || ''}
                      onChange={(e) => {
                        const msgId = activeMessage?.id;
                        if (msgId) updateMessage(msgId, { mediaUrl: e.target.value });
                      }}
                      placeholder="URL de l'image ou document"
                      className="bg-white/[0.04] border-white/[0.06] text-white text-xs placeholder:text-slate-600 h-9 focus:border-[#06B6D4]/40"
                    />
                    {activeMessage?.mediaUrl && (
                      <Select
                        value={activeMessage.mediaType || 'image'}
                        onValueChange={(val: 'image' | 'document' | 'audio') => {
                          const msgId = activeMessage?.id;
                          if (msgId) updateMessage(msgId, { mediaType: val });
                        }}
                      >
                        <SelectTrigger className="bg-white/[0.04] border-white/[0.06] text-white text-xs h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F172A] border-white/[0.08]">
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* WhatsApp Buttons */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5" /> Boutons
                      </Label>
                      <button
                        onClick={() => {
                          if (activeMessage?.id) addWhatsAppButton(activeMessage.id);
                        }}
                        className="text-[10px] text-[#06B6D4] hover:text-[#22D3EE] flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Ajouter
                      </button>
                    </div>
                    {(activeMessage?.buttons || []).map((btn, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          value={btn.label}
                          onChange={(e) => {
                            if (activeMessage?.id) updateWhatsAppButton(activeMessage.id, idx, 'label', e.target.value);
                          }}
                          placeholder="Label"
                          className="bg-white/[0.04] border-white/[0.06] text-white text-xs placeholder:text-slate-600 h-8 flex-1 focus:border-[#06B6D4]/40"
                        />
                        <Input
                          value={btn.url}
                          onChange={(e) => {
                            if (activeMessage?.id) updateWhatsAppButton(activeMessage.id, idx, 'url', e.target.value);
                          }}
                          placeholder="URL"
                          className="bg-white/[0.04] border-white/[0.06] text-white text-xs placeholder:text-slate-600 h-8 flex-1 focus:border-[#06B6D4]/40"
                        />
                        <button
                          onClick={() => {
                            if (activeMessage?.id) removeWhatsAppButton(activeMessage.id, idx);
                          }}
                          className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* A/B Test Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-2">
                <Beaker className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Test A/B</p>
                  <p className="text-[11px] text-slate-500">Comparez deux variantes de message</p>
                </div>
              </div>
              <Switch
                checked={formData.abTestEnabled}
                onCheckedChange={(checked) => {
                  updateForm('abTestEnabled', checked);
                  if (checked) {
                    // Add variant B message if needed
                    const currentChannel = messageTab;
                    const hasVariantB = formData.messages.some((m) => m.channel === currentChannel && m.variant === 'B');
                    if (!hasVariantB) {
                      const newB = createEmptyMessage(currentChannel, 'B');
                      setFormData((prev) => ({ ...prev, messages: [...prev.messages, newB] }));
                    }
                    // Ensure existing messages have variant A
                    setFormData((prev) => ({
                      ...prev,
                      messages: prev.messages.map((m) =>
                        !m.variant && (m.channel === currentChannel) ? { ...m, variant: 'A' } : m
                      ),
                    }));
                  }
                }}
              />
            </div>

            {/* Schedule */}
            <div className="space-y-3">
              <Label className="text-sm text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Envoi
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setScheduleMode('now')}
                  className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    scheduleMode === 'now'
                      ? 'border-[#06B6D4]/40 bg-[#06B6D4]/10 text-[#06B6D4]'
                      : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/[0.04]'
                  }`}
                >
                  <Send className="w-4 h-4" /> Envoyer maintenant
                </button>
                <button
                  onClick={() => setScheduleMode('schedule')}
                  className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    scheduleMode === 'schedule'
                      ? 'border-[#06B6D4]/40 bg-[#06B6D4]/10 text-[#06B6D4]'
                      : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/[0.04]'
                  }`}
                >
                  <Clock className="w-4 h-4" /> Planifier
                </button>
              </div>
              {scheduleMode === 'schedule' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Input
                    type="datetime-local"
                    value={formData.scheduledAt ? formData.scheduledAt.slice(0, 16) : ''}
                    onChange={(e) => updateForm('scheduledAt', e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] text-white focus:border-[#06B6D4]/40 focus:ring-[#06B6D4]/20"
                  />
                </motion.div>
              )}
            </div>

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
                {scheduleMode === 'now' ? (
                  <>
                    <Send className="w-4 h-4" /> Envoyer
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" /> Planifier
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
