'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Monitor, TrendingUp, Brain, GraduationCap } from 'lucide-react';

const expertises = [
  {
    icon: Monitor,
    title: 'Transformation Digitale',
    description:
      'Accompagnement stratégique et opérationnel pour digitaliser votre entreprise. Du diagnostic à l\'implémentation, une approche sur mesure pour chaque organisation.',
    color: '#D4AF37',
  },
  {
    icon: TrendingUp,
    title: 'Marketing Digital',
    description:
      'Stratégies de marketing digital avancées pour développer votre visibilité et vos ventes. SEO, SEM, réseaux sociaux, email marketing et analytics.',
    color: '#3B82F6',
  },
  {
    icon: Brain,
    title: 'Intelligence Artificielle',
    description:
      'Intégration de solutions IA pour optimiser vos processus et créer un avantage compétitif. Machine learning, automatisation et data-driven decision making.',
    color: '#8B5CF6',
  },
  {
    icon: GraduationCap,
    title: 'Formation & Coaching',
    description:
      'Programmes de formation et coaching personnalisés pour développer les compétences digitales de vos équipes. Masterclass, workshops et mentorat.',
    color: '#10B981',
  },
];

export default function Expertise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="expertise" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-4 block">
            Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Mes Domaines d&apos;<span className="gold-gradient-text">Excellence</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#94A3B8] text-lg">
            Des compétences pointues au service de votre transformation digitale
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertises.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group glass-card rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-500 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/10"
            >
              {/* Icon */}
              <motion.div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300"
                style={{ background: `${item.color}15` }}
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <item.icon size={28} style={{ color: item.color }} />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                {item.description}
              </p>

              {/* Bottom Line */}
              <div
                className="mt-6 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
