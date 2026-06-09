'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Copy,
  Smartphone,
  MessageSquare,
  Clock,
  Check,
  Zap,
  Calendar,
  Tag,
  Send,
  RefreshCw,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ─── Types ───
type Channel = 'sms' | 'whatsapp';
type Objective = 'promotion' | 'relance' | 'rappel' | 'remerciement' | 'invitation_evenement' | 'offre_speciale';
type Tone = 'professionnel' | 'amical' | 'urgent' | 'inspirant';

interface GeneratedMessage {
  id: string;
  content: string;
  channel: Channel;
  objective: Objective;
  tone: Tone;
  variant: 'A' | 'B';
  createdAt: string;
}

// ─── Constants ───
const objectiveLabels: Record<Objective, string> = {
  promotion: 'Promotion',
  relance: 'Relance',
  rappel: 'Rappel',
  remerciement: 'Remerciement',
  invitation_evenement: 'Invitation événement',
  offre_speciale: 'Offre spéciale',
};

const toneLabels: Record<Tone, string> = {
  professionnel: 'Professionnel',
  amical: 'Amical',
  urgent: 'Urgent',
  inspirant: 'Inspirant',
};

const objectives: Objective[] = ['promotion', 'relance', 'rappel', 'remerciement', 'invitation_evenement', 'offre_speciale'];
const tones: Tone[] = ['professionnel', 'amical', 'urgent', 'inspirant'];

