import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

export type ViewType = 'landing' | 'dashboard' | 'auth';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage: string;
  buyLink: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  image: string;
  modules: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  price: number;
  image: string;
}

export interface Logo {
  id: string;
  url: string;
  name: string;
}

export interface Photo {
  id: string;
  url: string;
  name: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  status: 'Nouveau' | 'Contacté' | 'Qualifié' | 'Proposition' | 'Converti';
  date: string;
  source: string;
}

export interface LandingPage {
  id: string;
  title: string;
  template: string;
  fields: string[];
  published: boolean;
  createdAt: string;
}

export interface AppUser {
  name: string;
  email: string;
  avatar: string;
  uid?: string;
}

const uploadedImages = [
  '/images/ChatGPT Image 3 juin 2026, 21_08_22.png',
  '/images/ChatGPT Image 4 juin 2026, 09_20_39.png',
  '/images/ChatGPT Image 4 juin 2026, 09_29_20.png',
  '/images/ChatGPT Image 4 juin 2026, 09_32_02.png',
  '/images/ChatGPT Image 4 juin 2026, 10_01_34.png',
  '/images/ChatGPT Image 4 juin 2026, 10_06_08.png',
  '/images/ChatGPT Image 4 juin 2026, 10_06_58.png',
  '/images/ChatGPT Image 4 juin 2026, 10_20_50.png',
];

const sampleBooks: Book[] = [
  {
    id: 'book-1',
    title: 'Transformation Digitale : Le Guide Complet',
    author: 'Yves Kossonou',
    description: 'Le guide ultime pour réussir votre transformation digitale. Des stratégies éprouvées et des cas pratiques adaptés au contexte africain.',
    price: 29000,
    coverImage: uploadedImages[0],
    buyLink: '#',
  },
  {
    id: 'book-2',
    title: 'Marketing Digital pour Entrepreneurs Africains',
    author: 'Yves Kossonou',
    description: 'Maîtrisez les outils du marketing digital pour développer votre business en Afrique. SEO, réseaux sociaux, publicité en ligne et plus encore.',
    price: 25000,
    coverImage: uploadedImages[1],
    buyLink: '#',
  },
  {
    id: 'book-3',
    title: 'Intelligence Artificielle : Opportunités pour l\'Afrique',
    author: 'Yves Kossonou',
    description: 'Explorez comment l\'IA révolutionne les affaires en Afrique. Cas d\'usage, implémentation et vision stratégique pour les leaders.',
    price: 35000,
    coverImage: uploadedImages[2],
    buyLink: '#',
  },
];

const sampleFormations: Formation[] = [
  {
    id: 'formation-1',
    title: 'Masterclass Transformation Digitale',
    description: 'Programme intensif de 12 semaines pour maîtriser tous les aspects de la transformation digitale. Du diagnostic à l\'implémentation.',
    price: 150000,
    duration: '12 semaines',
    level: 'Avancé',
    image: uploadedImages[3],
    modules: ['Diagnostic Digital', 'Stratégie de Transformation', 'Gestion du Changement', 'Implémentation & Suivi'],
  },
  {
    id: 'formation-2',
    title: 'Marketing Digital Avancé',
    description: 'Perfectionnez vos compétences en marketing digital avec des techniques avancées et des études de cas concrets.',
    price: 100000,
    duration: '8 semaines',
    level: 'Intermédiaire',
    image: uploadedImages[4],
    modules: ['SEO Avancé', 'Publicité Programmatique', 'Analytics & Data', 'Stratégie de Contenu'],
  },
  {
    id: 'formation-3',
    title: 'IA pour le Business',
    description: 'Apprenez à intégrer l\'intelligence artificielle dans votre stratégie d\'entreprise pour un avantage compétitif.',
    price: 200000,
    duration: '16 semaines',
    level: 'Avancé',
    image: uploadedImages[5],
    modules: ['Fondamentaux de l\'IA', 'Machine Learning Appliqué', 'Automatisation des Processus', 'IA & Prise de Décision'],
  },
  {
    id: 'formation-4',
    title: 'Création de Contenu Digital',
    description: 'De la stratégie de contenu à la production : apprenez à créer du contenu qui engage et convertit.',
    price: 75000,
    duration: '6 semaines',
    level: 'Débutant',
    image: uploadedImages[6],
    modules: ['Stratégie Éditoriale', 'Création Visuelle', 'Vidéo & Podcast', 'Distribution & Analytics'],
  },
];

const sampleEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Sommet Digital Afrique 2026',
    date: '2026-07-15',
    location: 'Abidjan, Côte d\'Ivoire',
    description: 'Le plus grand rassemblement digital d\'Afrique francophone. Conférences, ateliers et networking avec les leaders du digital.',
    price: 50000,
    image: uploadedImages[7],
  },
  {
    id: 'event-2',
    title: 'Workshop IA & Business',
    date: '2026-06-28',
    location: 'Dakar, Sénégal',
    description: 'Atelier pratique sur l\'intégration de l\'IA dans les modèles d\'affaires africains. Cas pratiques et démonstrations live.',
    price: 35000,
    image: uploadedImages[0],
  },
  {
    id: 'event-3',
    title: 'Conférence Marketing Digital',
    date: '2026-08-10',
    location: 'Paris, France',
    description: 'Découvrez les dernières tendances du marketing digital avec un focus sur les marchés africains et la diaspora.',
    price: 75000,
    image: uploadedImages[1],
  },
];

