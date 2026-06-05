'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function Books() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { books } = useAppStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = 320;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section id="books" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12"
        >
          <div>
            <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-4 block">
              Bibliothèque
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Mes <span className="gold-gradient-text">Livres</span>
            </h2>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2.5 glass rounded-xl hover:border-[#D4AF37]/30 transition-all disabled:opacity-30"
            >
              <ChevronLeft size={20} className="text-[#CBD5E1]" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2.5 glass rounded-xl hover:border-[#D4AF37]/30 transition-all disabled:opacity-30"
            >
              <ChevronRight size={20} className="text-[#CBD5E1]" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, x: 60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
            >
              <motion.div
                whileHover={{ y: -10, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="perspective-1000 group"
              >
                <div className="glass-card rounded-2xl overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#D4AF37]/10">
                  {/* Cover */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081120] via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#D4AF37] text-[#081120] text-xs font-bold">
                      {book.price.toLocaleString()} FCFA
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-[#94A3B8] mb-3">{book.author}</p>
                    <p className="text-xs text-[#64748B] mb-4 line-clamp-2">
                      {book.description}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#E8C84A] text-[#081120] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-shadow"
                    >
                      <ShoppingCart size={16} />
                      Acheter
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
