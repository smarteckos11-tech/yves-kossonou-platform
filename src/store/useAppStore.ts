import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

export type ViewType = 'auth' | 'dashboard';

// ─── Contact / CRM ───
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  segment: string;
  source: string;
  score: number;
  notes: string;
  lastContact: string;
  createdAt: string;
  whatsappOptIn: boolean;
  smsOptIn: boolean;
}

// ─── Campagne ───
export type ChannelType = 'sms' | 'whatsapp' | 'both';
export type CampaignStatus = 'brouillon' | 'planifiée' | 'envoyée' | 'en_cours' | 'terminée';

export interface CampaignMessage {
  id: string;
  content: string;
  channel: 'sms' | 'whatsapp';
  mediaUrl?: string;
  mediaType?: 'image' | 'document' | 'audio';
  buttons?: { label: string; url: string }[];
  delayMinutes?: number;
  variant?: 'A' | 'B';
}

export interface Campaign {
  id: string;
  name: string;
  channel: ChannelType;
  status: CampaignStatus;
  targetSegment: string;
  targetTags: string[];
  messages: CampaignMessage[];
  scheduledAt: string;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  replyCount: number;
  abTestEnabled: boolean;
  createdAt: string;
}

// ─── Séquence ───
export type SequenceStepType = 'sms' | 'whatsapp' | 'wait' | 'condition' | 'action';

export interface SequenceStep {
  id: string;
  type: SequenceStepType;
  channel?: 'sms' | 'whatsapp';
  content?: string;
  mediaUrl?: string;
  waitDuration?: number; // in minutes
  waitUnit?: 'minutes' | 'heures' | 'jours';
  condition?: { field: string; operator: string; value: string };
  action?: { type: string; params: Record<string, string> };
  buttons?: { label: string; url: string }[];
}

export interface Sequence {
  id: string;
  name: string;
  description: string;
  steps: SequenceStep[];
  targetSegment: string;
  targetTags: string[];
  isActive: boolean;
  enrolledCount: number;
  completedCount: number;
  createdAt: string;
}

// ─── Page de Capture ───
export type CaptureTemplate = 'conference' | 'workshop' | 'webinaire' | 'meetup' | 'formation' | 'custom';

export interface CapturePage {
  id: string;
  title: string;
  template: CaptureTemplate;
  headline: string;
  subheadline: string;
  ctaText: string;
  coverImage: string;
  fields: string[];
  backgroundColor: string;
  accentColor: string;
  published: boolean;
  visits: number;
  conversions: number;
  linkedEventId?: string;
  linkedSequenceId?: string;
  createdAt: string;
}

// ─── Événement ───
export interface Evenement {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  onlineLink?: string;
  coverImage: string;
  price: number;
  currency: string;
  maxAttendees: number;
  registeredCount: number;
  qrCodeEnabled: boolean;
  reminderSequenceId?: string;
  capturePageId?: string;
  status: 'à_venir' | 'en_cours' | 'terminé' | 'annulé';
  createdAt: string;
}

// ─── Automation ───
export type TriggerType = 'new_contact' | 'form_submit' | 'link_click' | 'event_register' | 'tag_added' | 'date';
export type ActionType = 'send_sms' | 'send_whatsapp' | 'add_tag' | 'remove_tag' | 'move_segment' | 'start_sequence' | 'notify' | 'wait';

export interface AutomationTrigger {
  id: string;
  type: TriggerType;
  params: Record<string, string>;
}

export interface AutomationAction {
  id: string;
  type: ActionType;
  params: Record<string, string>;
  nextActionId?: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  isActive: boolean;
  runCount: number;
  lastRunAt: string;
  createdAt: string;
}

// ─── Paiement ───
export type PaymentMethod = 'wave' | 'orange_money' | 'mtn_money' | 'carte';
export type PaymentStatus = 'en_attente' | 'confirmé' | 'échoué' | 'remboursé';

export interface Payment {
  id: string;
  contactName: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
  date: string;
}

// ─── User ───
export interface AppUser {
  name: string;
  email: string;
  avatar: string;
  uid?: string;
}