const sampleLogos: Logo[] = [
  { id: 'logo-1', url: uploadedImages[0], name: 'Logo Principal' },
  { id: 'logo-2', url: uploadedImages[1], name: 'Logo Secondaire' },
];

const samplePhotos: Photo[] = uploadedImages.slice(2).map((url, i) => ({
  id: `photo-${i + 1}`,
  url,
  name: `Photo ${i + 1}`,
}));

const sampleLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Amadou Diallo',
    email: 'amadou@email.com',
    phone: '+221 77 123 4567',
    interest: 'Transformation Digitale',
    status: 'Nouveau',
    date: '2026-06-01',
    source: 'Site Web',
  },
  {
    id: 'lead-2',
    name: 'Fatou Ndiaye',
    email: 'fatou@email.com',
    phone: '+221 78 987 6543',
    interest: 'Marketing Digital',
    status: 'Contacté',
    date: '2026-05-28',
    source: 'Formulaire',
  },
  {
    id: 'lead-3',
    name: 'Kouamé Yao',
    email: 'kouame@email.com',
    phone: '+225 07 12 34 56',
    interest: 'IA pour le Business',
    status: 'Qualifié',
    date: '2026-05-25',
    source: 'Événement',
  },
  {
    id: 'lead-4',
    name: 'Marie Toure',
    email: 'marie@email.com',
    phone: '+223 76 54 32 10',
    interest: 'Formation',
    status: 'Proposition',
    date: '2026-05-20',
    source: 'Référence',
  },
  {
    id: 'lead-5',
    name: 'Ibrahim Keita',
    email: 'ibrahim@email.com',
    phone: '+223 65 43 21 09',
    interest: 'Masterclass',
    status: 'Converti',
    date: '2026-05-15',
    source: 'Site Web',
  },
];

interface AppState {
  currentView: ViewType;
  sidebarOpen: boolean;
  activeTab: string;
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  books: Book[];
  formations: Formation[];
  events: Event[];
  logos: Logo[];
  photos: Photo[];
  leads: Lead[];
  landingPages: LandingPage[];

  setView: (view: ViewType) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setUser: (user: AppUser | null) => void;
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setAuthLoading: (loading: boolean) => void;

  addBook: (book: Book) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;

  addFormation: (formation: Formation) => void;
  updateFormation: (id: string, formation: Partial<Formation>) => void;
  deleteFormation: (id: string) => void;

  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  addLogo: (logo: Logo) => void;
  deleteLogo: (id: string) => void;

  addPhoto: (photo: Photo) => void;
  deletePhoto: (id: string) => void;

  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: Lead['status']) => void;

  addLandingPage: (page: LandingPage) => void;
  deleteLandingPage: (id: string) => void;
  toggleLandingPagePublish: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'landing',
  sidebarOpen: true,
  activeTab: 'overview',
  user: null,
  firebaseUser: null,
  authLoading: true,
  books: sampleBooks,
  formations: sampleFormations,
  events: sampleEvents,
  logos: sampleLogos,
  photos: samplePhotos,
  leads: sampleLeads,
  landingPages: [],

  setView: (view) => set({ currentView: view }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setUser: (user) => set({ user }),
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),

  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  updateBook: (id, book) =>
    set((state) => ({
      books: state.books.map((b) => (b.id === id ? { ...b, ...book } : b)),
    })),
  deleteBook: (id) =>
    set((state) => ({ books: state.books.filter((b) => b.id !== id) })),

  addFormation: (formation) =>
    set((state) => ({ formations: [...state.formations, formation] })),
  updateFormation: (id, formation) =>
    set((state) => ({
      formations: state.formations.map((f) =>
        f.id === id ? { ...f, ...formation } : f
      ),
    })),
  deleteFormation: (id) =>
    set((state) => ({
      formations: state.formations.filter((f) => f.id !== id),
    })),

  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, event) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
    })),
  deleteEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== id) })),

  addLogo: (logo) => set((state) => ({ logos: [...state.logos, logo] })),
  deleteLogo: (id) =>
    set((state) => ({ logos: state.logos.filter((l) => l.id !== id) })),

  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  deletePhoto: (id) =>
    set((state) => ({ photos: state.photos.filter((p) => p.id !== id) })),

  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  updateLeadStatus: (id, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    })),

  addLandingPage: (page) =>
    set((state) => ({ landingPages: [...state.landingPages, page] })),
  deleteLandingPage: (id) =>
    set((state) => ({
      landingPages: state.landingPages.filter((p) => p.id !== id),
    })),
  toggleLandingPagePublish: (id) =>
    set((state) => ({
      landingPages: state.landingPages.map((p) =>
        p.id === id ? { ...p, published: !p.published } : p
      ),
    })),
}));
