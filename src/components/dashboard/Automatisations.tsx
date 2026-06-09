'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  UserPlus,
  FileText,
  MousePointerClick,
  Calendar,
  Tag,
  Clock,
  Smartphone,
  MessageSquare,
  GitBranch,
  Bell,
  ArrowRight,
  Pencil,
  Trash2,
  Zap,
  X,
  ChevronDown,
  Play,
} from 'lucide-react';
import { useAppStore, Automation, AutomationTrigger, AutomationAction, TriggerType, ActionType } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Icon Maps ───
const triggerIconMap: Record<TriggerType, React.ElementType> = {
  new_contact: UserPlus,
  form_submit: FileText,
  link_click: MousePointerClick,
  event_register: Calendar,
  tag_added: Tag,
  date: Clock,
};

const triggerLabelMap: Record<TriggerType, string> = {
  new_contact: 'Nouveau contact',
  form_submit: 'Soumission formulaire',
  link_click: 'Clic sur lien',
  event_register: 'Inscription événement',
  tag_added: 'Tag ajouté',
  date: 'Date planifiée',
};

const actionIconMap: Record<ActionType, React.ElementType> = {
  send_sms: Smartphone,
  send_whatsapp: MessageSquare,
  add_tag: Tag,
  remove_tag: Tag,
  move_segment: GitBranch,
  start_sequence: GitBranch,
  notify: Bell,
  wait: Clock,
};

const actionLabelMap: Record<ActionType, string> = {
  send_sms: 'Envoyer SMS',
  send_whatsapp: 'Envoyer WhatsApp',
  add_tag: 'Ajouter tag',
  remove_tag: 'Retirer tag',
  move_segment: 'Déplacer segment',
  start_sequence: 'Démarrer séquence',
  notify: 'Notifier',
  wait: 'Attendre',
};

const triggerTypes: TriggerType[] = ['new_contact', 'form_submit', 'link_click', 'event_register', 'tag_added', 'date'];
const actionTypes: ActionType[] = ['send_sms', 'send_whatsapp', 'add_tag', 'remove_tag', 'move_segment', 'start_sequence', 'notify', 'wait'];

// ─── Animation Variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ─── Trigger Param Fields ───
function getTriggerParamFields(type: TriggerType): { key: string; label: string; placeholder: string }[] {
  switch (type) {
    case 'new_contact':
      return [{ key: 'source', label: 'Source', placeholder: 'ex: Page capture, Événement' }];
    case 'form_submit':
      return [{ key: 'formName', label: 'Formulaire', placeholder: 'ex: Formulaire inscription' }];
    case 'link_click':
      return [{ key: 'url', label: 'URL du lien', placeholder: 'ex: https://...' }];
    case 'event_register':
      return [{ key: 'eventId', label: 'ID Événement', placeholder: 'ex: evt1' }];
    case 'tag_added':
      return [{ key: 'tag', label: 'Tag', placeholder: 'ex: VIP, Nouveau' }];
    case 'date':
      return [
        { key: 'daysBefore', label: 'Jours avant', placeholder: 'ex: 3' },
        { key: 'eventType', label: 'Type événement', placeholder: 'ex: Événement' },
      ];
    default:
      return [];
  }
}

// ─── Action Param Fields ───
function getActionParamFields(type: ActionType): { key: string; label: string; placeholder: string }[] {
  switch (type) {
    case 'send_sms':
      return [{ key: 'content', label: 'Message SMS', placeholder: 'Votre message...' }];
    case 'send_whatsapp':
      return [{ key: 'content', label: 'Message WhatsApp', placeholder: 'Votre message...' }];
    case 'add_tag':
      return [{ key: 'tag', label: 'Tag à ajouter', placeholder: 'ex: Nouveau' }];
    case 'remove_tag':
      return [{ key: 'tag', label: 'Tag à retirer', placeholder: 'ex: Prospect' }];
    case 'move_segment':
      return [{ key: 'segment', label: 'Segment cible', placeholder: 'ex: Clients' }];
    case 'start_sequence':
      return [{ key: 'sequenceId', label: 'ID Séquence', placeholder: 'ex: seq1' }];
    case 'notify':
      return [{ key: 'message', label: 'Message notification', placeholder: 'ex: Nouveau lead capturé' }];
    case 'wait':
      return [
        { key: 'duration', label: 'Durée', placeholder: 'ex: 30' },
        { key: 'unit', label: 'Unité', placeholder: 'minutes, heures, jours' },
      ];
    default:
      return [];
  }
}