// ─── Sample Data ───
const sampleContacts: Contact[] = [
  { id: 'c1', name: 'Amadou Diallo', phone: '+221 77 123 4567', email: 'amadou@email.com', tags: ['VIP', 'Formation'], segment: 'Prospects chauds', source: 'Événement', score: 85, notes: 'Très intéressé par la masterclass', lastContact: '2026-06-05', createdAt: '2026-05-01', whatsappOptIn: true, smsOptIn: true },
  { id: 'c2', name: 'Fatou Ndiaye', phone: '+221 78 987 6543', email: 'fatou@email.com', tags: ['Workshop'], segment: 'Nouveaux', source: 'Page capture', score: 60, notes: 'Inscrite au workshop IA', lastContact: '2026-06-03', createdAt: '2026-05-15', whatsappOptIn: true, smsOptIn: false },
  { id: 'c3', name: 'Kouamé Yao', phone: '+225 07 12 34 56', email: 'kouame@email.com', tags: ['VIP', 'Conference'], segment: 'Clients', source: 'Référence', score: 95, notes: 'Client fidèle, 3 formations achetées', lastContact: '2026-06-07', createdAt: '2026-01-20', whatsappOptIn: true, smsOptIn: true },
  { id: 'c4', name: 'Marie Toure', phone: '+223 76 54 32 10', email: 'marie@email.com', tags: ['Formation'], segment: 'Prospects froids', source: 'Site web', score: 30, notes: 'A visité la page mais pas inscrit', lastContact: '2026-05-28', createdAt: '2026-05-20', whatsappOptIn: false, smsOptIn: true },
  { id: 'c5', name: 'Ibrahim Keita', phone: '+223 65 43 21 09', email: 'ibrahim@email.com', tags: ['Masterclass', 'VIP'], segment: 'Clients', source: 'Événement', score: 90, notes: 'Participe au sommet digital', lastContact: '2026-06-06', createdAt: '2026-02-10', whatsappOptIn: true, smsOptIn: true },
  { id: 'c6', name: 'Aïcha Bamba', phone: '+225 05 98 76 54', email: 'aicha@email.com', tags: ['Workshop', 'IA'], segment: 'Prospects chauds', source: 'WhatsApp', score: 72, notes: 'Questions sur programme IA', lastContact: '2026-06-04', createdAt: '2026-04-05', whatsappOptIn: true, smsOptIn: false },
  { id: 'c7', name: 'Ousmane Sy', phone: '+223 79 11 22 33', email: 'ousmane@email.com', tags: ['Conference'], segment: 'Nouveaux', source: 'Page capture', score: 45, notes: '', lastContact: '2026-06-01', createdAt: '2026-05-30', whatsappOptIn: true, smsOptIn: true },
  { id: 'c8', name: 'Aminata Dabo', phone: '+221 76 44 55 66', email: 'aminata@email.com', tags: ['Formation', 'VIP'], segment: 'Clients', source: 'Référence', score: 88, notes: 'Recommande à ses collègues', lastContact: '2026-06-08', createdAt: '2026-03-12', whatsappOptIn: true, smsOptIn: true },
];

const sampleCampaigns: Campaign[] = [
  { id: 'camp1', name: 'Lancement Sommet Digital', channel: 'both', status: 'envoyée', targetSegment: 'Tous', targetTags: [], messages: [{ id: 'm1', content: '🚀 Le Sommet Digital Afrique 2026 arrive ! Réservez votre place dès maintenant.', channel: 'sms', variant: 'A' }, { id: 'm2', content: '🎉 Ne manquez PAS le Sommet Digital Afrique ! Places limitées → inscrivez-vous maintenant', channel: 'whatsapp', variant: 'B' }], scheduledAt: '2026-06-01T09:00:00', sentCount: 450, deliveredCount: 432, readCount: 380, replyCount: 67, abTestEnabled: true, createdAt: '2026-05-28' },
  { id: 'camp2', name: 'Rappel Workshop IA', channel: 'whatsapp', status: 'planifiée', targetSegment: 'Prospects chauds', targetTags: ['Workshop', 'IA'], messages: [{ id: 'm3', content: '⏰ Rappel : Le Workshop IA & Business commence dans 3 jours ! Préparez vos questions.', channel: 'whatsapp', mediaUrl: '', buttons: [{ label: 'Voir le programme', url: '#' }] }], scheduledAt: '2026-06-25T08:00:00', sentCount: 0, deliveredCount: 0, readCount: 0, replyCount: 0, abTestEnabled: false, createdAt: '2026-06-05' },
  { id: 'camp3', name: 'Offre Spéciale Formation', channel: 'sms', status: 'brouillon', targetSegment: 'Prospects froids', targetTags: [], messages: [{ id: 'm4', content: '🔥 Offre flash : -30% sur la Masterclass Transformation Digitale. Code : FLASH30. Valable 48h.', channel: 'sms' }], scheduledAt: '', sentCount: 0, deliveredCount: 0, readCount: 0, replyCount: 0, abTestEnabled: false, createdAt: '2026-06-08' },
];

