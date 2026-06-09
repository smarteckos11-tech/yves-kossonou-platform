'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, Contact } from '@/store/useAppStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Users, Search, Filter, Plus, MoreHorizontal, MessageSquare, Smartphone,
  Edit, Trash2, Eye, Phone, Mail, Tag, ChevronDown, X, UserPlus,
  Check, XIcon, ArrowUpDown, Star
} from 'lucide-react';

const segments = ['Prospects chauds', 'Prospects froids', 'Nouveaux', 'Clients'];
const allTags = ['VIP', 'Formation', 'Workshop', 'Conference', 'Masterclass', 'IA'];
const sources = ['Site web', 'Événement', 'Page capture', 'Référence', 'WhatsApp', 'Formulaire'];

const scoreColor = (s: number) => s > 70 ? 'text-emerald-400' : s > 40 ? 'text-amber-400' : 'text-red-400';
const scoreBg = (s: number) => s > 70 ? 'bg-emerald-500' : s > 40 ? 'bg-amber-500' : 'bg-red-500';

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${color}`} />
        </div>
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact } = useAppStore();
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [detailContact, setDetailContact] = useState<Contact | null>(null);
  const [sortField, setSortField] = useState<'name' | 'score' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Form state
  const [form, setForm] = useState<Partial<Contact>>({
    name: '', phone: '', email: '', tags: [], segment: 'Nouveaux',
    source: 'Site web', score: 50, notes: '', whatsappOptIn: true, smsOptIn: true,
  });

  const resetForm = () => setForm({
    name: '', phone: '', email: '', tags: [], segment: 'Nouveaux',
    source: 'Site web', score: 50, notes: '', whatsappOptIn: true, smsOptIn: true,
  });

  const openAdd = () => { resetForm(); setShowAddDialog(true); };
  const openEdit = (c: Contact) => { setForm({ ...c }); setEditContact(c); };

  const handleSave = () => {
    if (!form.name || !form.phone) { toast.error('Nom et téléphone requis'); return; }
    if (editContact) {
      updateContact(editContact.id, form);
      toast.success('Contact mis à jour');
      setEditContact(null);
    } else {
      addContact({
        id: Date.now().toString(),
        name: form.name!, phone: form.phone!, email: form.email || '',
        tags: form.tags || [], segment: form.segment || 'Nouveaux',
        source: form.source || 'Site web', score: form.score || 50,
        notes: form.notes || '', lastContact: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        whatsappOptIn: form.whatsappOptIn ?? true, smsOptIn: form.smsOptIn ?? true,
      });
      toast.success('Contact ajouté');
      setShowAddDialog(false);
    }
    resetForm();
  };

  const handleDelete = (id: string) => { deleteContact(id); toast.success('Contact supprimé'); };

  const filtered = useMemo(() => {
    let result = [...contacts];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s) || c.phone.includes(s));
    }
    if (segmentFilter !== 'all') result = result.filter(c => c.segment === segmentFilter);
    if (tagFilter !== 'all') result = result.filter(c => c.tags.includes(tagFilter));
    result.sort((a, b) => {
      const v1 = sortField === 'name' ? a.name : sortField === 'score' ? a.score : a.createdAt;
      const v2 = sortField === 'name' ? b.name : sortField === 'score' ? b.score : b.createdAt;
      return sortDir === 'asc' ? (v1 < v2 ? -1 : 1) : (v1 > v2 ? -1 : 1);
    });
    return result;
  }, [contacts, search, segmentFilter, tagFilter, sortField, sortDir]);

  const toggleSort = (f: typeof sortField) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(f); setSortDir('desc'); }
  };

  const avgScore = contacts.length ? Math.round(contacts.reduce((a, c) => a + c.score, 0) / contacts.length) : 0;
  const waOpt = contacts.filter(c => c.whatsappOptIn).length;
  const smsOpt = contacts.filter(c => c.smsOptIn).length;

  const formDialog = (open: boolean, onClose: () => void) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d1117] border-[#1e293b] text-white max-h-[90vh] overflow-y-auto max-w-lg">
        <DialogHeader><DialogTitle className="text-[#06B6D4]">{editContact ? 'Modifier le contact' : 'Nouveau contact'}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-4">
          <div><Label className="text-slate-400 text-xs">Nom *</Label><Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-[#06080f] border-[#1e293b] mt-1" /></div>
          <div><Label className="text-slate-400 text-xs">Téléphone *</Label><Input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-[#06080f] border-[#1e293b] mt-1" placeholder="+225 07 XX XX XX" /></div>
          <div><Label className="text-slate-400 text-xs">Email</Label><Input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-[#06080f] border-[#1e293b] mt-1" /></div>
          <div>
            <Label className="text-slate-400 text-xs">Tags (séparés par virgule)</Label>
            <Input value={form.tags?.join(', ') || ''} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="bg-[#06080f] border-[#1e293b] mt-1" placeholder="VIP, Formation" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-slate-400 text-xs">Segment</Label><Select value={form.segment || 'Nouveaux'} onValueChange={v => setForm({ ...form, segment: v })}><SelectTrigger className="bg-[#06080f] border-[#1e293b] mt-1"><SelectValue /></SelectTrigger><SelectContent className="bg-[#0d1117] border-[#1e293b]">{segments.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-slate-400 text-xs">Source</Label><Select value={form.source || 'Site web'} onValueChange={v => setForm({ ...form, source: v })}><SelectTrigger className="bg-[#06080f] border-[#1e293b] mt-1"><SelectValue /></SelectTrigger><SelectContent className="bg-[#0d1117] border-[#1e293b]">{sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div><Label className="text-slate-400 text-xs">Score: {form.score || 50}</Label><input type="range" min="0" max="100" value={form.score || 50} onChange={e => setForm({ ...form, score: parseInt(e.target.value) })} className="w-full mt-1 accent-[#06B6D4]" /></div>
          <div><Label className="text-slate-400 text-xs">Notes</Label><Textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-[#06080f] border-[#1e293b] mt-1" rows={3} /></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Switch checked={form.whatsappOptIn ?? true} onCheckedChange={v => setForm({ ...form, whatsappOptIn: v })} /><Label className="text-slate-400 text-xs">WhatsApp Opt-in</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.smsOptIn ?? true} onCheckedChange={v => setForm({ ...form, smsOptIn: v })} /><Label className="text-slate-400 text-xs">SMS Opt-in</Label></div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-[#06080f] font-semibold">{editContact ? 'Mettre à jour' : 'Ajouter'}</Button>
            <Button variant="outline" onClick={() => { onClose(); resetForm(); }} className="border-[#1e293b]">Annuler</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Contacts" value={contacts.length} color="emerald-400" />
        <StatCard icon={Star} label="Score Moyen" value={avgScore} color="[#06B6D4]" />
        <StatCard icon={MessageSquare} label="WhatsApp Opt-in" value={waOpt} color="emerald-400" />
        <StatCard icon={Smartphone} label="SMS Opt-in" value={smsOpt} color="amber-400" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un contact..." className="pl-10 bg-white/5 border-white/10" />
        </div>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10"><Filter className="w-4 h-4 mr-2 text-slate-400" /><SelectValue placeholder="Segment" /></SelectTrigger>
          <SelectContent className="bg-[#0d1117] border-[#1e293b]">
            <SelectItem value="all">Tous les segments</SelectItem>
            {segments.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10"><Tag className="w-4 h-4 mr-2 text-slate-400" /><SelectValue placeholder="Tag" /></SelectTrigger>
          <SelectContent className="bg-[#0d1117] border-[#1e293b]">
            <SelectItem value="all">Tous les tags</SelectItem>
            {allTags.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={openAdd} className="bg-[#06B6D4] hover:bg-[#0891B2] text-[#06080f] font-semibold">
          <UserPlus className="w-4 h-4 mr-2" />Ajouter
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400 cursor-pointer" onClick={() => toggleSort('name')}>Contact <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
                <TableHead className="text-slate-400 hidden md:table-cell">Téléphone</TableHead>
                <TableHead className="text-slate-400">Tags</TableHead>
                <TableHead className="text-slate-400 hidden sm:table-cell">Segment</TableHead>
                <TableHead className="text-slate-400 cursor-pointer" onClick={() => toggleSort('score')}>Score <ArrowUpDown className="w-3 h-3 inline ml-1" /></TableHead>
                <TableHead className="text-slate-400 hidden lg:table-cell">Opt-in</TableHead>
                <TableHead className="text-slate-400 w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtered.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                    className="border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => setDetailContact(c)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#06B6D4] to-emerald-500 flex items-center justify-center text-[#06080f] font-bold text-xs shrink-0">{c.name.charAt(0)}</div>
                        <div><p className="font-medium text-sm">{c.name}</p><p className="text-xs text-slate-500">{c.email}</p></div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-400 text-sm">{c.phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">{c.tags.slice(0, 2).map(t => <Badge key={t} variant="outline" className="text-[10px] border-[#06B6D4]/30 text-[#06B6D4]">{t}</Badge>)}{c.tags.length > 2 && <Badge variant="outline" className="text-[10px] border-white/20 text-slate-400">+{c.tags.length - 2}</Badge>}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-[10px] border-white/20 text-slate-300">{c.segment}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className={`h-full rounded-full ${scoreBg(c.score)}`} style={{ width: `${c.score}%` }} /></div>
                        <span className={`text-xs font-medium ${scoreColor(c.score)}`}>{c.score}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex gap-2">
                        {c.whatsappOptIn ? <Check className="w-4 h-4 text-emerald-400" /> : <XIcon className="w-4 h-4 text-red-400" />}
                        {c.smsOptIn ? <Check className="w-4 h-4 text-emerald-400" /> : <XIcon className="w-4 h-4 text-red-400" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0d1117] border-[#1e293b]">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setDetailContact(c); }}><Eye className="w-4 h-4 mr-2" />Voir détails</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEdit(c); }}><Edit className="w-4 h-4 mr-2" />Modifier</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success('SMS envoyé à ' + c.name); }}><Smartphone className="w-4 h-4 mr-2" />Envoyer SMS</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success('WhatsApp envoyé à ' + c.name); }}><MessageSquare className="w-4 h-4 mr-2" />Envoyer WhatsApp</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }} className="text-red-400"><Trash2 className="w-4 h-4 mr-2" />Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-slate-500">Aucun contact trouvé</div>}
      </Card>

      {/* Add Dialog */}
      {formDialog(showAddDialog, () => setShowAddDialog(false))}

      {/* Edit Dialog */}
      {formDialog(!!editContact, () => { setEditContact(null); resetForm(); })}

      {/* Detail Sheet */}
      <Sheet open={!!detailContact} onOpenChange={() => setDetailContact(null)}>
        <SheetContent className="bg-[#0a0e1a] border-[#1e293b] text-white overflow-y-auto w-full sm:max-w-md">
          {detailContact && (
            <div className="mt-6 space-y-6">
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#06B6D4] to-emerald-500 flex items-center justify-center text-[#06080f] font-bold text-2xl">{detailContact.name.charAt(0)}</div>
                  <div>
                    <SheetTitle className="text-lg">{detailContact.name}</SheetTitle>
                    <Badge className={`mt-1 ${scoreBg(detailContact.score)} text-white text-xs`}>Score: {detailContact.score}</Badge>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-slate-400" />{detailContact.email || 'Non renseigné'}</div>
                <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-slate-400" />{detailContact.phone}</div>
                <div className="flex items-center gap-2 text-sm"><Tag className="w-4 h-4 text-slate-400" />{detailContact.segment}</div>
                <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-slate-400" />Source: {detailContact.source}</div>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-2">Tags</p>
                <div className="flex gap-2 flex-wrap">{detailContact.tags.map(t => <Badge key={t} variant="outline" className="border-[#06B6D4]/30 text-[#06B6D4]">{t}</Badge>)}</div>
              </div>

              <div className="flex gap-2">
                <Badge variant="outline" className={detailContact.whatsappOptIn ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}>
                  WhatsApp: {detailContact.whatsappOptIn ? 'Opt-in' : 'Opt-out'}
                </Badge>
                <Badge variant="outline" className={detailContact.smsOptIn ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}>
                  SMS: {detailContact.smsOptIn ? 'Opt-in' : 'Opt-out'}
                </Badge>
              </div>

              {detailContact.notes && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Notes</p>
                  <p className="text-sm text-slate-300 bg-white/5 rounded-lg p-3">{detailContact.notes}</p>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-400">Actions rapides</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-white/10 text-sm" onClick={() => { toast.success('WhatsApp envoyé'); }}><MessageSquare className="w-4 h-4 mr-2 text-emerald-400" />WhatsApp</Button>
                  <Button variant="outline" className="border-white/10 text-sm" onClick={() => { toast.success('SMS envoyé'); }}><Smartphone className="w-4 h-4 mr-2 text-amber-400" />SMS</Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => { openEdit(detailContact); setDetailContact(null); }} className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-[#06080f] font-semibold"><Edit className="w-4 h-4 mr-2" />Modifier</Button>
                <Button variant="outline" onClick={() => { handleDelete(detailContact.id); setDetailContact(null); }} className="border-red-500/30 text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
