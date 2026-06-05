'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Amadou Diallo',
    role: 'CEO, TechAfrica',
    quote:
      'Yves Kossonou a transformé notre approche digitale. Son expertise et sa vision ont été déterminantes pour notre croissance de 300% en 2 ans.',
    rating: 5,
    avatar: 'AD',
  },
  {
    name: 'Fatou Ndiaye',
    role: 'Directrice Marketing, FinTech SA',
    quote:
      'La formation en Marketing Digital a révolutionné notre stratégie. Les résultats sont visibles dès les premières semaines. Un investissement qui vaut de l\'or.',
    rating: 5,
    avatar: 'FN',
  },
  {
    name: 'Kouamé Yao',
    role: 'Fondateur, AI Solutions',
    quote:
      'Grâce au coaching de Yves, nous avons intégré l\'IA dans nos processus avec succès. Sa capacité à simplifier le complexe est remarquable.',
    rating: 5,
    avatar: 'KY',
  },
  {
    name: 'Marie Toure',
    role: 'Entrepreneure, E-Commerce',
    quote:
      'Le livre "Marketing Digital pour Entrepreneurs Africains" est une bible. Pratique, concret et adapté à notre réalité. Je le recommande à tous.',
    rating: 5,
    avatar: 'MT',
  },
  {
    name: 'Ibrahim Keita',
    role: 'Directeur Général, MediaGroup',
    quote:
      'La masterclass Transformation Digitale a été un tournant pour notre entreprise. L\'approche pédagogique est exceptionnelle et les résultats parlent.',
    rating: 5,
    avatar: 'IK',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index: number) => setActiveIndex(index);
  const goPrev = () => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % testimonials.length);

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[120px] -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-4 block">
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ce que disent mes <span className="gold-gradient-text">Clients</span>
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto"
          >
            {/* Quote Icon */}
            <div className="mb-6">
              <Quote size={48} className="text-[#D4AF37]/30 mx-auto" />
            </div>

            {/* Quote */}
            <p className="text-lg sm:text-xl text-[#CBD5E1] mb-8 leading-relaxed italic">
              &ldquo;{testimonials[activeIndex].quote}&rdquo;
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-6">
              {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                <Star key={i} size={18} className="text-[#D4AF37] fill-[#D4AF37]" />
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E8C84A] flex items-center justify-center text-[#081120] font-bold text-sm">
                {testimonials[activeIndex].avatar}
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">
                  {testimonials[activeIndex].name}
                </div>
                <div className="text-sm text-[#94A3B8]">
                  {testimonials[activeIndex].role}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goPrev}
              className="p-2 glass rounded-xl hover:border-[#D4AF37]/30 transition-all"
            >
              <ChevronLeft size={18} className="text-[#CBD5E1]" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'bg-[#D4AF37] w-6'
                      : 'bg-[#64748B] hover:bg-[#94A3B8]'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              className="p-2 glass rounded-xl hover:border-[#D4AF37]/30 transition-all"
            >
              <ChevronRight size={18} className="text-[#CBD5E1]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