const sampleSequences: Sequence[] = [
  { id: 'seq1', name: 'Relance Post-Événement', description: 'Séquence de suivi après un événement', steps: [
    { id: 's1', type: 'whatsapp', channel: 'whatsapp', content: 'Merci pour votre présence ! Voici les ressources promises 🎁' },
    { id: 's2', type: 'wait', waitDuration: 2, waitUnit: 'jours' },
    { id: 's3', type: 'sms', channel: 'sms', content: 'Avez-vous consulté les ressources ? Répondez OUI ou NON' },
    { id: 's4', type: 'wait', waitDuration: 3, waitUnit: 'jours' },
    { id: 's5', type: 'whatsapp', channel: 'whatsapp', content: '🎁 Offre exclusive : -20% sur notre prochaine formation. Lien : [PAYMENT_LINK]' },
  ], targetSegment: 'Tous', targetTags: [], isActive: true, enrolledCount: 234, completedCount: 156, createdAt: '2026-05-15' },
  { id: 'seq2', name: 'Bienvenue Nouveau Contact', description: 'Séquence d\'accueil automatisée', steps: [
    { id: 's6', type: 'whatsapp', channel: 'whatsapp', content: '👋 Bienvenue ! Je suis Yves Kossonou. Ravi de vous compter parmi nous.' },
    { id: 's7', type: 'wait', waitDuration: 1, waitUnit: 'jours' },
    { id: 's8', type: 'whatsapp', channel: 'whatsapp', content: '📚 Découvrez nos meilleures ressources gratuites : [LIEN]' },
    { id: 's9', type: 'wait', waitDuration: 3, waitUnit: 'jours' },
    { id: 's10', type: 'sms', channel: 'sms', content: 'Prêt à transformer votre business ? Découvrez notre prochaine formation : [LIEN]' },
  ], targetSegment: 'Nouveaux', targetTags: [], isActive: true, enrolledCount: 89, completedCount: 45, createdAt: '2026-04-20' },
];

const sampleCapturePages: CapturePage[] = [
  { id: 'cp1', title: 'Sommet Digital 2026', template: 'conference', headline: 'Le Plus Grand Rassemblement Digital d\'Afrique', subheadline: 'Rejoignez 500+ leaders du digital les 15-17 Juillet 2026 à Abidjan', ctaText: 'Réserver Ma Place', coverImage: '/images/ChatGPT Image 4 juin 2026, 10_20_50.png', fields: ['name', 'email', 'phone'], backgroundColor: '#081120', accentColor: '#D4AF37', published: true, visits: 1240, conversions: 342, linkedEventId: 'evt1', createdAt: '2026-05-01' },
  { id: 'cp2', title: 'Workshop IA & Business', template: 'workshop', headline: 'Maîtrisez l\'IA pour Votre Business', subheadline: 'Atelier pratique — 28 Juin 2026 à Dakar', ctaText: 'S\'inscrire', coverImage: '/images/ChatGPT Image 4 juin 2026, 09_29_20.png', fields: ['name', 'email', 'phone', 'company'], backgroundColor: '#0F172A', accentColor: '#10B981', published: true, visits: 680, conversions: 187, linkedEventId: 'evt2', createdAt: '2026-05-10' },
  { id: 'cp3', title: 'Webinaire Marketing Digital', template: 'webinaire', headline: '5 Stratégies Marketing qui Fonctionnent en Afrique', subheadline: 'Webinaire gratuit — 20 Juillet 2026', ctaText: 'Accéder au Webinaire', coverImage: '/images/ChatGPT Image 4 juin 2026, 10_01_34.png', fields: ['name', 'email'], backgroundColor: '#1a1a2e', accentColor: '#E94560', published: false, visits: 0, conversions: 0, createdAt: '2026-06-07' },
];

