'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Bell, Shield, Save, Upload } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Settings() {
  const { user, setUser, logos } = useAppStore();
  const [profile, setProfile] = useState({
    name: user?.name || 'Yves Kossonou',
    email: user?.email || 'admin@yveskossonou.com',
    bio: 'Expert en Transformation Digitale, Marketing Digital et Intelligence Artificielle. Formateur et coach pour entrepreneurs africains.',
    phone: '+225 07 00 00 00 00',
    location: 'Abidjan, Côte d\'Ivoire',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    newLead: true,
    newSale: true,
    eventReminder: true,
    weeklyReport: false,
  });

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Configurez votre plateforme</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-[#94A3B8] text-sm">
            <User size={14} className="mr-1.5" /> Profil
          </TabsTrigger>
          <TabsTrigger value="brand" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-[#94A3B8] text-sm">
            <Palette size={14} className="mr-1.5" /> Marque
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-[#94A3B8] text-sm">
            <Bell size={14} className="mr-1.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-[#94A3B8] text-sm">
            <Shield size={14} className="mr-1.5" /> Sécurité
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="glass-card rounded-2xl p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Informations Personnelles</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden">
                {logos.length > 0 ? (
                  <img src={logos[0].url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#06B6D4] to-[#22D3EE] flex items-center justify-center text-[#081120] font-bold text-2xl">
                    YK
                  </div>
                )}
              </div>
              <button className="px-4 py-2 glass rounded-xl text-sm text-[#CBD5E1] hover:border-[#06B6D4]/30 flex items-center gap-2 transition-all">
                <Upload size={14} /> Changer la photo
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#94A3B8] mb-1.5 block">Nom</label>
                  <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-[#94A3B8] mb-1.5 block">Email</label>
                  <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm text-[#94A3B8] mb-1.5 block">Bio</label>
                <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#94A3B8] mb-1.5 block">Téléphone</label>
                  <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-[#94A3B8] mb-1.5 block">Localisation</label>
                  <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none" />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUser({ name: profile.name, email: profile.email, avatar: logos[0]?.url || '' })}
                className="px-6 py-3 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold rounded-xl flex items-center gap-2"
              >
                <Save size={16} /> Sauvegarder
              </motion.button>
            </div>
          </div>
        </TabsContent>

        {/* Brand Tab */}
        <TabsContent value="brand" className="mt-6">
          <div className="glass-card rounded-2xl p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Paramètres de Marque</h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-[#94A3B8] mb-3 block">Logo Principal</label>
                <div className="grid grid-cols-4 gap-3">
                  {uploadedImages.map((url) => (
                    <button
                      key={url}
                      className="aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-[#06B6D4] transition-all"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-[#94A3B8] mb-3 block">Couleurs</label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#081120] border border-white/20" />
                    <span className="text-xs text-[#94A3B8]">Bleu Nuit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#06B6D4]" />
                    <span className="text-xs text-[#94A3B8]">Or Premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-white/20" />
                    <span className="text-xs text-[#94A3B8]">Bleu Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <div className="glass-card rounded-2xl p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Préférences de Notification</h3>
            <div className="space-y-4">
              {[
                { key: 'email' as const, label: 'Notifications par email', desc: 'Recevez des alertes par email' },
                { key: 'newLead' as const, label: 'Nouveau lead', desc: 'Quand un nouveau lead est capturé' },
                { key: 'newSale' as const, label: 'Nouvelle vente', desc: 'Quand une vente est réalisée' },
                { key: 'eventReminder' as const, label: 'Rappel événement', desc: 'Avant chaque événement' },
                { key: 'weeklyReport' as const, label: 'Rapport hebdomadaire', desc: 'Résumé de la semaine' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                    className={`w-11 h-6 rounded-full transition-all duration-300 ${
                      notifications[item.key] ? 'bg-[#06B6D4]' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                        notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <div className="glass-card rounded-2xl p-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Sécurité</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#94A3B8] mb-1.5 block">Mot de passe actuel</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-[#94A3B8] mb-1.5 block">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm text-[#94A3B8] mb-1.5 block">Confirmer le mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none" />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold rounded-xl flex items-center gap-2"
              >
                <Shield size={16} /> Mettre à jour
              </motion.button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
