'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, Sparkles, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { addLead } = useAppStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      id: `lead-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      interest: form.interest,
      status: 'Nouveau',
      date: new Date().toISOString().split('T')[0],
      source: 'Landing Page',
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', phone: '', interest: '' });
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient-bg" />
      <div
        className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }}
      />
      <div
        className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 rounded-full bg-[#D4AF37]/40"
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-6 h-6 rounded-full bg-[#3B82F6]/30"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 sm:p-12 md:p-16 text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-8"
          >
            <Sparkles size={32} className="text-[#D4AF37]" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Prêt à <span className="gold-gradient-text">Transformer</span> votre Business ?
          </h2>
          <p className="text-[#94A3B8] text-lg mb-10 max-w-2xl mx-auto">
            Rejoignez des centaines d&apos;entrepreneurs qui ont déjà accéléré leur croissance grâce à nos solutions.
          </p>

          {/* Form */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8"
            >
              <CheckCircle size={48} className="text-[#10B981]" />
              <p className="text-xl font-semibold text-white">Merci pour votre intérêt !</p>
              <p className="text-[#94A3B8]">Nous vous recontacterons très bientôt.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Votre nom"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
              />
              <input
                type="email"
                placeholder="Votre email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
              />
              <input
                type="tel"
                placeholder="Votre téléphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
              />
              <select
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
                required
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all appearance-none"
              >
                <option value="" className="bg-[#0F172A]">Centre d&apos;intérêt</option>
                <option value="Transformation Digitale" className="bg-[#0F172A]">Transformation Digitale</option>
                <option value="Marketing Digital" className="bg-[#0F172A]">Marketing Digital</option>
                <option value="Intelligence Artificielle" className="bg-[#0F172A]">Intelligence Artificielle</option>
                <option value="Formation" className="bg-[#0F172A]">Formation & Coaching</option>
              </select>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="sm:col-span-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E8C84A] text-[#081120] font-bold text-base rounded-2xl flex items-center justify-center gap-2 pulse-glow hover:shadow-xl hover:shadow-[#D4AF37]/30 transition-shadow"
              >
                <Send size={18} />
                Commencer Maintenant
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
