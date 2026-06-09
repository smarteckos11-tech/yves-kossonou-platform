'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Landing
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Expertise from '@/components/landing/Expertise';
import Books from '@/components/landing/Books';
import Formations from '@/components/landing/Formations';
import Events from '@/components/landing/Events';
import Testimonials from '@/components/landing/Testimonials';
import Stats from '@/components/landing/Stats';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

// Dashboard
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Auth
import LoginPage from '@/components/auth/LoginPage';

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#081120]">
      <Navbar />
      <Hero />
      <Expertise />
      <Books />
      <Formations />
      <Events />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

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
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [setView, setFirebaseUser, setUser, setAuthLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#081120] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#D4AF37]/30 rounded-full" />
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
          <span className="text-[#D4AF37] font-semibold tracking-wider text-lg">Yves Kossonou</span>
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
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'auth' && <LoginPage />}
        {currentView === 'dashboard' && <DashboardLayout />}
      </motion.div>
    </AnimatePresence>
  );
}
