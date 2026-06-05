'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Clock, BarChart3, ArrowRight, X, CheckCircle, Play, BookOpen } from 'lucide-react';
import { useAppStore, Formation } from '@/store/useAppStore';

const levelColors: Record<string, string> = {
  Débutant: '#10B981',
  Intermédiaire: '#F59E0B',
  Avancé: '#EF4444',
};

export default function Formations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { formations } = useAppStore();
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  return (
    <section id="formations" className="section-padding relative">
      {/* Background decoration */}
      <div
        className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-4 block">
            Apprentissage
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Mes <span className="gold-gradient-text">Formations</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#94A3B8] text-lg">
            Des programmes intensifs conçus pour vous donner un avantage compétitif
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {formations.map((formation, i) => (
            <motion.div
              key={formation.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group glass-card rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={formation.image}
                  alt={formation.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081120] via-[#081120]/50 to-transparent" />

                {/* Level Badge */}
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{
                    backgroundColor: `${levelColors[formation.level] || '#D4AF37'}30`,
                    border: `1px solid ${levelColors[formation.level] || '#D4AF37'}50`,
                  }}
                >
                  {formation.level}
                </div>

                {/* Play overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/90 flex items-center justify-center">
                    <Play size={20} className="text-[#081120] ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {formation.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mb-4 line-clamp-2">
                  {formation.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-4 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formation.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 size={12} />
                    {formation.modules.length} modules
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold gold-gradient-text">
                    {formation.price.toLocaleString()}{' '}
                    <span className="text-xs text-[#94A3B8]">FCFA</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedFormation(formation)}
                    className="p-2.5 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#081120] transition-all duration-300"
                  >
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Formation Detail Modal */}
      <AnimatePresence>
        {selectedFormation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedFormation(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative glass-strong rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button
                onClick={() => setSelectedFormation(null)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-[#64748B] hover:text-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                <img src={selectedFormation.image} alt={selectedFormation.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081120] via-transparent to-transparent" />
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{
                    backgroundColor: `${levelColors[selectedFormation.level] || '#D4AF37'}30`,
                    border: `1px solid ${levelColors[selectedFormation.level] || '#D4AF37'}50`,
                  }}
                >
                  {selectedFormation.level}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">{selectedFormation.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">{selectedFormation.description}</p>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6 text-sm text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <Clock size={16} className="text-[#D4AF37]" />
                  {selectedFormation.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={16} className="text-[#D4AF37]" />
                  {selectedFormation.modules.length} modules
                </span>
              </div>

              {/* Modules */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#CBD5E1] mb-3">Programme</h4>
                <div className="space-y-2">
                  {selectedFormation.modules.map((module, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 glass rounded-xl">
                      <span className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-white">{module}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold gold-gradient-text">
                  {selectedFormation.price.toLocaleString()} FCFA
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFormation(null)}
                  className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#E8C84A] text-[#081120] font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-shadow"
                >
                  S&apos;inscrire
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
