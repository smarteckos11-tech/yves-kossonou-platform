'use client';

import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  FileCode2,
  GitCompareArrows,
  BarChart3,
  CreditCard,
  Bot,
  Settings,
  ChevronLeft,
  LogOut,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Image as ImageIcon,
  Camera,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const mainNav = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
];

const contentNav = [
  { id: 'cms', label: 'Gestion Contenu', icon: FileText, sub: [
    { id: 'cms-logos', label: 'Logos', icon: ImageIcon },
    { id: 'cms-photos', label: 'Photos', icon: Camera },
    { id: 'cms-books', label: 'Livres', icon: BookOpen },
    { id: 'cms-formations', label: 'Formations', icon: GraduationCap },
    { id: 'cms-events', label: 'Événements', icon: CalendarDays },
  ]},
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'landing-pages', label: 'Landing Pages', icon: FileCode2 },
];

const marketingNav = [
  { id: 'crm', label: 'CRM Pipeline', icon: GitCompareArrows },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const financeNav = [
  { id: 'payments', label: 'Paiements', icon: CreditCard },
];

const otherNav = [
  { id: 'ai-assistant', label: 'Assistant IA', icon: Bot },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, activeTab, setActiveTab, logos, setView } = useAppStore();

  const handleNavClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen glass-strong flex flex-col border-r border-white/5 overflow-hidden flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          {logos.length > 0 ? (
            <img
              src={logos[0].url}
              alt="Logo"
              className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#E8C84A] flex items-center justify-center text-[#081120] font-bold text-xs flex-shrink-0">
              YK
            </div>
          )}
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-semibold gold-gradient-text whitespace-nowrap"
            >
              Yves Kossonou
            </motion.span>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-[#CBD5E1] transition-colors"
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-6">
        {/* Main */}
        <NavSection items={mainNav} activeTab={activeTab} onClick={handleNavClick} open={sidebarOpen} />

        {/* Content */}
        <div>
          {sidebarOpen && (
            <div className="px-4 mb-2 text-[10px] font-semibold tracking-widest uppercase text-[#475569]">
              Contenu
            </div>
          )}
          {contentNav.map((item) =>
            'sub' in item && item.sub ? (
              <div key={item.id}>
                <NavButton
                  item={{ id: item.id, label: item.label, icon: item.icon }}
                  activeTab={activeTab}
                  onClick={handleNavClick}
                  open={sidebarOpen}
                />
                {sidebarOpen && (
                  <div className="ml-4 border-l border-white/5 pl-2">
                    {item.sub.map((sub) => (
                      <NavButton
                        key={sub.id}
                        item={sub}
                        activeTab={activeTab}
                        onClick={handleNavClick}
                        open={sidebarOpen}
                        small
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavButton
                key={item.id}
                item={item as { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }}
                activeTab={activeTab}
                onClick={handleNavClick}
                open={sidebarOpen}
              />
            )
          )}
        </div>

        {/* Marketing */}
        <div>
          {sidebarOpen && (
            <div className="px-4 mb-2 text-[10px] font-semibold tracking-widest uppercase text-[#475569]">
              Marketing
            </div>
          )}
          <NavSection items={marketingNav} activeTab={activeTab} onClick={handleNavClick} open={sidebarOpen} />
        </div>

        {/* Finance */}
        <div>
          {sidebarOpen && (
            <div className="px-4 mb-2 text-[10px] font-semibold tracking-widest uppercase text-[#475569]">
              Finance
            </div>
          )}
          <NavSection items={financeNav} activeTab={activeTab} onClick={handleNavClick} open={sidebarOpen} />
        </div>

        {/* Other */}
        <div>
          {sidebarOpen && (
            <div className="px-4 mb-2 text-[10px] font-semibold tracking-widest uppercase text-[#475569]">
              Outils
            </div>
          )}
          <NavSection items={otherNav} activeTab={activeTab} onClick={handleNavClick} open={sidebarOpen} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-[#64748B] hover:text-[#CBD5E1] hover:bg-white/5 transition-all"
        >
          <ChevronLeft size={18} className="rotate-180" />
          {sidebarOpen && <span className="text-sm">Retour au site</span>}
        </button>
        <button
          onClick={async () => { try { await signOut(auth); } catch(e) {} setView('landing'); }}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/5 transition-all"
        >
          <LogOut size={18} />
          {sidebarOpen && <span className="text-sm">Déconnexion</span>}
        </button>
      </div>
    </motion.aside>
  );
}

function NavSection({
  items,
  activeTab,
  onClick,
  open,
}: {
  items: { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[];
  activeTab: string;
  onClick: (id: string) => void;
  open: boolean;
}) {
  return (
    <div className="space-y-1 px-2">
      {items.map((item) => (
        <NavButton key={item.id} item={item} activeTab={activeTab} onClick={onClick} open={open} />
      ))}
    </div>
  );
}

function NavButton({
  item,
  activeTab,
  onClick,
  open,
  small,
}: {
  item: { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> };
  activeTab: string;
  onClick: (id: string) => void;
  open: boolean;
  small?: boolean;
}) {
  const isActive = activeTab === item.id;
  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={() => onClick(item.id)}
      className={`flex items-center gap-3 px-3 py-2 w-full rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
          : 'text-[#94A3B8] hover:bg-white/5 hover:text-[#CBD5E1] border border-transparent'
      } ${small ? 'py-1.5' : ''}`}
    >
      <item.icon size={small ? 14 : 18} className="flex-shrink-0" />
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm whitespace-nowrap ${small ? 'text-xs' : ''}`}
        >
          {item.label}
        </motion.span>
      )}
    </motion.button>
  );
}
