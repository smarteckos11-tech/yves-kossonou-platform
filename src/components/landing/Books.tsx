'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, X, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import { useAppStore, Book } from '@/store/useAppStore';

export default function Books() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { books } = useAppStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [purchaseBook, setPurchaseBook] = useState<Book | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<'payment' | 'success'>('payment');
  const [selectedPayment, setSelectedPayment] = useState<string>('wave');

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

  const handlePurchase = () => {
    setPurchaseStep('success');
    setTimeout(() => {
      setPurchaseBook(null);
      setPurchaseStep('payment');
    }, 3000);
  };

  const paymentMethods = [
    { id: 'wave', name: 'Wave', icon: '🌊', color: '#1DC7EA' },
    { id: 'orange', name: 'Orange Money', icon: '🟠', color: '#FF6600' },
    { id: 'mtn', name: 'MTN Money', icon: '🟡', color: '#FFCC00' },
    { id: 'card', name: 'Carte Bancaire', icon: '💳', color: '#06B6D4' },
  ];

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
            <span className="text-[#06B6D4] text-sm font-semibold tracking-widest uppercase mb-4 block">
              Bibliothèque
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Mes <span className="turquoise-gradient-text">Livres</span>
            </h2>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2.5 glass rounded-xl hover:border-[#06B6D4]/30 transition-all disabled:opacity-30"
            >
              <ChevronLeft size={20} className="text-[#CBD5E1]" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2.5 glass rounded-xl hover:border-[#06B6D4]/30 transition-all disabled:opacity-30"
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
                <div className="glass-card rounded-2xl overflow-hidden hover:border-[#06B6D4]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#06B6D4]/10">
                  {/* Cover */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081120] via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#06B6D4] text-[#081120] text-xs font-bold">
                      {book.price.toLocaleString()} FCFA
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-[#06B6D4] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-[#94A3B8] mb-3">{book.author}</p>
                    <p className="text-xs text-[#64748B] mb-4 line-clamp-2">
                      {book.description}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPurchaseBook(book)}
                      className="w-full py-2.5 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#06B6D4]/20 transition-shadow"
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

      {/* Purchase Modal */}
      <AnimatePresence>
        {purchaseBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => { setPurchaseBook(null); setPurchaseStep('payment'); }}
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
                onClick={() => { setPurchaseBook(null); setPurchaseStep('payment'); }}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 text-[#64748B] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {purchaseStep === 'payment' ? (
                <>
                  {/* Book Info */}
                  <div className="flex gap-4 mb-6">
                    <div className="w-20 h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={purchaseBook.coverImage} alt={purchaseBook.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{purchaseBook.title}</h3>
                      <p className="text-sm text-[#94A3B8] mb-2">{purchaseBook.author}</p>
                      <p className="text-xl font-bold turquoise-gradient-text">{purchaseBook.price.toLocaleString()} FCFA</p>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <h4 className="text-sm font-semibold text-[#CBD5E1] mb-3">Mode de paiement</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-3 rounded-xl text-left transition-all duration-300 ${
                          selectedPayment === method.id
                            ? 'bg-[#06B6D4]/10 border-2 border-[#06B6D4]/50'
                            : 'glass border border-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl">{method.icon}</span>
                        <p className="text-sm font-medium text-white mt-1">{method.name}</p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Pay Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePurchase}
                    className="w-full py-4 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-bold text-base rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#06B6D4]/30 transition-shadow"
                  >
                    <CreditCard size={18} />
                    Payer {purchaseBook.price.toLocaleString()} FCFA
                  </motion.button>
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
                  <h3 className="text-xl font-bold text-white mb-2">Paiement en cours !</h3>
                  <p className="text-[#94A3B8]">Votre commande pour &ldquo;{purchaseBook.title}&rdquo; est en cours de traitement.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
