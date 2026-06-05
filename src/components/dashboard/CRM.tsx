'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore, Lead } from '@/store/useAppStore';

const stages = [
  { id: 'Nouveau' as const, label: 'Nouveau', color: '#3B82F6' },
  { id: 'Contacté' as const, label: 'Contacté', color: '#F59E0B' },
  { id: 'Qualifié' as const, label: 'Qualifié', color: '#8B5CF6' },
  { id: 'Proposition' as const, label: 'Proposition', color: '#EC4899' },
  { id: 'Converti' as const, label: 'Converti', color: '#10B981' },
];

export default function CRM() {
  const { leads, updateLeadStatus } = useAppStore();
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const getLeadsByStage = (stage: Lead['status']) => leads.filter((l) => l.status === stage);

  const handleDrop = (stage: Lead['status']) => {
    if (draggedLead) {
      updateLeadStatus(draggedLead, stage);
      setDraggedLead(null);
    }
  };

  const totalValue = leads.length * 50000;
  const convertedValue = leads.filter((l) => l.status === 'Converti').length * 200000;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">CRM Pipeline</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Gérez votre pipeline de conversion</p>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="text-sm text-[#94A3B8]">Total Leads</div>
          <div className="text-2xl font-bold text-white">{leads.length}</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="text-sm text-[#94A3B8]">Valeur Pipeline</div>
          <div className="text-2xl font-bold gold-gradient-text">{(totalValue / 1000).toFixed(0)}K</div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="text-sm text-[#94A3B8]">Convertis</div>
          <div className="text-2xl font-bold text-[#10B981]">
            {leads.filter((l) => l.status === 'Converti').length}
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="text-sm text-[#94A3B8]">Revenus Potentiels</div>
          <div className="text-2xl font-bold gold-gradient-text">{(convertedValue / 1000000).toFixed(1)}M</div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id);
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-72"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = `${stage.color}40`;
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                handleDrop(stage.id);
              }}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: stage.color }}
                  />
                  <span className="text-sm font-semibold text-white">{stage.label}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#94A3B8]">
                  {stageLeads.length}
                </span>
              </div>

              {/* Lead Cards */}
              <div className="space-y-2 min-h-[200px] glass-card rounded-xl p-3 border border-white/5">
                {stageLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    layout
                    draggable
                    onDragStart={() => setDraggedLead(lead.id)}
                    className="p-3 rounded-xl bg-white/5 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{lead.name}</span>
                    </div>
                    <div className="text-xs text-[#64748B]">{lead.interest}</div>
                    <div className="text-xs text-[#64748B] mt-1">{lead.email}</div>
                  </motion.div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-xs text-[#475569]">
                    Glissez un lead ici
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
