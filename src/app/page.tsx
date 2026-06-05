'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

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
  const { currentView } = useAppStore();

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
        {currentView === 'dashboard' && <DashboardLayout />}
        {currentView === 'auth' && <LoginPage />}
      </motion.div>
    </AnimatePresence>
  );
}