// ─── Mock AI Message Generation ───
const mockMessages: Record<Objective, Record<Channel, Record<Tone, string>>> = {
  promotion: {
    sms: {
      professionnel: '🔥 Offre exclusive ! Profitez de -30% sur notre Masterclass Transformation Digitale. Code : FLASH30. Valable 48h seulement. Répondez OUI pour en profiter.',
      amical: 'Salut ! 😊 J\'ai une super nouvelle pour toi : -30% sur la Masterclass Digitale avec le code FLASH30 ! Ne rate pas ça, c\'est 48h seulement !',
      urgent: '⚠️ DERNIÈRE CHANCE ! -30% sur la Masterclass Digitale expire dans 48h. Code FLASH30. Agissez MAINTENANT !',
      inspirant: '✨ Votre transformation commence ici. -30% sur la Masterclass Digitale avec le code FLASH30. Investissez en vous, les résultats suivront.',
    },
    whatsapp: {
      professionnel: '🚀 *Offre Spéciale KONNECT*\n\nProfitez de *-30%* sur notre Masterclass Transformation Digitale.\n\n📋 Code : FLASH30\n⏰ Valable 48h\n\nRépondez OUI pour réserver votre place.',
      amical: 'Hey ! 👋\n\nJ\'ai une offre canon pour toi !\n\n🎁 *-30%* sur la Masterclass Digitale\nCode : FLASH30\n\nC\'est juste 48h alors dépêche-toi ! 😄',
      urgent: '🚨 *ATTENTION - OFFRE FLASH !*\n\n*-30%* Masterclass Digitale\nCode : FLASH30\n⏰ *EXPIRE dans 48h !*\n\nNe laissez pas passer cette chance !',
      inspirant: '💡 *Le moment est venu de transformer votre business*\n\nOffre spéciale : *-30%* sur la Masterclass Transformation Digitale\nCode : FLASH30\n\nVotre succès commence aujourd\'hui. ✨',
    },
  },
  relance: {
    sms: {
      professionnel: 'Bonjour, nous avons remarqué votre intérêt pour nos formations. Souhaitez-vous reprendre votre inscription ? Répondez OUI pour en savoir plus.',
      amical: 'Coucou ! On a vu que tu étais intéressé par nos formations 😊 Tu veux qu\'on en reparle ? Réponds OUI et je t\'explique tout !',
      urgent: '⚠️ Votre place est réservée temporairement ! Confirmez votre inscription MAINTENANT avant qu\'elle ne soit libérée. Répondez OUI.',
      inspirant: 'Votre parcours vers le succès est à portée de main. Ne laissez pas cette opportunité passer. Reprenez votre inscription aujourd\'hui.',
    },
    whatsapp: {
      professionnel: '📋 *Relance - Votre inscription*\n\nNous avons remarqué votre intérêt pour nos formations.\n\nSouhaitez-vous reprendre ?\n\n✅ Répondez OUI pour plus d\'infos',
      amical: 'Hey ! 😊\n\nJ\'ai vu que tu étais intéressé par nos formations mais tu n\'as pas finalisé...\n\nPas de pression ! Tu veux qu\'on en discute ?\n\n👆 Réponds OUI',
      urgent: '⏰ *DERNIÈRE RELANCE*\n\nVotre inscription est en attente !\n\nConfirmez *MAINTENANT* avant que votre place soit libérée.\n\n✅ Répondez OUI',
      inspirant: '🌟 *N\'abandonnez pas votre ambition*\n\nChaque grand parcours commence par un premier pas.\nVotre inscription est là, il suffit de la finaliser.\n\n✨ Répondez OUI pour continuer',
    },
  },
  rappel: {
    sms: {
      professionnel: 'Rappel : Votre événement KONNECT est dans 3 jours. Préparez votre participation. Plus d\'infos : [LIEN]',
      amical: 'Hey ! Petit rappel 😊 Ton événement est dans 3 jours ! T\'es prêt ? Plus d\'infos ici : [LIEN]',
      urgent: '⚠️ RAPPEL URGENT : Votre événement est dans 3 jours ! Préparez-vous dès maintenant. Détails : [LIEN]',
      inspirant: 'Le grand jour approche ! ✨ Dans 3 jours, votre vie professionnelle change. Préparez-vous à vivre une expérience unique. [LIEN]',
    },
    whatsapp: {
      professionnel: '📅 *Rappel Événement*\n\nVotre événement KONNECT est dans *3 jours*.\n\n📍 Préparez votre participation\n🔗 Programme : [LIEN]\n\nÀ bientôt !',
      amical: '📅 *Hey ! Petit rappel !*\n\nTon événement est dans *3 jours* ! 🎉\n\nT\'es prêt ? 😄\n🔗 Toutes les infos : [LIEN]',
      urgent: '🚨 *RAPPEL URGENT*\n\nVotre événement est dans *3 jours* !\n\n⏰ Préparez-vous *dès maintenant*\n🔗 Détails : [LIEN]',
      inspirant: '✨ *Le compte à rebours est lancé !*\n\nDans 3 jours, une expérience transformative vous attend.\n\nPréparez-vous à repousser vos limites.\n🔗 [LIEN]',
    },
  },
  remerciement: {
    sms: {
      professionnel: 'Merci pour votre participation ! Nous espérons que l\'expérience vous a été profitable. N\'hésitez pas à nous contacter pour toute question.',
      amical: 'Merci d\'avoir été là ! 🙏 On espère que t\'as kiffé ! N\'hésite pas si t\'as des questions, on est là pour toi 😊',
      urgent: 'MERCI pour votre présence ! ⚡ Répondez RAPIDEMENT pour accéder aux ressources exclusives de l\'événement.',
      inspirant: 'Merci d\'avoir fait partie de cette aventure ! ✨ Votre présence a fait la différence. Continuez à briller et à transformer votre vision en réalité.',
    },
    whatsapp: {
      professionnel: '🙏 *Merci !*\n\nVotre participation a été précieuse.\n\nNous espérons que l\'expérience vous a été profitable.\n\n📎 Ressources : [LIEN]\n\nN\'hésitez pas à nous contacter.',
      amical: '🙏 *Merci d\'avoir été là !*\n\nOn espère que t\'as adoré ! 😊\n\n📎 Voici les ressources promises : [LIEN]\n\nSi t\'as des questions, hésite pas ! 💪',
      urgent: '⚡ *MERCI !*\n\nVotre présence compte !\n\n🎁 *Ressources exclusives* disponibles *maintenant* :\n📎 [LIEN]\n\n⏰ Accès limité !',
      inspirant: '🌟 *Merci d\'avoir brillé !*\n\nVotre présence a transformé cet événement.\n\n✨ Continuez à inspirer et à créer.\n\n📎 Ressources : [LIEN]',
    },
  },
  invitation_evenement: {
    sms: {
      professionnel: 'Vous êtes invité à notre événement exclusif. Date : [DATE]. Lieu : [LIEU]. Réservez votre place : [LIEN]',
      amical: 'T\'es invité ! 🎉 Notre prochain événement arrive ! Date : [DATE]. Viens, ça va être top ! Inscription : [LIEN]',
      urgent: '⚠️ INVITATION EXCLUSIVE ! Places limitées. [DATE] - [LIEU]. Réservez IMMÉDIATEMENT : [LIEN]',
      inspirant: '✨ Une expérience unique vous attend. Rejoignez-nous le [DATE] à [LIEU] pour un événement qui changera votre perspective. [LIEN]',
    },
    whatsapp: {
      professionnel: '🎉 *Invitation Exklusive*\n\nVous êtes invité à notre événement.\n\n📅 Date : [DATE]\n📍 Lieu : [LIEU]\n\n🔗 Réservez : [LIEN]\n\nAu plaisir de vous y voir !',
      amical: '🎉 *T\'es invité !*\n\nNotre prochain événement arrive !\n\n📅 [DATE]\n📍 [LIEU]\n\nViens, ça va être *canon* ! 😄\n🔗 Inscription : [LIEN]',
      urgent: '🚨 *INVITATION EXCLUSIVE*\n\n⚠️ Places *limitées* !\n\n📅 [DATE]\n📍 [LIEU]\n\n🔗 Réservez *IMMÉDIATEMENT* : [LIEN]',
      inspirant: '✨ *Une expérience unique vous attend*\n\nRejoignez des leaders du digital le [DATE] à [LIEU].\n\nUn événement qui *transformera* votre vision.\n\n🔗 [LIEN]',
    },
  },
  offre_speciale: {
    sms: {
      professionnel: 'Offre spéciale KONNECT : Accédez à nos formations premium à tarif réduit. Offre limitée. En savoir plus : [LIEN]',
      amical: 'Hey ! 😍 Offre de folie chez KONNECT ! Nos formations premium à prix réduit, mais c\'est limité alors dépêche-toi ! [LIEN]',
      urgent: '🔥 OFFRE FLASH ! Accès premium à prix réduit - EXPIRE CE SOIR ! Ne perdez pas une seconde : [LIEN]',
      inspirant: '🌟 Votre succès mérite le meilleur. Offre spéciale : accédez à nos formations premium et libérez votre potentiel. [LIEN]',
    },
    whatsapp: {
      professionnel: '💎 *Offre Spéciale KONNECT*\n\nAccédez à nos formations *premium* à tarif réduit.\n\n⏰ Offre limitée\n🔗 En savoir plus : [LIEN]\n\nSaisissez cette opportunité.',
      amical: '😍 *Offre de folie !*\n\nNos formations *premium* à prix rédit !\n\nMais c\'est *limité* alors dépêche-toi !\n\n🔗 [LIEN]',
      urgent: '🔥 *OFFRE FLASH !*\n\nAccès premium à prix réduit\n⏰ *EXPIRE CE SOIR !*\n\n🔗 Ne perdez pas une seconde : [LIEN]',
      inspirant: '🌟 *Votre succès mérite le meilleur*\n\nOffre spéciale : accédez à nos formations *premium* et libérez votre potentiel.\n\n🔗 [LIEN]',
    },
  },
};

