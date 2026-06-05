'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, Mail, Phone, Eye, UserPlus } from 'lucide-react';
import { useAppStore, Lead } from '@/store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const statusColors: Record<string, string> = {
  Nouveau: '#3B82F6',
  Contacté: '#F59E0B',
  Qualifié: '#8B5CF6',
  Proposition: '#EC4899',
  Converti: '#10B981',
};

const allStatuses: Lead['status'][] = ['Nouveau', 'Contacté', 'Qualifié', 'Proposition', 'Converti'];

export default function LeadManager() {
  const { leads, updateLeadStatus } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = filterStatus === 'all' ? leads : leads.filter((l) => l.status === filterStatus);

  const statusCounts = {
    all: leads.length,
    ...allStatuses.reduce(
      (acc, s) => ({ ...acc, [s]: leads.filter((l) => l.status === s).length }),
      {} as Record<string, number>
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des Leads</h1>
          <p className="text-[#94A3B8] text-sm mt-1">{leads.length} leads au total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 glass rounded-xl text-[#CBD5E1] text-sm flex items-center gap-2 hover:border-[#D4AF37]/30"
        >
          <Download size={16} /> Exporter
        </motion.button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            filterStatus === 'all'
              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
              : 'glass text-[#94A3B8] hover:text-white'
          }`}
        >
          Tous ({statusCounts.all})
        </button>
        {allStatuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filterStatus === status
                ? 'text-white border'
                : 'glass text-[#94A3B8] hover:text-white'
            }`}
            style={
              filterStatus === status
                ? { background: `${statusColors[status]}20`, borderColor: `${statusColors[status]}40` }
                : {}
            }
          >
            {status} ({statusCounts[status] || 0})
          </button>
        ))}
      </div>

      {/* Lead Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {allStatuses.map((status) => (
          <div key={status} className="glass-card rounded-xl p-3 text-center">
            <div className="text-2xl font-bold" style={{ color: statusColors[status] }}>
              {statusCounts[status] || 0}
            </div>
            <div className="text-xs text-[#64748B]">{status}</div>
          </div>
        ))}
      </div>

      {/* Lead List */}
      <div className="space-y-3">
        {filtered.map((lead, i) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-[#D4AF37]/20 transition-all cursor-pointer"
            onClick={() => setSelectedLead(lead)}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: `${statusColors[lead.status]}15`, color: statusColors[lead.status] }}
            >
              {lead.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white truncate">{lead.name}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: `${statusColors[lead.status]}15`, color: statusColors[lead.status] }}
                >
                  {lead.status}
                </span>
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">{lead.interest} • {lead.source}</div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#64748B]">
              <Mail size={12} />
              <span className="truncate max-w-[150px]">{lead.email}</span>
            </div>
            <div className="text-xs text-[#64748B]">{lead.date}</div>
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-[#D4AF37] transition-colors">
              <Eye size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Détails du Lead</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl"
                  style={{ background: `${statusColors[selectedLead.status]}15`, color: statusColors[selectedLead.status] }}
                >
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedLead.name}</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${statusColors[selectedLead.status]}15`, color: statusColors[selectedLead.status] }}
                  >
                    {selectedLead.status}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-[#D4AF37]" /> {selectedLead.email}</div>
                <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-[#D4AF37]" /> {selectedLead.phone}</div>
                <div className="text-sm text-[#94A3B8]">Intérêt : {selectedLead.interest}</div>
                <div className="text-sm text-[#94A3B8]">Source : {selectedLead.source}</div>
                <div className="text-sm text-[#94A3B8]">Date : {selectedLead.date}</div>
              </div>
              <div>
                <p className="text-sm text-[#94A3B8] mb-2">Changer le statut :</p>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateLeadStatus(selectedLead.id, status)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: selectedLead.status === status ? `${statusColors[status]}20` : 'rgba(255,255,255,0.05)',
                        color: selectedLead.status === status ? statusColors[status] : '#94A3B8',
                        border: selectedLead.status === status ? `1px solid ${statusColors[status]}40` : '1px solid transparent',
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
