'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, BarChart3, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const levelColors: Record<string, string> = {
  Débutant: '#10B981',
  Intermédiaire: '#F59E0B',
  Avancé: '#EF4444',
};

export default function Formations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { formations } = useAppStore();

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
    </section>
  );
}
