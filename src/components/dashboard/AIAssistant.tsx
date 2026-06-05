'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  'Comment améliorer mon taux de conversion ?',
  'Stratégie marketing pour l\'Afrique',
  'Optimiser mes landing pages',
  'Planifier un événement digital',
];

const aiResponses: Record<string, string> = {
  default: 'Je suis votre assistant IA spécialisé en transformation digitale. Comment puis-je vous aider aujourd\'hui ?',
  conversion: 'Pour améliorer votre taux de conversion, voici quelques stratégies clés :\n\n1. **Optimisez vos CTA** - Utilisez des boutons avec un contraste fort et un texte d\'action clair\n2. **Simplifiez vos formulaires** - Réduisez le nombre de champs au minimum nécessaire\n3. **Ajoutez de la preuve sociale** - Témoignages, chiffres, logos de clients\n4. **Utilisez l\'urgence** - Offres limitées, compteurs à rebours\n5. **A/B Testez** - Testez différentes versions de vos pages',
  marketing: 'Voici une stratégie marketing adaptée au marché africain :\n\n1. **WhatsApp Business** - Le canal #1 en Afrique francophone\n2. **Contenu vidéo court** - Très engageant sur les réseaux sociaux\n3. **Marketing d\'influence** - Partenariats avec des micro-influenceurs locaux\n4. **SEO local** - Optimisez pour les recherches locales\n5. **Paiement mobile** - Intégrez Wave, Orange Money, MTN Money',
  landing: 'Pour optimiser vos landing pages :\n\n1. **Titre percutant** - Communiquez la valeur en 5 secondes\n2. **Image de héros** - Montrez le résultat, pas le processus\n3. **Formulaire minimal** - Nom + Email suffisent pour commencer\n4. **Témoignages vidéo** - L\'authenticité est clé en Afrique\n5. **CTA répété** - Ajoutez des boutons à plusieurs endroits',
  evenement: 'Pour planifier un événement digital réussi :\n\n1. **Définissez votre audience cible** et adaptez le contenu\n2. **Choisissez la bonne plateforme** - Zoom, YouTube Live, ou hybride\n3. **Créez du suspense** - Teasers, countdowns, invitations VIP\n4. **Préparez l\'engagement** - Q&A, polls, chat interactif\n5. **Suivi post-événement** - Replay, leads nurturing, feedback',
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('conversion') || lower.includes('taux')) return aiResponses.conversion;
  if (lower.includes('marketing') || lower.includes('stratégi')) return aiResponses.marketing;
  if (lower.includes('landing') || lower.includes('page')) return aiResponses.landing;
  if (lower.includes('événement') || lower.includes('evenement') || lower.includes('planifier')) return aiResponses.evenement;
  return aiResponses.default;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA spécialisé en transformation digitale. Comment puis-je vous aider avec vos projets ?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: getAIResponse(message),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
            <Bot size={20} className="text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Assistant IA</h1>
            <p className="text-xs text-[#10B981] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> En ligne
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-[#3B82F6]/10'
                    : 'bg-[#D4AF37]/10'
                }`}
              >
                {msg.role === 'user' ? (
                  <User size={16} className="text-[#3B82F6]" />
                ) : (
                  <Bot size={16} className="text-[#D4AF37]" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#3B82F6]/10 text-[#CBD5E1] border border-[#3B82F6]/20'
                    : 'glass-card text-[#CBD5E1]'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
              <Bot size={16} className="text-[#D4AF37]" />
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#D4AF37]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSend(s)}
              className="px-3 py-2 glass rounded-xl text-xs text-[#CBD5E1] hover:border-[#D4AF37]/30 transition-all flex items-center gap-1.5"
            >
              <Lightbulb size={12} className="text-[#D4AF37]" />
              {s}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="glass-card rounded-2xl p-2 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Posez votre question..."
          className="flex-1 px-4 py-3 bg-transparent text-white placeholder:text-[#64748B] focus:outline-none text-sm"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="p-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E8C84A] text-[#081120] disabled:opacity-30 transition-opacity"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  );
}