// ─── Templates ───
const templates = [
  { id: 't1', name: 'Promotion Flash', objective: 'promotion' as Objective, preview: '🔥 Offre exclusive ! Profitez de -30%...' },
  { id: 't2', name: 'Relance Douce', objective: 'relance' as Objective, preview: 'Bonjour, nous avons remarqué votre intérêt...' },
  { id: 't3', name: 'Rappel Événement', objective: 'rappel' as Objective, preview: 'Rappel : Votre événement est dans 3 jours...' },
  { id: 't4', name: 'Remerciement VIP', objective: 'remerciement' as Objective, preview: 'Merci pour votre participation précieuse...' },
  { id: 't5', name: 'Invitation Premium', objective: 'invitation_evenement' as Objective, preview: 'Vous êtes invité à notre événement exclusif...' },
  { id: 't6', name: 'Offre Spéciale', objective: 'offre_speciale' as Objective, preview: 'Offre spéciale : Accédez à nos formations...' },
];

// ─── Optimal Send Hours ───
const optimalHours = [
  { hour: '6h', value: 15 },
  { hour: '7h', value: 25 },
  { hour: '8h', value: 45 },
  { hour: '9h', value: 70 },
  { hour: '10h', value: 85 },
  { hour: '11h', value: 60 },
  { hour: '12h', value: 40 },
  { hour: '13h', value: 35 },
  { hour: '14h', value: 55 },
  { hour: '15h', value: 65 },
  { hour: '16h', value: 50 },
  { hour: '17h', value: 40 },
  { hour: '18h', value: 55 },
  { hour: '19h', value: 75 },
  { hour: '20h', value: 90 },
  { hour: '21h', value: 80 },
  { hour: '22h', value: 45 },
];

