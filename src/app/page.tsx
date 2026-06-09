'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LoginPage from '@/components/auth/LoginPage';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function Home() {
  const { currentView, setView, setFirebaseUser, setUser, setAuthLoading, authLoading } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setUser({
          name: user.displayName || 'Utilisateur',
          email: user.email || '',
          avatar: user.photoURL || '',
          uid: user.uid,
        });
        setView('dashboard');
      } else {
        setFirebaseUser(null);
        setUser(null);
        setView('auth');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [setView, setFirebaseUser, setUser, setAuthLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#06080f] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#D4AF37]/30 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
          <span className="text-[#D4AF37] font-semibold tracking-wider text-lg">KONNECT</span>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentView === 'auth' && <LoginPage />}
        {currentView === 'dashboard' && <DashboardLayout />}
      </motion.div>
    </AnimatePresence>
  );
}
