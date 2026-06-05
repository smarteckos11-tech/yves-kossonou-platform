'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, BookOpen, Rocket, Play } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import DynamicBackground from './DynamicBackground';

const headlines = [
  'Expert en Transformation Digitale',
  'Visionnaire du Marketing Digital',
  'Pionnier de l\'IA en Afrique',
  'Formateur & Coach d\'Excellence',
];

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{mounted ? count.toLocaleString() : target.toLocaleString()}</span>;
}

export default function Hero() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const { setView, logos } = useAppStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((i) => (i + 1) % headlines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Clients Accompagnés', value: 500, suffix: '+' },
    { label: 'Projets Réalisés', value: 150, suffix: '+' },
    { label: 'Formations Dispensées', value: 80, suffix: '+' },
    { label: 'Années d\'Expérience', value: 10, suffix: '+' },
  ];

  const profilePhoto = logos.length > 0 ? logos[0].url : '/images/ChatGPT Image 3 juin 2026, 21_08_22.png';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <DynamicBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Photo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-shrink-0 relative"
          >
            <div className="relative">
              {/* Animated rings around photo */}
              <motion.div
                className="absolute -inset-4 rounded-full border-2 border-[#D4AF37]/20"
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 3, repeat: Infinity } }}
              />
              <motion.div
                className="absolute -inset-8 rounded-full border border-[#D4AF37]/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#D4AF37]" />
              </motion.div>

              {/* Glow behind photo */}
              <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-3xl scale-110" />

              {/* Photo container */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-[#D4AF37]/40 shadow-2xl shadow-[#D4AF37]/20"
              >
                <img
                  src={profilePhoto}
                  alt="Yves Kossonou"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081120]/40 to-transparent" />
              </motion.div>

              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass-strong px-4 py-1.5 rounded-full flex items-center gap-2 border border-[#D4AF37]/30"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs text-[#CBD5E1] whitespace-nowrap">Disponible pour consulting</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Section */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span className="text-sm text-[#CBD5E1]">Plateforme Premium</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            </motion.div>

            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl text-[#94A3B8] mb-2 font-light"
            >
              Bonjour, je suis
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            >
              <span className="gold-gradient-text text-glow-gold">Yves</span>{' '}
              <span className="text-white">Kossonou</span>
            </motion.h1>

            {/* Rotating Headline */}
            <div className="h-10 sm:h-12 flex items-center justify-center lg:justify-start mb-6 overflow-hidden">
              <motion.p
                key={headlineIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="text-lg sm:text-xl md:text-2xl text-[#D4AF37] font-medium"
              >
                {headlines[headlineIndex]}
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-[#94A3B8] mb-8 leading-relaxed"
            >
              Accompagnez votre transformation digitale avec des stratégies éprouvées,
              des formations d&apos;excellence et une vision innovante pour les entrepreneurs africains.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const el = document.querySelector('#formations');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E8C84A] text-[#081120] font-bold text-base rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 flex items-center gap-2 pulse-glow"
              >
                <Rocket size={18} />
                Commencer Maintenant
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const el = document.querySelector('#books');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 glass text-[#CBD5E1] font-semibold text-base rounded-2xl hover:border-[#D4AF37]/50 transition-all duration-300 flex items-center gap-2"
              >
                <BookOpen size={18} />
                Découvrir les Livres
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('auth')}
                className="px-6 py-4 text-[#D4AF37] font-medium text-base rounded-2xl hover:bg-[#D4AF37]/5 transition-all duration-300 flex items-center gap-2"
              >
                <Play size={18} />
                Espace Client
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                  className="glass-card rounded-2xl p-3 sm:p-4"
                >
                  <div className="text-xl sm:text-2xl font-bold gold-gradient-text mb-0.5">
                    <AnimatedCounter target={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-[10px] sm:text-xs text-[#94A3B8]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <button
          onClick={() => {
            const el = document.querySelector('#expertise');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-2 text-[#94A3B8] hover:text-[#D4AF37] transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Découvrir</span>
          <ArrowDown size={20} />
        </button>
      </motion.div>
    </section>
  );
}