const sampleEvenements: Evenement[] = [
  { id: 'evt1', title: 'Sommet Digital Afrique 2026', description: 'Le plus grand rassemblement digital d\'Afrique francophone. 3 jours de conférences, ateliers et networking.', date: '2026-07-15', time: '09:00', location: 'Palais de la Culture, Abidjan', isOnline: false, coverImage: '/images/ChatGPT Image 4 juin 2026, 10_20_50.png', price: 50000, currency: 'FCFA', maxAttendees: 500, registeredCount: 342, qrCodeEnabled: true, capturePageId: 'cp1', status: 'à_venir', createdAt: '2026-05-01' },
  { id: 'evt2', title: 'Workshop IA & Business', description: 'Atelier pratique sur l\'intégration de l\'IA dans les modèles d\'affaires africains.', date: '2026-06-28', time: '14:00', location: 'Dakar Arena, Sénégal', isOnline: false, coverImage: '/images/ChatGPT Image 4 juin 2026, 09_29_20.png', price: 35000, currency: 'FCFA', maxAttendees: 100, registeredCount: 78, qrCodeEnabled: true, capturePageId: 'cp2', status: 'à_venir', createdAt: '2026-05-10' },
  { id: 'evt3', title: 'Conférence Marketing Digital', description: 'Les dernières tendances du marketing digital avec focus marchés africains.', date: '2026-08-10', time: '10:00', location: 'Paris, France', isOnline: true, onlineLink: 'https://zoom.us/example', coverImage: '/images/ChatGPT Image 4 juin 2026, 10_06_08.png', price: 75000, currency: 'FCFA', maxAttendees: 200, registeredCount: 56, qrCodeEnabled: false, capturePageId: 'cp3', status: 'à_venir', createdAt: '2026-05-20' },
];

const sampleAutomations: Automation[] = [
  { id: 'auto1', name: 'Bienvenue Auto', description: 'Envoie un message de bienvenue quand un nouveau contact est ajouté', trigger: { id: 't1', type: 'new_contact', params: {} }, actions: [
    { id: 'a1', type: 'send_whatsapp', params: { content: '👋 Bienvenue ! Ravi de vous compter parmi nous.' }, nextActionId: 'a2' },
    { id: 'a2', type: 'add_tag', params: { tag: 'Nouveau' }, nextActionId: 'a3' },
    { id: 'a3', type: 'start_sequence', params: { sequenceId: 'seq2' } },
  ], isActive: true, runCount: 89, lastRunAt: '2026-06-08', createdAt: '2026-04-20' },
  { id: 'auto2', name: 'Rappel Événement J-3', description: 'Envoie un rappel SMS 3 jours avant un événement', trigger: { id: 't2', type: 'date', params: { daysBefore: '3' } }, actions: [
    { id: 'a4', type: 'send_sms', params: { content: '⏰ Rappel : [EVENT_NAME] dans 3 jours !' }, nextActionId: 'a5' },
    { id: 'a5', type: 'send_whatsapp', params: { content: '📅 N\'oubliez pas : [EVENT_NAME] approche ! Voici le programme complet.' } },
  ], isActive: true, runCount: 45, lastRunAt: '2026-06-06', createdAt: '2026-05-15' },
];

const samplePayments: Payment[] = [
  { id: 'pay1', contactName: 'Kouamé Yao', amount: 50000, currency: 'FCFA', method: 'wave', status: 'confirmé', description: 'Sommet Digital Afrique 2026', date: '2026-06-05' },
  { id: 'pay2', contactName: 'Amadou Diallo', amount: 150000, currency: 'FCFA', method: 'orange_money', status: 'confirmé', description: 'Masterclass Transformation Digitale', date: '2026-06-03' },
  { id: 'pay3', contactName: 'Fatou Ndiaye', amount: 35000, currency: 'FCFA', method: 'mtn_money', status: 'en_attente', description: 'Workshop IA & Business', date: '2026-06-07' },
  { id: 'pay4', contactName: 'Ibrahim Keita', amount: 75000, currency: 'FCFA', method: 'carte', status: 'confirmé', description: 'Conférence Marketing Digital', date: '2026-06-01' },
  { id: 'pay5', contactName: 'Aminata Dabo', amount: 100000, currency: 'FCFA', method: 'wave', status: 'confirmé', description: 'Marketing Digital Avancé', date: '2026-05-28' },
];

// ─── Store Interface ───
interface AppState {
  currentView: ViewType;
  activeTab: string;
  sidebarOpen: boolean;
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;

