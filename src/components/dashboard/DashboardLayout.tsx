'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import Sidebar from './Sidebar';

// Original components
import CMSManager from './CMSManager';
import LeadManager from './LeadManager';
import CRM from './CRM';
import LandingPageBuilder from './LandingPageBuilder';
import Payments from './Payments';
import Settings from './Settings';

// KONNECT components
import Overview from './Overview';
import Contacts from './Contacts';
import Campagnes from './Campagnes';
import Sequences from './Sequences';
import CapturePages from './CapturePages';
import Evenements from './Evenements';
import Automatisations from './Automatisations';
import Analytics from './Analytics';
import Paiements from './Paiements';
import AIAssistant from './AIAssistant';
import Parametres from './Parametres';

const tabComponents: Record<string, React.ComponentType> = {
  // Principal
  overview: Overview,
  // Contenu (Original)
  cms: CMSManager,
  leads: LeadManager,
  crm: CRM,
  'landing-pages': LandingPageBuilder,
  // KONNECT Marketing
  contacts: Contacts,
  campagnes: Campagnes,
  sequences: Sequences,
  'capture-pages': CapturePages,
  evenements: Evenements,
  automatisations: Automatisations,
  // Finance & Analyse
  analytics: Analytics,
  paiements: Paiements,
  'payments-old': Payments,
  // Outils
  ia: AIAssistant,
  parametres: Parametres,
  // Alias: Settings is also accessible via parametres
  settings: Settings,
};

const tabTitles: Record<string, string> = {
  // Principal
  overview: 'Tableau de bord',
  // Contenu
  cms: 'Gestion du Contenu (CMS)',
  leads: 'Gestion des Leads',
  crm: 'CRM Pipeline',
  'landing-pages': 'Landing Pages',
  // KONNECT Marketing
  contacts: 'Contacts & CRM',
  campagnes: 'Campagnes SMS & WhatsApp',
  sequences: 'Séquences Automatisées',
  'capture-pages': 'Pages de Capture',
  evenements: 'Événements',
  automatisations: 'Automatisations',
  // Finance & Analyse
  analytics: 'Analytics',
  paiements: 'Paiements KONNECT',
  'payments-old': 'Transactions',
  // Outils
  ia: 'IA Assistant',
  parametres: 'Paramètres',
  settings: 'Paramètres',
};

export default function DashboardLayout() {
  const { activeTab } = useAppStore();
  const ActiveComponent = tabComponents[activeTab] || Overview;

  return (
    <div className="flex h-screen bg-[#06080f] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold">{tabTitles[activeTab] || 'Tableau de bord'}</h1>
              <div className="h-1 w-16 bg-gradient-to-r from-[#06B6D4] to-emerald-500 rounded-full mt-2" />
            </div>
            <ActiveComponent />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
