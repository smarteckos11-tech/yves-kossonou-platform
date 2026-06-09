'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, MessageSquare, Clock, GitBranch, Zap, Plus, Pencil,
  Trash2, ChevronUp, ChevronDown, ArrowRight, Users, CheckCircle2,
  CircleDot, Sparkles, Timer, Filter
} from 'lucide-react';
import { useAppStore, Sequence, SequenceStep, SequenceStepType } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

// ─── Constants ───
const STEP_TYPE_CONFIG: Record<SequenceStepType, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  sms: {
    label: 'SMS',
    icon: Smartphone,
    color: '#60A5FA',
    bgColor: 'rgba(96, 165, 250, 0.12)',
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  whatsapp: {
    label: 'WhatsApp',
    icon: MessageSquare,
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  wait: {
    label: 'Attente',
    icon: Clock,
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  condition: {
    label: 'Condition',
    icon: GitBranch,
    color: '#A78BFA',
    bgColor: 'rgba(167, 139, 250, 0.12)',
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  action: {
    label: 'Action',
    icon: Zap,
    color: '#D4AF37',
    bgColor: 'rgba(212, 175, 55, 0.12)',
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
};

const SEGMENTS = ['Tous', 'Nouveaux', 'Prospects chauds', 'Prospects froids', 'Clients'];
const ACTION_TYPES = ['add_tag', 'remove_tag', 'move_segment', 'start_sequence', 'notify', 'send_sms', 'send_whatsapp'];
const CONDITION_FIELDS = ['tag', 'segment', 'score', 'last_contact', 'source'];
const CONDITION_OPERATORS = ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'];

// ─── Step Flow Visualization (Horizontal) ───
function StepFlowVisualization({ steps }: { steps: SequenceStep[] }) {
  if (steps.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-sm text-slate-500">
        Aucune étape définie
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-2 custom-scrollbar">
      {steps.map((step, index) => {
        const config = STEP_TYPE_CONFIG[step.type];
        const Icon = config.icon;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center shrink-0">
            {/* Step Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                style={{
                  background: config.bgColor,
                  border: `1.5px solid ${config.borderColor}`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color: config.color }} />
                {step.type === 'wait' && (
                  <span className="absolute -bottom-1 -right-1 text-[8px] font-bold px-1 py-0 rounded-full bg-[#0F172A] border border-[#F59E0B]/30 text-[#F59E0B]">
                    {step.waitDuration}{step.waitUnit === 'jours' ? 'j' : step.waitUnit === 'heures' ? 'h' : 'm'}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-slate-400 max-w-[60px] text-center leading-tight truncate">
                {config.label}
              </span>
            </motion.div>

            {/* Connecting Line */}
            {!isLast && (
              <div className="flex items-center mx-1.5">
                <div className="w-5 h-0.5 bg-gradient-to-r from-slate-600/60 to-slate-600/30 relative">
                  <ArrowRight className="absolute -right-1.5 -top-1.5 w-3 h-3 text-slate-500" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step Editor Card (Vertical in Modal) ───
function StepEditorCard({
  step,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  step: SequenceStep;
  index: number;
  total: number;
  onUpdate: (id: string, data: Partial<SequenceStep>) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}) {
  const config = STEP_TYPE_CONFIG[step.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      {/* Vertical connector line */}
      {index > 0 && (
        <div className="absolute -top-3 left-6 w-0.5 h-3 bg-slate-700/60" />
      )}
      {index < total - 1 && (
        <div className="absolute -bottom-3 left-6 w-0.5 h-3 bg-slate-700/60" />
      )}

      <div
        className="rounded-xl p-4 space-y-3 relative"
        style={{
          background: config.bgColor.replace('0.12', '0.06'),
          border: `1px solid ${config.borderColor.replace('0.3', '0.15')}`,
        }}
      >
        {/* Step header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: config.bgColor, border: `1px solid ${config.borderColor}` }}
            >
              <Icon className="w-4 h-4" style={{ color: config.color }} />
            </div>
            <div>
              <span className="text-sm font-semibold" style={{ color: config.color }}>
                Étape {index + 1}
              </span>
              <span className="text-xs text-slate-400 ml-2">{config.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Monter l'étape"
            >
              <ChevronUp className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === total - 1}
              className="p-1 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Descendre l'étape"
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => onRemove(step.id)}
              className="p-1 rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors ml-1"
              aria-label="Supprimer l'étape"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step-specific fields */}
        {(step.type === 'sms' || step.type === 'whatsapp') && (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-400 mb-1.5 block">Message</Label>
              <Textarea
                value={step.content || ''}
                onChange={(e) => onUpdate(step.id, { content: e.target.value })}
                placeholder="Écrivez votre message..."
                className="bg-[#0a0e1a] border-white/10 text-sm min-h-[80px] resize-none focus:border-[#D4AF37]/40"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400 mb-1.5 block">URL du média (optionnel)</Label>
              <Input
                value={step.mediaUrl || ''}
                onChange={(e) => onUpdate(step.id, { mediaUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-[#0a0e1a] border-white/10 text-sm focus:border-[#D4AF37]/40"
              />
            </div>
          </div>
        )}

        {step.type === 'wait' && (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label className="text-xs text-slate-400 mb-1.5 block">Durée</Label>
              <Input
                type="number"
                min={1}
                value={step.waitDuration || 1}
                onChange={(e) => onUpdate(step.id, { waitDuration: parseInt(e.target.value) || 1 })}
                className="bg-[#0a0e1a] border-white/10 text-sm focus:border-[#D4AF37]/40"
              />
            </div>
            <div className="w-36">
              <Label className="text-xs text-slate-400 mb-1.5 block">Unité</Label>
              <Select
                value={step.waitUnit || 'jours'}
                onValueChange={(v) => onUpdate(step.id, { waitUnit: v as SequenceStep['waitUnit'] })}
              >
                <SelectTrigger className="bg-[#0a0e1a] border-white/10 text-sm focus:border-[#D4AF37]/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-white/10">
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="heures">Heures</SelectItem>
                  <SelectItem value="jours">Jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step.type === 'condition' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-slate-400 mb-1.5 block">Champ</Label>
                <Select
                  value={step.condition?.field || 'tag'}
                  onValueChange={(v) =>
                    onUpdate(step.id, { condition: { ...step.condition!, field: v, operator: step.condition?.operator || 'equals', value: step.condition?.value || '' } })
                  }
                >
                  <SelectTrigger className="bg-[#0a0e1a] border-white/10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F172A] border-white/10">
                    {CONDITION_FIELDS.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-400 mb-1.5 block">Opérateur</Label>
                <Select
                  value={step.condition?.operator || 'equals'}
                  onValueChange={(v) =>
                    onUpdate(step.id, { condition: { ...step.condition!, operator: v, field: step.condition?.field || 'tag', value: step.condition?.value || '' } })
                  }
                >
                  <SelectTrigger className="bg-[#0a0e1a] border-white/10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F172A] border-white/10">
                    {CONDITION_OPERATORS.map((o) => (
                      <SelectItem key={o} value={o}>{o.replace('_', ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-slate-400 mb-1.5 block">Valeur</Label>
                <Input
                  value={step.condition?.value || ''}
                  onChange={(e) =>
                    onUpdate(step.id, { condition: { field: step.condition?.field || 'tag', operator: step.condition?.operator || 'equals', value: e.target.value } })
                  }
                  placeholder="valeur"
                  className="bg-[#0a0e1a] border-white/10 text-sm focus:border-[#D4AF37]/40"
                />
              </div>
            </div>
          </div>
        )}

        {step.type === 'action' && (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-400 mb-1.5 block">Type d&apos;action</Label>
              <Select
                value={step.action?.type || 'add_tag'}
                onValueChange={(v) =>
                  onUpdate(step.id, { action: { type: v, params: step.action?.params || {} } })
                }
              >
                <SelectTrigger className="bg-[#0a0e1a] border-white/10 text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-white/10">
                  {ACTION_TYPES.map((a) => (
                    <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-slate-400 mb-1.5 block">Paramètres (clé:valeur par ligne)</Label>
              <Textarea
                value={Object.entries(step.action?.params || {}).map(([k, v]) => `${k}:${v}`).join('\n')}
                onChange={(e) => {
                  const params: Record<string, string> = {};
                  e.target.value.split('\n').forEach((line) => {
                    const [k, ...rest] = line.split(':');
                    if (k && rest.length > 0) params[k.trim()] = rest.join(':').trim();
                  });
                  onUpdate(step.id, { action: { type: step.action?.type || 'add_tag', params } });
                }}
                placeholder="tag:VIP&#10;segment:Clients"
                className="bg-[#0a0e1a] border-white/10 text-sm min-h-[60px] resize-none focus:border-[#D4AF37]/40"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Add Step Type Selector ───
function AddStepSelector({ onSelect }: { onSelect: (type: SequenceStepType) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-slate-700/50 text-slate-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all text-sm"
      >
        <Plus className="w-4 h-4" />
        Ajouter une étape
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute left-0 right-0 top-full mt-2 z-20 rounded-xl border border-white/10 bg-[#0F172A] p-2 shadow-xl"
          >
            {(Object.keys(STEP_TYPE_CONFIG) as SequenceStepType[]).map((type) => {
              const config = STEP_TYPE_CONFIG[type];
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => {
                    onSelect(type);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: config.bgColor, border: `1px solid ${config.borderColor}` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: config.color }} />
                  </div>
                  <span className="text-sm text-slate-300">{config.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───
export default function Sequences() {
  const { sequences, addSequence, updateSequence, deleteSequence } = useAppStore();

  // Filter
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTargetSegment, setFormTargetSegment] = useState('Tous');
  const [formSteps, setFormSteps] = useState<SequenceStep[]>([]);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredSequences = showActiveOnly
    ? sequences.filter((s) => s.isActive)
    : sequences;

  // ─── Handlers ───
  const openCreateModal = useCallback(() => {
    setEditingSequence(null);
    setFormName('');
    setFormDescription('');
    setFormTargetSegment('Tous');
    setFormSteps([]);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((seq: Sequence) => {
    setEditingSequence(seq);
    setFormName(seq.name);
    setFormDescription(seq.description);
    setFormTargetSegment(seq.targetSegment);
    setFormSteps([...seq.steps]);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingSequence(null);
  }, []);

  const handleSave = useCallback(() => {
    if (!formName.trim()) return;

    if (editingSequence) {
      updateSequence(editingSequence.id, {
        name: formName.trim(),
        description: formDescription.trim(),
        targetSegment: formTargetSegment,
        steps: formSteps,
      });
    } else {
      addSequence({
        id: Date.now().toString(),
        name: formName.trim(),
        description: formDescription.trim(),
        targetSegment: formTargetSegment,
        targetTags: [],
        steps: formSteps,
        isActive: true,
        enrolledCount: 0,
        completedCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    closeModal();
  }, [editingSequence, formName, formDescription, formTargetSegment, formSteps, addSequence, updateSequence, closeModal]);

  const handleDelete = useCallback((id: string) => {
    deleteSequence(id);
    setDeleteConfirmId(null);
  }, [deleteSequence]);

  const handleToggleActive = useCallback((id: string, current: boolean) => {
    updateSequence(id, { isActive: !current });
  }, [updateSequence]);

  // Step management
  const addStep = useCallback((type: SequenceStepType) => {
    const newStep: SequenceStep = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      type,
    };
    if (type === 'sms' || type === 'whatsapp') {
      newStep.channel = type;
      newStep.content = '';
    }
    if (type === 'wait') {
      newStep.waitDuration = 1;
      newStep.waitUnit = 'jours';
    }
    if (type === 'condition') {
      newStep.condition = { field: 'tag', operator: 'equals', value: '' };
    }
    if (type === 'action') {
      newStep.action = { type: 'add_tag', params: {} };
    }
    setFormSteps((prev) => [...prev, newStep]);
  }, []);

  const updateStep = useCallback((id: string, data: Partial<SequenceStep>) => {
    setFormSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  }, []);

  const removeStep = useCallback((id: string) => {
    setFormSteps((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const moveStepUp = useCallback((index: number) => {
    if (index === 0) return;
    setFormSteps((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  }, []);

  const moveStepDown = useCallback((index: number) => {
    setFormSteps((prev) => {
      if (index >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  }, []);

  // ─── Render ───
  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#0F172A] rounded-lg border border-white/8 px-3 py-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => setShowActiveOnly(false)}
              className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                !showActiveOnly
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setShowActiveOnly(true)}
              className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                showActiveOnly
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Actives
            </button>
          </div>
          <span className="text-sm text-slate-400">
            {filteredSequences.length} séquence{filteredSequences.length !== 1 ? 's' : ''}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#06080f] shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Séquence
        </motion.button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total séquences', value: sequences.length, color: '#D4AF37' },
          { label: 'Actives', value: sequences.filter((s) => s.isActive).length, color: '#10B981' },
          { label: 'Inscrits total', value: sequences.reduce((a, s) => a + s.enrolledCount, 0), color: '#60A5FA' },
          { label: 'Terminées', value: sequences.reduce((a, s) => a + s.completedCount, 0), color: '#F59E0B' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sequence Cards */}
      {filteredSequences.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <GitBranch className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg font-medium">Aucune séquence trouvée</p>
          <p className="text-slate-500 text-sm mt-1">Créez votre première séquence automatisée</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#06080f]"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Séquence
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filteredSequences.map((seq, i) => (
            <motion.div
              key={seq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="bg-[#0a0e1a] border-white/6 hover:border-[#D4AF37]/15 transition-all group overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg text-white truncate">{seq.name}</CardTitle>
                        {seq.isActive ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px] shrink-0">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/20 text-[10px] shrink-0">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-slate-500 text-sm mt-1 line-clamp-1">
                        {seq.description || 'Aucune description'}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      {/* Active toggle */}
                      <div className="flex items-center gap-2 mr-2">
                        <span className="text-[10px] text-slate-500 hidden sm:inline">
                          {seq.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                          checked={seq.isActive}
                          onCheckedChange={() => handleToggleActive(seq.id, seq.isActive)}
                          className={`${seq.isActive ? 'data-[state=checked]:bg-emerald-500' : ''}`}
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(seq)}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-[#D4AF37] transition-colors"
                        aria-label="Modifier la séquence"
                      >
                        <Pencil className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteConfirmId(seq.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                        aria-label="Supprimer la séquence"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Step Flow Visualization */}
                  <div className="rounded-lg bg-[#06080f]/50 p-3 border border-white/4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/60" />
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                        Flux — {seq.steps.length} étape{seq.steps.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <StepFlowVisualization steps={seq.steps} />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <div>
                        <span className="text-sm font-bold text-white">{seq.enrolledCount}</span>
                        <span className="text-xs text-slate-500 ml-1">inscrits</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500/60" />
                      <div>
                        <span className="text-sm font-bold text-white">{seq.completedCount}</span>
                        <span className="text-xs text-slate-500 ml-1">terminés</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <CircleDot className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-500">Segment: {seq.targetSegment}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Supprimer la séquence</DialogTitle>
            <DialogDescription className="text-slate-400">
              Êtes-vous sûr de vouloir supprimer cette séquence ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setDeleteConfirmId(null)}
              className="text-slate-400 hover:text-white"
            >
              Annuler
            </Button>
            <Button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Sequence Dialog */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="bg-[#0a0e1a] border-white/8 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {editingSequence ? 'Modifier la séquence' : 'Nouvelle séquence'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingSequence
                ? 'Modifiez les détails et les étapes de votre séquence'
                : 'Configurez votre séquence automatisée en ajoutant des étapes'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Name */}
            <div>
              <Label className="text-sm text-slate-300 mb-1.5 block">Nom de la séquence</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Relance Post-Événement"
                className="bg-[#06080f] border-white/10 text-white focus:border-[#D4AF37]/40 placeholder:text-slate-600"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm text-slate-300 mb-1.5 block">Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Décrivez l'objectif de cette séquence..."
                className="bg-[#06080f] border-white/10 text-white focus:border-[#D4AF37]/40 placeholder:text-slate-600 resize-none"
                rows={2}
              />
            </div>

            {/* Target Segment */}
            <div>
              <Label className="text-sm text-slate-300 mb-1.5 block">Segment cible</Label>
              <Select value={formTargetSegment} onValueChange={setFormTargetSegment}>
                <SelectTrigger className="bg-[#06080f] border-white/10 text-white focus:border-[#D4AF37]/40 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-white/10">
                  {SEGMENTS.map((seg) => (
                    <SelectItem key={seg} value={seg}>{seg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-white/6" />

            {/* Steps Builder */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Timer className="w-4 h-4 text-[#D4AF37]" />
                <Label className="text-sm font-semibold text-slate-200">Étapes de la séquence</Label>
                <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400 ml-auto">
                  {formSteps.length} étape{formSteps.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {formSteps.map((step, index) => (
                    <StepEditorCard
                      key={step.id}
                      step={step}
                      index={index}
                      total={formSteps.length}
                      onUpdate={updateStep}
                      onRemove={removeStep}
                      onMoveUp={moveStepUp}
                      onMoveDown={moveStepDown}
                    />
                  ))}
                </AnimatePresence>

                {/* Add step */}
                {formSteps.length > 0 && (
                  <div className="pt-1">
                    <div className="flex justify-center">
                      <div className="w-0.5 h-4 bg-slate-700/60" />
                    </div>
                  </div>
                )}
                <AddStepSelector onSelect={addStep} />
              </div>
            </div>

            {/* Preview flow */}
            {formSteps.length > 0 && (
              <>
                <Separator className="bg-white/6" />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]/60" />
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Aperçu du flux</span>
                  </div>
                  <div className="rounded-lg bg-[#06080f]/50 p-3 border border-white/4">
                    <StepFlowVisualization steps={formSteps} />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/6">
            <Button
              variant="ghost"
              onClick={closeModal}
              className="text-slate-400 hover:text-white"
            >
              Annuler
            </Button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!formName.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#06080f] shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-shadow"
            >
              <CheckCircle2 className="w-4 h-4" />
              {editingSequence ? 'Enregistrer' : 'Créer la séquence'}
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