  // Data
  contacts: Contact[];
  campaigns: Campaign[];
  sequences: Sequence[];
  capturePages: CapturePage[];
  evenements: Evenement[];
  automations: Automation[];
  payments: Payment[];

  // Actions
  setView: (view: ViewType) => void;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setUser: (user: AppUser | null) => void;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setAuthLoading: (loading: boolean) => void;

  // Contact actions
  addContact: (contact: Contact) => void;
  updateContact: (id: string, data: Partial<Contact>) => void;
  deleteContact: (id: string) => void;

  // Campaign actions
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  // Sequence actions
  addSequence: (sequence: Sequence) => void;
  updateSequence: (id: string, data: Partial<Sequence>) => void;
  deleteSequence: (id: string) => void;

  // Capture page actions
  addCapturePage: (page: CapturePage) => void;
  updateCapturePage: (id: string, data: Partial<CapturePage>) => void;
  deleteCapturePage: (id: string) => void;
  toggleCapturePagePublish: (id: string) => void;

  // Event actions
  addEvenement: (event: Evenement) => void;
  updateEvenement: (id: string, data: Partial<Evenement>) => void;
  deleteEvenement: (id: string) => void;

  // Automation actions
  addAutomation: (automation: Automation) => void;
  updateAutomation: (id: string, data: Partial<Automation>) => void;
  deleteAutomation: (id: string) => void;

  // Payment actions
  addPayment: (payment: Payment) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'auth',
  activeTab: 'overview',
  sidebarOpen: true,
  user: null,
  firebaseUser: null,
  authLoading: true,

  contacts: sampleContacts,
  campaigns: sampleCampaigns,
  sequences: sampleSequences,
  capturePages: sampleCapturePages,
  evenements: sampleEvenements,
  automations: sampleAutomations,
  payments: samplePayments,

  setView: (view) => set({ currentView: view }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setUser: (user) => set({ user }),
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),

  addContact: (contact) => set((s) => ({ contacts: [...s.contacts, contact] })),
  updateContact: (id, data) => set((s) => ({ contacts: s.contacts.map((c) => c.id === id ? { ...c, ...data } : c) })),
  deleteContact: (id) => set((s) => ({ contacts: s.contacts.filter((c) => c.id !== id) })),

  addCampaign: (campaign) => set((s) => ({ campaigns: [...s.campaigns, campaign] })),
  updateCampaign: (id, data) => set((s) => ({ campaigns: s.campaigns.map((c) => c.id === id ? { ...c, ...data } : c) })),
  deleteCampaign: (id) => set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) })),

  addSequence: (sequence) => set((s) => ({ sequences: [...s.sequences, sequence] })),
  updateSequence: (id, data) => set((s) => ({ sequences: s.sequences.map((sq) => sq.id === id ? { ...sq, ...data } : sq) })),
  deleteSequence: (id) => set((s) => ({ sequences: s.sequences.filter((sq) => sq.id !== id) })),

  addCapturePage: (page) => set((s) => ({ capturePages: [...s.capturePages, page] })),
  updateCapturePage: (id, data) => set((s) => ({ capturePages: s.capturePages.map((p) => p.id === id ? { ...p, ...data } : p) })),
  deleteCapturePage: (id) => set((s) => ({ capturePages: s.capturePages.filter((p) => p.id !== id) })),
  toggleCapturePagePublish: (id) => set((s) => ({ capturePages: s.capturePages.map((p) => p.id === id ? { ...p, published: !p.published } : p) })),

  addEvenement: (event) => set((s) => ({ evenements: [...s.evenements, event] })),
  updateEvenement: (id, data) => set((s) => ({ evenements: s.evenements.map((e) => e.id === id ? { ...e, ...data } : e) })),
  deleteEvenement: (id) => set((s) => ({ evenements: s.evenements.filter((e) => e.id !== id) })),

  addAutomation: (automation) => set((s) => ({ automations: [...s.automations, automation] })),
  updateAutomation: (id, data) => set((s) => ({ automations: s.automations.map((a) => a.id === id ? { ...a, ...data } : a) })),
  deleteAutomation: (id) => set((s) => ({ automations: s.automations.filter((a) => a.id !== id) })),

  addPayment: (payment) => set((s) => ({ payments: [...s.payments, payment] })),
  updatePaymentStatus: (id, status) => set((s) => ({ payments: s.payments.map((p) => p.id === id ? { ...p, status } : p) })),
}));
