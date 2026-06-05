'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, FolderKanban, GraduationCap, Award } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Clients Accompagnés', value: 500, suffix: '+', color: '#D4AF37' },
  { icon: FolderKanban, label: 'Projets Réalisés', value: 150, suffix: '+', color: '#3B82F6' },
  { icon: GraduationCap, label: 'Formations Dispensées', value: 80, suffix: '+', color: '#8B5CF6' },
  { icon: Award, label: "Années d'Expérience", value: 10, suffix: '+', color: '#10B981' },
];

function Counter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
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
  }, [target, duration, isInView]);

  return <span ref={ref}>{mounted ? count.toLocaleString() : target.toLocaleString()}</span>;
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 sm:p-8 text-center group hover:border-[#D4AF37]/30 transition-all duration-500"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon size={28} style={{ color: stat.color }} />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                <Counter target={stat.value} />
                <span className="gold-gradient-text">{stat.suffix}</span>
              </div>
              <div className="text-sm text-[#94A3B8]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
