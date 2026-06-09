'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { User, Bell, Shield, Palette, Key, Globe, Smartphone, MessageSquare, CreditCard, Save, Check } from 'lucide-react';

export default function Parametres() {
  const { user } = useAppStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Paramètres sauvegardés');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="profil" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4]">
            <User className="w-4 h-4 mr-2" />Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4]">
            <Bell className="w-4 h-4 mr-2" />Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4]">
            <Key className="w-4 h-4 mr-2" />API & Connexions
          </TabsTrigger>
          <TabsTrigger value="apparence" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4]">
            <Palette className="w-4 h-4 mr-2" />Apparence
          </TabsTrigger>
        </TabsList>

        {/* Profil */}
        <TabsContent value="profil" className="space-y-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06B6D4] to-emerald-500 flex items-center justify-center text-[#06080f] font-bold text-xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-semibold">{user?.name || 'Utilisateur'}</h3>
                <p className="text-sm text-slate-400">{user?.email || ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="text-xs text-slate-400">Nom complet</Label><Input defaultValue={user?.name || ''} className="bg-[#06080f] border-[#1e293b] mt-1" /></div>
              <div><Label className="text-xs text-slate-400">Email</Label><Input defaultValue={user?.email || ''} className="bg-[#06080f] border-[#1e293b] mt-1" /></div>
              <div><Label className="text-xs text-slate-400">Entreprise</Label><Input placeholder="Nom de votre entreprise" className="bg-[#06080f] border-[#1e293b] mt-1" /></div>
              <div><Label className="text-xs text-slate-400">Téléphone</Label><Input placeholder="+225 07 XX XX XX" className="bg-[#06080f] border-[#1e293b] mt-1" /></div>
            </div>
            <Button onClick={handleSave} className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#06080f] font-semibold">
              {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}{saved ? 'Sauvegardé' : 'Sauvegarder'}
            </Button>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6 space-y-5">
            <h3 className="font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-[#06B6D4]" />Préférences de notification</h3>
            {[
              { label: 'Nouveaux contacts', desc: 'Alerte quand un nouveau contact est ajouté', default: true },
              { label: 'Paiements reçus', desc: 'Notification pour chaque paiement confirmé', default: true },
              { label: 'Rappels événements', desc: 'Rappels J-7, J-3, J-1 pour les événements', default: true },
              { label: 'Campagnes terminées', desc: 'Quand une campagne a fini d\'envoyer', default: true },
              { label: 'Réponses WhatsApp', desc: 'Quand un contact répond à un message WhatsApp', default: false },
              { label: 'Rapport hebdomadaire', desc: 'Résumé des performances chaque lundi', default: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <div><p className="text-sm">{item.label}</p><p className="text-xs text-slate-500">{item.desc}</p></div>
                <Switch defaultChecked={item.default} />
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* API & Connexions */}
        <TabsContent value="api" className="space-y-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6 space-y-5">
            <h3 className="font-semibold flex items-center gap-2"><Key className="w-5 h-5 text-[#06B6D4]" />Clés API & Services connectés</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span className="font-medium">WhatsApp Business API</span>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] ml-auto">Connecté</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-slate-400">Phone Number ID</Label><Input placeholder="Entrez votre Phone Number ID" className="bg-[#06080f] border-[#1e293b] mt-1 text-sm" /></div>
                  <div><Label className="text-xs text-slate-400">Access Token</Label><Input type="password" placeholder="Token d'accès" className="bg-[#06080f] border-[#1e293b] mt-1 text-sm" /></div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <span className="font-medium">SMS Gateway (Orange / MTN)</span>
                  <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-[10px] ml-auto">Configuration requise</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs text-slate-400">API Key</Label><Input placeholder="Votre clé API SMS" className="bg-[#06080f] border-[#1e293b] mt-1 text-sm" /></div>
                  <div><Label className="text-xs text-slate-400">Sender ID</Label><Input placeholder="KONNECT" className="bg-[#06080f] border-[#1e293b] mt-1 text-sm" /></div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#06B6D4]/5 border border-[#06B6D4]/20">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="w-5 h-5 text-[#06B6D4]" />
                  <span className="font-medium">Paiements Mobile Money</span>
                  <Badge variant="outline" className="border-[#06B6D4]/30 text-[#06B6D4] text-[10px] ml-auto">Partiel</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3"><span className="text-sm text-slate-300 w-28">Wave Business</span><Input placeholder="Clé API Wave" className="bg-[#06080f] border-[#1e293b] text-sm flex-1" /></div>
                  <div className="flex items-center gap-3"><span className="text-sm text-slate-300 w-28">Orange Money</span><Input placeholder="Clé API OM" className="bg-[#06080f] border-[#1e293b] text-sm flex-1" /></div>
                  <div className="flex items-center gap-3"><span className="text-sm text-slate-300 w-28">MTN Money</span><Input placeholder="Clé API MTN" className="bg-[#06080f] border-[#1e293b] text-sm flex-1" /></div>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#06080f] font-semibold">
              {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}{saved ? 'Sauvegardé' : 'Sauvegarder les connexions'}
            </Button>
          </Card>
        </TabsContent>

        {/* Apparence */}
        <TabsContent value="apparence" className="space-y-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6 space-y-5">
            <h3 className="font-semibold flex items-center gap-2"><Palette className="w-5 h-5 text-[#06B6D4]" />Personnalisation</h3>

            <div>
              <Label className="text-xs text-slate-400">Couleur d'accent</Label>
              <div className="flex gap-3 mt-2">
                {['#06B6D4', '#10B981', '#E94560', '#06B6D4', '#A855F7', '#F59E0B'].map(c => (
                  <button key={c} className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-white/50 transition-colors" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-400">Nom de l'expéditeur SMS</Label>
              <Input defaultValue="KONNECT" className="bg-[#06080f] border-[#1e293b] mt-1" />
              <p className="text-xs text-slate-500 mt-1">11 caractères maximum, lettres uniquement</p>
            </div>

            <div>
              <Label className="text-xs text-slate-400">Signature WhatsApp</Label>
              <Textarea defaultValue="— Yves Kossonou\n🚀 Transformation Digitale" className="bg-[#06080f] border-[#1e293b] mt-1" rows={3} />
            </div>

            <div className="flex items-center justify-between">
              <div><p className="text-sm">Mode sombre</p><p className="text-xs text-slate-500">Toujours activé pour KONNECT</p></div>
              <Switch checked disabled />
            </div>

            <Button onClick={handleSave} className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#06080f] font-semibold">
              {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}{saved ? 'Sauvegardé' : 'Sauvegarder'}
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
