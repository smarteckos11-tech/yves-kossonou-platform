'use client';

import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Bell, Search, Menu, User } from 'lucide-react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import CMSManager from './CMSManager';
import LeadManager from './LeadManager';
import LandingPageBuilder from './LandingPageBuilder';
import CRM from './CRM';
import Analytics from './Analytics';
import Payments from './Payments';
import AIAssistant from './AIAssistant';
import Settings from './Settings';

export default function DashboardLayout() {
  const { activeTab, sidebarOpen, setSidebarOpen, user } = useAppStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'cms':
      case 'cms-logos':
      case 'cms-photos':
      case 'cms-books':
      case 'cms-formations':
      case 'cms-events':
        return <CMSManager initialTab={activeTab} />;
      case 'leads':
        return <LeadManager />;
      case 'landing-pages':
        return <LandingPageBuilder />;
      case 'crm':
        return <CRM />;
      case 'analytics':
        return <Analytics />;
      case 'payments':
        return <Payments />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#081120] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 glass-strong border-b border-white/5 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-[#CBD5E1] transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-white/5 text-[#64748B] hover:text-[#CBD5E1] transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4AF37]" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E8C84A] flex items-center justify-center text-[#081120] font-bold text-xs">
                {user?.name?.charAt(0) || 'Y'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name || 'Yves Kossonou'}</p>
                <p className="text-xs text-[#64748B]">{user?.email || 'admin@yveskossonou.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
