'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navLinks = [
  { label: 'Expertise', href: '#expertise' },
  { label: 'Livres', href: '#books' },
  { label: 'Formations', href: '#formations' },
  { label: 'Événements', href: '#events' },
  { label: 'Témoignages', href: '#testimonials' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setView, logos, user, setUser, setFirebaseUser, setView: changeView } = useAppStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Utilisateur',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || '/images/ChatGPT Image 3 juin 2026, 21_08_22.png',
        });
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setFirebaseUser, setUser]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {logos.length > 0 ? (
                <img
                  src={logos[0].url}
                  alt="Yves Kossonou"
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#22D3EE] flex items-center justify-center text-[#081120] font-bold text-lg">
                  YK
                </div>
              )}
              <span className="text-lg font-semibold turquoise-gradient-text hidden sm:block">
                Yves Kossonou
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm text-[#CBD5E1] hover:text-[#06B6D4] transition-colors duration-300 rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setView('dashboard')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-[#06B6D4]/25 transition-shadow duration-300"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </motion.button>
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex p-2.5 rounded-xl hover:bg-white/5 text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                    title="Déconnexion"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setView('auth')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-[#06B6D4]/25 transition-shadow duration-300"
                >
                  <LogIn size={16} />
                  Connexion
                </motion.button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-[#CBD5E1] hover:text-[#06B6D4] transition-colors"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 glass-strong pt-20 md:hidden"
          >
            <div className="flex flex-col items-center gap-2 p-6">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full py-3 px-6 text-lg text-[#CBD5E1] hover:text-[#06B6D4] transition-colors text-center rounded-xl hover:bg-white/5"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full flex flex-col gap-2 mt-4"
              >
                {user ? (
                  <>
                    <button
                      onClick={() => { setMobileOpen(false); setView('dashboard'); }}
                      className="w-full py-3 px-6 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-lg rounded-xl flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard size={20} />
                      Dashboard
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="w-full py-3 px-6 glass text-[#EF4444] font-medium text-base rounded-xl flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); setView('auth'); }}
                    className="w-full py-3 px-6 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-lg rounded-xl flex items-center justify-center gap-2"
                  >
                    <LogIn size={20} />
                    Connexion
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
