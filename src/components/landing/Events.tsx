'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, X, CreditCard, CheckCircle, User, Mail, Phone } from 'lucide-react';
import { useAppStore, Event } from '@/store/useAppStore';

function calculateTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-2">
      {[
        { label: 'J', value: timeLeft.days },
        { label: 'H', value: timeLeft.hours },
        { label: 'M', value: timeLeft.minutes },
        { label: 'S', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
            {String(item.value).padStart(2, '0')}
          </div>
          <span className="text-[10px] text-[#64748B] mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Events() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { events, addLead } = useAppStore();
  const [registerEvent, setRegisterEvent] = useState<Event | null>(null);
  const [registerStep, setRegisterStep] = useState<'form' | 'success'>('form');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      id: `lead-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      interest: `Événement: ${registerEvent?.title}`,
      status: 'Nouveau',
      date: new Date().toISOString().split('T')[0],
      source: 'Événement',
    });
    setRegisterStep('success');
    setTimeout(() => {
      setRegisterEvent(null);
      setRegisterStep('form');
      setForm({ name: '', email: '', phone: '' });
    }, 3000);
  };

  return (
    <section id="events" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-4 block">
            Agenda
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Mes <span className="gold-gradient-text">Événements</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#94A3B8] text-lg">
            Rejoignez-nous pour des expériences uniques de networking et apprentissage
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/50 via-[#D4AF37]/20 to-transparent" />

          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={`relative mb-12 last:mb-0 ${
                i % 2 === 0
                  ? 'md:pr-[calc(50%+2rem)] md:text-right'
                  : 'md:pl-[calc(50%+2rem)]'
              }`}
            >
              {/* Timeline Dot */}
              <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-[#D4AF37] border-4 border-[#081120] z-10" />

              {/* Card */}
              <motion.div
                whileHover={{ y: -5, scale: 1.01 }}
                className="glass-card rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-500"
              >
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0F172A] hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent md:hidden" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div
                      className={`flex flex-col md:flex-row gap-3 mb-3 ${
                        i % 2 === 0 ? 'md:justify-end' : ''
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full w-fit">
                        <Calendar size={12} />
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#CBD5E1] bg-white/5 px-3 py-1 rounded-full w-fit">
                        <MapPin size={12} />
                        {event.location}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[#94A3B8] mb-4">{event.description}</p>

                    <div
                      className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
                        i % 2 === 0 ? 'md:justify-end' : ''
                      }`}
                    >
                      <CountdownTimer targetDate={event.date} />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setRegisterEvent(event)}
                        className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#E8C84A] text-[#081120] font-semibold text-sm rounded-xl flex items-center gap-2"
                      >
                        S&apos;inscrire
                        <ArrowRight size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {registerEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => { setRegisterEvent(null); setRegisterStep('form'); }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative glass-strong rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => { setRegisterEvent(null); setRegisterStep('form'); }}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-[#64748B] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {registerStep === 'form' ? (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">Inscription</h3>
                  <p className="text-sm text-[#94A3B8] mb-6">{registerEvent.title} — {registerEvent.price.toLocaleString()} FCFA</p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="text-sm text-[#94A3B8] mb-1.5 block">Nom complet</label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Votre nom"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-[#94A3B8] mb-1.5 block">Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="votre@email.com"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-[#94A3B8] mb-1.5 block">Téléphone</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+225 07 12 34 56"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                        />
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#E8C84A] text-[#081120] font-bold text-base rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-shadow"
                    >
                      <CreditCard size={18} />
                      S&apos;inscrire — {registerEvent.price.toLocaleString()} FCFA
                    </motion.button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle size={64} className="text-[#10B981] mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Inscription réussie !</h3>
                  <p className="text-[#94A3B8]">Vous recevrez un email de confirmation pour &ldquo;{registerEvent.title}&rdquo;.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
