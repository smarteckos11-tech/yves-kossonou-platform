'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Globe, Trash2, Copy } from 'lucide-react';
import { useAppStore, LandingPage } from '@/store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const templates = [
  {
    id: 'template-1',
    name: 'Lead Capture',
    description: 'Page simple avec formulaire de capture de leads',
    fields: ['name', 'email', 'phone'],
  },
  {
    id: 'template-2',
    name: 'Formation',
    description: 'Page de vente pour une formation avec détails',
    fields: ['name', 'email', 'phone', 'interest'],
  },
  {
    id: 'template-3',
    name: 'Événement',
    description: 'Page d\'inscription pour un événement',
    fields: ['name', 'email', 'phone', 'company'],
  },
  {
    id: 'template-4',
    name: 'Livre',
    description: 'Page de vente pour un livre digital',
    fields: ['name', 'email'],
  },
];

const fieldOptions = [
  { id: 'name', label: 'Nom' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Téléphone' },
  { id: 'company', label: 'Entreprise' },
  { id: 'interest', label: 'Intérêt' },
  { id: 'budget', label: 'Budget' },
  { id: 'message', label: 'Message' },
];

export default function LandingPageBuilder() {
  const { landingPages, addLandingPage, deleteLandingPage, toggleLandingPagePublish } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState<LandingPage | null>(null);
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'email', 'phone']);

  const handleCreate = () => {
    if (!title) return;
    addLandingPage({
      id: `lp-${Date.now()}`,
      title,
      template: selectedTemplate.id,
      fields: selectedFields,
      published: false,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setDialogOpen(false);
    setTitle('');
  };

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId) ? prev.filter((f) => f !== fieldId) : [...prev, fieldId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Landing Pages</h1>
          <p className="text-[#94A3B8] text-sm mt-1">Créez des pages de capture de leads</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedFields(['name', 'email', 'phone']);
            setSelectedTemplate(templates[0]);
            setDialogOpen(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-sm rounded-xl flex items-center gap-2"
        >
          <Plus size={16} /> Créer une Page
        </motion.button>
      </div>

      {/* Pages List */}
      {landingPages.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Globe size={48} className="text-[#64748B] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Aucune landing page</h3>
          <p className="text-sm text-[#94A3B8] mb-6">Créez votre première landing page pour capturer des leads</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {landingPages.map((page) => (
            <motion.div key={page.id} layout className="glass-card rounded-2xl p-5 group hover:border-[#06B6D4]/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${page.published ? 'bg-[#10B981]' : 'bg-[#64748B]'}`}
                  />
                  <span className="text-xs text-[#64748B]">
                    {page.published ? 'Publiée' : 'Brouillon'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setPreviewPage(page); setPreviewOpen(true); }}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-[#06B6D4] transition-colors"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => toggleLandingPagePublish(page.id)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-[#10B981] transition-colors"
                  >
                    <Globe size={14} />
                  </button>
                  <button
                    onClick={() => deleteLandingPage(page.id)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-[#EF4444] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{page.title}</h3>
              <p className="text-xs text-[#64748B] mb-3">
                Créée le {page.createdAt} • {page.fields.length} champs
              </p>
              <div className="flex flex-wrap gap-1">
                {page.fields.map((f) => (
                  <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4]">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une Landing Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Titre de la page</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Masterclass Transformation Digitale"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Template</label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTemplate(t);
                      setSelectedFields([...t.fields]);
                    }}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedTemplate.id === t.id
                        ? 'bg-[#06B6D4]/10 border border-[#06B6D4]/30'
                        : 'glass hover:border-white/20'
                    }`}
                  >
                    <h4 className="text-sm font-semibold text-white mb-1">{t.name}</h4>
                    <p className="text-xs text-[#64748B]">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-[#94A3B8] mb-2 block">Champs du formulaire</label>
              <div className="flex flex-wrap gap-2">
                {fieldOptions.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => toggleField(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedFields.includes(f.id)
                        ? 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30'
                        : 'glass text-[#94A3B8]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              className="w-full py-3 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold rounded-xl"
            >
              Créer la Landing Page
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-[#081120] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aperçu : {previewPage?.title}</DialogTitle>
          </DialogHeader>
          {previewPage && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
              {/* Simulated Preview */}
              <div className="animated-gradient-bg p-8 text-center">
                <h2 className="text-2xl font-bold turquoise-gradient-text mb-4">{previewPage.title}</h2>
                <p className="text-[#94A3B8] mb-6">Inscrivez-vous pour en savoir plus</p>
                <div className="max-w-sm mx-auto space-y-3">
                  {previewPage.fields.map((f) => (
                    <div key={f}>
                      <label className="text-xs text-[#94A3B8] block mb-1 text-left capitalize">{f}</label>
                      <input
                        type="text"
                        disabled
                        placeholder={f}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[#64748B] text-sm"
                      />
                    </div>
                  ))}
                  <button className="w-full py-3 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold rounded-xl mt-2">
                    S&apos;inscrire
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