// ─── Animation Variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ─── Main Component ───
export default function AIAssistant() {
  // Composer state
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [objective, setObjective] = useState<Objective>('promotion');
  const [tone, setTone] = useState<Tone>('professionnel');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyPoints, setKeyPoints] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [variantB, setVariantB] = useState('');
  const [showVariantB, setShowVariantB] = useState(false);
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  // History
  const [history, setHistory] = useState<GeneratedMessage[]>([]);

  // ── Generate Message ───
  const generateMessage = useCallback((variant: 'A' | 'B') => {
    setIsGenerating(true);
    setCopiedA(false);
    setCopiedB(false);

    setTimeout(() => {
      const msg = mockMessages[objective]?.[channel]?.[tone] || 'Message généré par l\'IA KONNECT.';
      if (variant === 'A') {
        setGeneratedMessage(msg);
        setShowVariantB(false);
        setVariantB('');
      } else {
        // For variant B, slightly modify the message
        const variantBMsg = msg
          .replace('30%', '25%')
          .replace('FLASH30', 'KONNECT25')
          .replace('-30%', '-25%');
        setVariantB(variantBMsg);
        setShowVariantB(true);
      }

      // Add to history
      const newEntry: GeneratedMessage = {
        id: Date.now().toString(),
        content: variant === 'A' ? msg : mockMessages[objective]?.[channel]?.[tone] || '',
        channel,
        objective,
        tone,
        variant,
        createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory((prev) => [newEntry, ...prev].slice(0, 10));
      setIsGenerating(false);
    }, 1500);
  }, [objective, channel, tone]);

  // ── Copy to Clipboard ───
  const copyToClipboard = async (text: string, variant: 'A' | 'B') => {
    try {
      await navigator.clipboard.writeText(text);
      if (variant === 'A') {
        setCopiedA(true);
        setTimeout(() => setCopiedA(false), 2000);
      } else {
        setCopiedB(true);
        setTimeout(() => setCopiedB(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  // ── Apply Template ───
  const applyTemplate = (templateObjective: Objective) => {
    setObjective(templateObjective);
    generateMessage('A');
  };

  // ── Character count ───
  const currentMessage = showVariantB ? variantB : generatedMessage;
  const charCount = currentMessage.length;
  const maxChars = channel === 'sms' ? 160 : 4096;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center">
          <Sparkles size={20} className="text-[#06B6D4]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Assistant IA</h2>
          <p className="text-xs text-slate-500">Générez des messages marketing optimisés avec l&apos;IA</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column: Composer ── */}
        <motion.div
          className="lg:col-span-2 space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Channel Selector */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/[0.03] backdrop-blur-sm border-white/10">
              <CardContent className="p-5 space-y-5">
                {/* Channel Tabs */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs font-medium">Canal</Label>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setChannel('sms')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        channel === 'sms'
                          ? 'bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4]'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <Smartphone size={14} /> SMS
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setChannel('whatsapp')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        channel === 'whatsapp'
                          ? 'bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <MessageSquare size={14} /> WhatsApp
                    </motion.button>
                  </div>
                </div>

                {/* Objective */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs font-medium">Objectif</Label>
                  <Select value={objective} onValueChange={(v) => setObjective(v as Objective)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white w-full h-9 text-xs">
                      <SelectValue placeholder="Sélectionnez un objectif" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0c0f1a] border-white/10">
                      {objectives.map((obj) => (
                        <SelectItem key={obj} value={obj} className="text-white focus:bg-white/10 focus:text-white text-xs">
                          {objectiveLabels[obj]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs font-medium">Ton</Label>
                  <div className="flex items-center flex-wrap gap-2">
                    {tones.map((t) => (
                      <motion.button
                        key={t}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setTone(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          tone === t
                            ? 'bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4]'
                            : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {toneLabels[t]}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs font-medium">Audience cible</Label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="ex: Entrepreneurs africains, Prospects chauds..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#06B6D4]/50 text-xs h-9"
                  />
                </div>

                {/* Key Points */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-xs font-medium">Points clés</Label>
                  <Textarea
                    value={keyPoints}
                    onChange={(e) => setKeyPoints(e.target.value)}
                    placeholder="Décrivez les points importants à inclure dans le message..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-[#06B6D4]/50 text-xs min-h-[70px]"
                    rows={3}
                  />
                </div>

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => generateMessage('A')}
                  disabled={isGenerating}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-[#06080f] font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#06B6D4]/20"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <RefreshCw size={16} />
                      </motion.div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Générer avec l&apos;IA
                    </>
                  )}
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Message Display */}
          <AnimatePresence>
            {generatedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/[0.03] backdrop-blur-sm border-white/10">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                        {channel === 'sms' ? (
                          <Smartphone size={14} className="text-[#06B6D4]" />
                        ) : (
                          <MessageSquare size={14} className="text-[#10B981]" />
                        )}
                        Message généré
                        <Badge className="bg-[#06B6D4]/15 text-[#06B6D4] border-0 text-[10px]">Variante A</Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyToClipboard(generatedMessage, 'A')}
                          className="p-2 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-[#06B6D4] transition-colors"
                          title="Copier"
                        >
                          {copiedA ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        </motion.button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {generatedMessage}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-slate-600">
                        {charCount} / {maxChars} caractères
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => generateMessage('B')}
                        disabled={isGenerating}
                        className="px-3 py-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-medium flex items-center gap-1.5 hover:bg-[#10B981]/20 transition-colors disabled:opacity-40"
                      >
                        <RefreshCw size={11} /> Générer Variante B
                      </motion.button>
                    </div>

                    {/* Variant B */}
                    <AnimatePresence>
                      {showVariantB && variantB && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#10B981]/15 text-[#10B981] border-0 text-[10px]">Variante B</Badge>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(variantB, 'B')}
                              className="p-2 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-[#06B6D4] transition-colors"
                              title="Copier"
                            >
                              {copiedB ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </motion.button>
                          </div>
                          <div className="p-4 rounded-xl bg-white/[0.04] border border-[#10B981]/10 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {variantB}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Right Column: Suggestions + Templates + History ── */}
        <motion.div
          className="space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Smart Send Suggestions */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/[0.03] backdrop-blur-sm border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Clock size={14} className="text-[#06B6D4]" />
                  Suggestions d&apos;envoi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Best Send Time */}
                <div className="p-3 rounded-xl bg-[#06B6D4]/5 border border-[#06B6D4]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={12} className="text-[#06B6D4]" />
                    <span className="text-[11px] text-[#06B6D4] font-medium">Meilleur moment d&apos;envoi</span>
                  </div>
                  <div className="text-lg font-bold text-white">
                    {channel === 'sms' ? '10h00' : '20h00'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {channel === 'sms'
                      ? 'Taux d\'ouverture SMS optimal le matin'
                      : 'Engagement WhatsApp maximal le soir'}
                  </div>
                </div>

                {/* Optimal Time Slots Mini Chart */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-medium">Créneaux optimaux</span>
                  <div className="flex items-end gap-[3px] h-16">
                    {optimalHours.map((h, i) => {
                      const maxVal = Math.max(...optimalHours.map((x) => x.value));
                      const height = (h.value / maxVal) * 100;
                      const isTop = h.value >= 70;
                      return (
                        <motion.div
                          key={i}
                          className="flex-1 flex flex-col items-center justify-end"
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          transition={{ delay: i * 0.03, duration: 0.4 }}
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: 0.5 + i * 0.03, duration: 0.5, ease: 'easeOut' }}
                            className={`w-full rounded-t-sm min-h-[2px] ${
                              isTop
                                ? 'bg-[#06B6D4]'
                                : 'bg-white/10'
                            }`}
                            style={{ maxHeight: `${height}%` }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-600">
                    <span>6h</span>
                    <span>14h</span>
                    <span>22h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Message Templates */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/[0.03] backdrop-blur-sm border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <BookOpen size={14} className="text-emerald-400" />
                  Modèles de messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {templates.map((template, i) => (
                    <motion.button
                      key={template.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => applyTemplate(template.objective)}
                      className="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#06B6D4]/20 hover:bg-white/[0.06] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-white group-hover:text-[#06B6D4] transition-colors">
                          {template.name}
                        </span>
                        <ChevronRight size={12} className="text-slate-600 group-hover:text-[#06B6D4] transition-colors" />
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge className="bg-white/5 text-slate-400 border-0 text-[9px] px-1.5">
                          {objectiveLabels[template.objective]}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{template.preview}</p>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* History */}
          <motion.div variants={cardVariants}>
            <Card className="bg-white/[0.03] backdrop-blur-sm border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-6">
                    <Sparkles size={24} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-xs">Aucun message généré</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {history.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04] group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            {entry.channel === 'sms' ? (
                              <Smartphone size={10} className="text-[#06B6D4]" />
                            ) : (
                              <MessageSquare size={10} className="text-[#10B981]" />
                            )}
                            <Badge className="bg-white/5 text-slate-400 border-0 text-[9px] px-1.5">
                              {objectiveLabels[entry.objective]}
                            </Badge>
                            <Badge className={`border-0 text-[9px] px-1.5 ${
                              entry.variant === 'A'
                                ? 'bg-[#06B6D4]/10 text-[#06B6D4]'
                                : 'bg-[#10B981]/10 text-[#10B981]'
                            }`}>
                              {entry.variant}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-600">{entry.createdAt}</span>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => copyToClipboard(entry.content, 'A')}
                              className="p-1 rounded hover:bg-white/[0.06] text-slate-500 hover:text-[#06B6D4] transition-colors"
                            >
                              <Copy size={10} />
                            </motion.button>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{entry.content}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
