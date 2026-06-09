'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Megaphone, GitBranch, FileText, Calendar,
  Workflow, BarChart3, CreditCard, Bot, Settings, LogOut, Zap,
  ChevronLeft, ChevronRight, MessageSquare, Smartphone, Globe
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

const navItems = [
  { id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'campagnes', label: 'Campagnes', icon: Megaphone, badge: 'SMS + WA' },
  { id: 'sequences', label: 'Séquences', icon: GitBranch, badge: 'Auto' },
  { id: 'capture-pages', label: 'Pages Capture', icon: FileText },
  { id: 'evenements', label: 'Événements', icon: Calendar },
  { id: 'automatisations', label: 'Automatisations', icon: Workflow },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'paiements', label: 'Paiements', icon: CreditCard },
  { id: 'ia', label: 'IA Assistant', icon: Bot, badge: 'Pro' },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, user, setView } = useAppStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('auth');
      toast.success('Déconnexion réussie');
    } catch {
      toast.error('Erreur de déconnexion');
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-[#0a0e1a] border-r border-[#1e293b]/50 flex flex-col relative overflow-hidden"
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#1e293b]/50 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#06080f]" />
          </div>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold tracking-wider whitespace-nowrap">
              KONNECT
            </motion.span>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#1e293b] border border-[#2d3a4d] rounded-full flex items-center justify-center hover:bg-[#2d3a4d] transition-colors z-10"
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]/30'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#D4AF37] rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-[#D4AF37]' : 'text-slate-500 group-hover:text-slate-300')} />
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </motion.span>
              )}
              {sidebarOpen && item.badge && (
                <span className={cn(
                  'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded',
                  item.badge === 'Pro' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-[#1e293b]/50 p-3 shrink-0">
        {sidebarOpen && (
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-emerald-500 flex items-center justify-center text-[#06080f] font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium truncate">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setView('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
        >
          <Globe className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="text-sm">Retour au site</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="text-sm">Déconnexion</span>}
        </button>
      </div>
    </motion.aside>
  );
}