// ─── Flow Node Component ───
function FlowNode({ icon: Icon, label, type }: { icon: React.ElementType; label: string; type: 'trigger' | 'action' }) {
  const isTrigger = type === 'trigger';
  return (
    <div className="flex flex-col items-center gap-1 min-w-[80px]">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          isTrigger
            ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/30'
            : 'bg-emerald-500/15 border border-emerald-500/30'
        }`}
      >
        <Icon size={16} className={isTrigger ? 'text-[#D4AF37]' : 'text-emerald-400'} />
      </div>
      <span className="text-[10px] text-slate-400 text-center leading-tight max-w-[80px] truncate">{label}</span>
    </div>
  );
}

// ─── Empty Form State ───
interface FormState {
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  isActive: boolean;
}

function createEmptyForm(): FormState {
  return {
    name: '',
    description: '',
    trigger: { id: `t-${Date.now()}`, type: 'new_contact', params: {} },
    actions: [{ id: `a-${Date.now()}`, type: 'send_sms', params: {} }],
    isActive: true,
  };
}

// ─── Main Component ───
export default function Automatisations() {
  const { automations, addAutomation, updateAutomation, deleteAutomation } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(createEmptyForm());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // ── Open dialog for new automation ──
  const handleNew = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setDialogOpen(true);
  };

  // ── Open dialog for editing ──
  const handleEdit = (automation: Automation) => {
    setEditingId(automation.id);
    setForm({
      name: automation.name,
      description: automation.description,
      trigger: { ...automation.trigger },
      actions: automation.actions.map((a) => ({ ...a, params: { ...a.params } })),
      isActive: automation.isActive,
    });
    setDialogOpen(true);
  };

  // ── Save automation ──
  const handleSave = () => {
    if (!form.name.trim()) return;

    if (editingId) {
      updateAutomation(editingId, {
        name: form.name,
        description: form.description,
        trigger: form.trigger,
        actions: form.actions,
        isActive: form.isActive,
      });
    } else {
      const newAutomation: Automation = {
        id: Date.now().toString(),
        name: form.name,
        description: form.description,
        trigger: form.trigger,
        actions: form.actions,
        isActive: form.isActive,
        runCount: 0,
        lastRunAt: '',
        createdAt: new Date().toISOString().split('T')[0],
      };
      addAutomation(newAutomation);
    }
    setDialogOpen(false);
  };

  // ── Delete automation ──
  const handleDelete = (id: string) => {
    deleteAutomation(id);
    setDeleteConfirmId(null);
  };

  // ── Toggle automation active ──
  const handleToggle = (id: string, currentActive: boolean) => {
    updateAutomation(id, { isActive: !currentActive });
  };

  // ── Update trigger type ──
  const handleTriggerTypeChange = (type: TriggerType) => {
    setForm((prev) => ({
      ...prev,
      trigger: { ...prev.trigger, type, params: {} },
    }));
  };

  // ── Update trigger param ──
  const handleTriggerParamChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      trigger: { ...prev.trigger, params: { ...prev.trigger.params, [key]: value } },
    }));
  };

  // ── Add action ──
  const handleAddAction = () => {
    setForm((prev) => ({
      ...prev,
      actions: [...prev.actions, { id: `a-${Date.now()}`, type: 'send_sms', params: {} }],
    }));
  };

  // ── Remove action ──
  const handleRemoveAction = (actionId: string) => {
    setForm((prev) => ({
      ...prev,
      actions: prev.actions.filter((a) => a.id !== actionId),
    }));
  };

  // ── Update action type ──
  const handleActionTypeChange = (actionId: string, type: ActionType) => {
    setForm((prev) => ({
      ...prev,
      actions: prev.actions.map((a) =>
        a.id === actionId ? { ...a, type, params: {} } : a
      ),
    }));
  };

  // ── Update action param ──
  const handleActionParamChange = (actionId: string, key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      actions: prev.actions.map((a) =>
        a.id === actionId ? { ...a, params: { ...a.params, [key]: value } } : a
      ),
    }));
  };

  return (
    <div className="space-y-6">
      {/* ── Top Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-slate-400 text-sm">{automations.length} automatisation{automations.length > 1 ? 's' : ''}</p>
          <p className="text-slate-600 text-xs mt-0.5">Créez et gérez vos workflows automatisés</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNew}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#06080f] font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
        >
          <Plus className="w-4 h-4" /> Nouvelle Automation
        </motion.button>
      </motion.div>

      {/* ── Automation Cards ── */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {automations.map((auto, i) => {
            const TriggerIcon = triggerIconMap[auto.trigger.type];
            const isConfirmDelete = deleteConfirmId === auto.id;

            return (
              <motion.div
                key={auto.id}
                variants={cardVariants}
                layout
                className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-[#D4AF37]/20 transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{auto.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{auto.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        auto.isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border-0 text-[10px]'
                          : 'bg-slate-500/15 text-slate-400 border-0 text-[10px]'
                      }
                    >
                      {auto.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch
                      checked={auto.isActive}
                      onCheckedChange={() => handleToggle(auto.id, auto.isActive)}
                      className="data-[state=checked]:bg-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Trigger Info */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center gap-1.5">
                    <TriggerIcon size={12} className="text-[#D4AF37]" />
                    <span className="text-[11px] text-[#D4AF37] font-medium">
                      {triggerLabelMap[auto.trigger.type]}
                    </span>
                  </div>
                </div>

                {/* Visual Flow */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4 custom-scrollbar">
                  <FlowNode icon={TriggerIcon} label={triggerLabelMap[auto.trigger.type]} type="trigger" />
                  {auto.actions.map((action, idx) => {
                    const ActionIcon = actionIconMap[action.type];
                    return (
                      <div key={action.id} className="flex items-center gap-1">
                        <ArrowRight size={14} className="text-slate-600 flex-shrink-0" />
                        <FlowNode icon={ActionIcon} label={actionLabelMap[action.type]} type="action" />
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" /> {auto.runCount} exécution{auto.runCount > 1 ? 's' : ''}
                    </span>
                    {auto.lastRunAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Dernière : {auto.lastRunAt}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {isConfirmDelete ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-400">Supprimer ?</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(auto.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors"
                        >
                          Oui
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2.5 py-1 rounded-lg bg-slate-500/20 text-slate-400 text-xs font-medium hover:bg-slate-500/30 transition-colors"
                        >
                          Non
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(auto)}
                          className="p-2 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-[#D4AF37] transition-colors"
                        >
                          <Pencil size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteConfirmId(auto.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {automations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Zap size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Aucune automatisation</p>
            <p className="text-slate-600 text-xs mt-1">Créez votre première automation pour automatiser vos workflows</p>
          </motion.div>
        )}
      </motion.div>

      {/* ── Create/Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0c0f1a] border-white/10 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Zap size={18} className="text-[#D4AF37]" />
              {editingId ? 'Modifier l\'automation' : 'Nouvelle automation'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Name & Description */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">Nom de l&apos;automation</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Bienvenue Auto"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#D4AF37]/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300 text-xs">Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez cette automation..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#D4AF37]/50"
                />
              </div>
            </div>

            {/* Trigger Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
                  <Zap size={12} className="text-[#D4AF37]" />
                </div>
                <Label className="text-slate-300 text-xs font-semibold">Déclencheur</Label>
              </div>

              <Select value={form.trigger.type} onValueChange={(v) => handleTriggerTypeChange(v as TriggerType)}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white w-full">
                  <SelectValue placeholder="Type de déclencheur" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c0f1a] border-white/10">
                  {triggerTypes.map((type) => {
                    const Icon = triggerIconMap[type];
                    return (
                      <SelectItem key={type} value={type} className="text-white focus:bg-white/10 focus:text-white">
                        <span className="flex items-center gap-2">
                          <Icon size={14} className="text-[#D4AF37]" />
                          {triggerLabelMap[type]}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Trigger Params */}
              {getTriggerParamFields(form.trigger.type).map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label className="text-slate-400 text-[11px]">{field.label}</Label>
                  <Input
                    value={form.trigger.params[field.key] || ''}
                    onChange={(e) => handleTriggerParamChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#D4AF37]/50 text-sm h-9"
                  />
                </div>
              ))}
            </div>

            {/* Actions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <GitBranch size={12} className="text-emerald-400" />
                  </div>
                  <Label className="text-slate-300 text-xs font-semibold">Actions</Label>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddAction}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1 hover:bg-emerald-500/20 transition-colors"
                >
                  <Plus size={12} /> Ajouter
                </motion.button>
              </div>

              <div className="space-y-3">
                {form.actions.map((action, idx) => {
                  const ActionIcon = actionIconMap[action.type];
                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <ActionIcon size={14} className="text-emerald-400" />
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">Action {idx + 1}</span>
                        </div>
                        {form.actions.length > 1 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveAction(action.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <X size={12} />
                          </motion.button>
                        )}
                      </div>

                      <Select value={action.type} onValueChange={(v) => handleActionTypeChange(action.id, v as ActionType)}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white w-full text-xs h-9">
                          <SelectValue placeholder="Type d'action" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0c0f1a] border-white/10">
                          {actionTypes.map((type) => {
                            const Icon = actionIconMap[type];
                            return (
                              <SelectItem key={type} value={type} className="text-white focus:bg-white/10 focus:text-white">
                                <span className="flex items-center gap-2">
                                  <Icon size={14} className="text-emerald-400" />
                                  {actionLabelMap[type]}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      {/* Action Params */}
                      <div className="space-y-2">
                        {getActionParamFields(action.type).map((field) => (
                          <div key={field.key}>
                            <Label className="text-slate-500 text-[10px]">{field.label}</Label>
                            {field.key === 'content' || field.key === 'message' ? (
                              <Textarea
                                value={action.params[field.key] || ''}
                                onChange={(e) => handleActionParamChange(action.id, field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#D4AF37]/50 text-xs mt-1 min-h-[60px]"
                                rows={2}
                              />
                            ) : (
                              <Input
                                value={action.params[field.key] || ''}
                                onChange={(e) => handleActionParamChange(action.id, field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#D4AF37]/50 text-xs h-8 mt-1"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div>
                <Label className="text-slate-300 text-xs font-medium">Activer l&apos;automation</Label>
                <p className="text-slate-600 text-[10px] mt-0.5">L&apos;automation s&apos;exécutera automatiquement</p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
                className="data-[state=checked]:bg-[#D4AF37]"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/5"
              >
                Annuler
              </Button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={!form.name.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#06080f] font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#D4AF37]/20"
              >
                {editingId ? 'Enregistrer' : 'Créer l\'automation'}
              </motion.button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
