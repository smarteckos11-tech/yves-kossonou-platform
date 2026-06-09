'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Upload, Image as ImageIcon,
  BookOpen, GraduationCap, CalendarDays, Camera, Loader2, Cloud,
} from 'lucide-react';
import { useAppStore, Book, Formation, Event } from '@/store/useAppStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface CMSManagerProps {
  initialTab?: string;
}

function CloudinaryUpload({ onUpload, currentImage }: { onUpload: (url: string) => void; currentImage?: string }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (url) onUpload(url);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <p className="text-sm text-[#94A3B8] mb-2 flex items-center gap-2">
        <Cloud size={14} /> Télécharger depuis Cloudinary
      </p>
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        className={`relative border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-[#06B6D4]/30 hover:bg-[#06B6D4]/5 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {currentImage ? (
          <div className="flex items-center gap-3">
            <img src={currentImage} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
            <div className="text-left">
              <p className="text-sm text-white">Image sélectionnée</p>
              <p className="text-xs text-[#64748B]">Cliquez pour changer</p>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <Upload size={24} className="mx-auto text-[#64748B] mb-2" />
            <p className="text-sm text-[#94A3B8]">Cliquez ou glissez pour uploader</p>
            <p className="text-xs text-[#64748B] mt-1">PNG, JPG, WEBP (max 10MB)</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]/80 rounded-xl">
            <Loader2 size={24} className="animate-spin text-[#06B6D4]" />
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
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

export default function CMSManager({ initialTab = 'cms-logos' }: CMSManagerProps) {
  const [activeTab, setActiveTab] = useState(
    initialTab.replace('cms-', '') || 'logos'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestion du Contenu</h1>
        <p className="text-[#94A3B8] text-sm mt-1">Gérez vos logos, photos, livres, formations et événements</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl flex flex-wrap">
          <TabsTrigger value="logos" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-[#94A3B8] text-xs sm:text-sm">
            <ImageIcon size={14} className="mr-1.5" /> Logos
          </TabsTrigger>
          <TabsTrigger value="photos" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-[#94A3B8] text-xs sm:text-sm">
            <Camera size={14} className="mr-1.5" /> Photos
          </TabsTrigger>
          <TabsTrigger value="books" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-[#94A3B8] text-xs sm:text-sm">
            <BookOpen size={14} className="mr-1.5" /> Livres
          </TabsTrigger>
          <TabsTrigger value="formations" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-[#94A3B8] text-xs sm:text-sm">
            <GraduationCap size={14} className="mr-1.5" /> Formations
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-[#94A3B8] text-xs sm:text-sm">
            <CalendarDays size={14} className="mr-1.5" /> Événements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logos" className="mt-6"><LogosManager /></TabsContent>
        <TabsContent value="photos" className="mt-6"><PhotosManager /></TabsContent>
        <TabsContent value="books" className="mt-6"><BooksManager /></TabsContent>
        <TabsContent value="formations" className="mt-6"><FormationsManager /></TabsContent>
        <TabsContent value="events" className="mt-6"><EventsManager /></TabsContent>
      </Tabs>
    </div>
  );
}

function LogosManager() {
  const { logos, addLogo, deleteLogo } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');

  const handleAdd = (url?: string) => {
    const finalUrl = url || uploadUrl;
    if (!finalUrl) return;
    addLogo({ id: `logo-${Date.now()}`, url: finalUrl, name: name || 'Nouveau Logo' });
    setDialogOpen(false);
    setName('');
    setUploadUrl('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Logos ({logos.length})</h3>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDialogOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-sm rounded-xl flex items-center gap-2">
          <Plus size={16} /> Ajouter
        </motion.button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {logos.map((logo) => (
          <motion.div key={logo.id} layout className="glass-card rounded-xl overflow-hidden group">
            <div className="aspect-square relative">
              <img src={logo.url} alt={logo.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => deleteLogo(logo.id)} className="p-2 rounded-lg bg-[#EF4444]/80 text-white hover:bg-[#EF4444] transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-2 text-center text-xs text-[#94A3B8] truncate">{logo.name}</div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white">
          <DialogHeader><DialogTitle>Ajouter un Logo</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du logo"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            <CloudinaryUpload onUpload={setUploadUrl} currentImage={uploadUrl} />
            <div>
              <p className="text-sm text-[#94A3B8] mb-2">Ou choisir une image existante</p>
              <div className="grid grid-cols-4 gap-2">
                {uploadedImages.map((url) => (
                  <button key={url} onClick={() => handleAdd(url)} className="aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-[#06B6D4] transition-all">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            {uploadUrl && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAdd()}
                className="w-full py-3 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold rounded-xl">
                Ajouter ce logo
              </motion.button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PhotosManager() {
  const { photos, addPhoto, deletePhoto } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');

  const handleAdd = (url?: string) => {
    const finalUrl = url || uploadUrl;
    if (!finalUrl) return;
    addPhoto({ id: `photo-${Date.now()}`, url: finalUrl, name: `Photo ${photos.length + 1}` });
    setDialogOpen(false);
    setUploadUrl('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Photos ({photos.length})</h3>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDialogOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-sm rounded-xl flex items-center gap-2">
          <Plus size={16} /> Ajouter
        </motion.button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <motion.div key={photo.id} layout className="glass-card rounded-xl overflow-hidden group">
            <div className="aspect-square relative">
              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => deletePhoto(photo.id)} className="p-2 rounded-lg bg-[#EF4444]/80 text-white hover:bg-[#EF4444] transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-2 text-center text-xs text-[#94A3B8] truncate">{photo.name}</div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white">
          <DialogHeader><DialogTitle>Ajouter une Photo</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <CloudinaryUpload onUpload={setUploadUrl} currentImage={uploadUrl} />
            <div>
              <p className="text-sm text-[#94A3B8] mb-2">Ou choisir une image existante</p>
              <div className="grid grid-cols-4 gap-2">
                {uploadedImages.map((url) => (
                  <button key={url} onClick={() => handleAdd(url)} className="aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-[#06B6D4] transition-all">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BooksManager() {
  const { books, addBook, updateBook, deleteBook } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Book>>({
    title: '', author: 'Yves Kossonou', description: '', price: 0, coverImage: '', buyLink: '#',
  });

  const openEdit = (book: Book) => { setEditId(book.id); setForm(book); setDialogOpen(true); };
  const openNew = () => { setEditId(null); setForm({ title: '', author: 'Yves Kossonou', description: '', price: 0, coverImage: uploadedImages[0], buyLink: '#' }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.title) return;
    if (editId) {
      updateBook(editId, form);
    } else {
      addBook({ id: `book-${Date.now()}`, title: form.title!, author: form.author || 'Yves Kossonou', description: form.description || '', price: form.price || 0, coverImage: form.coverImage || uploadedImages[0], buyLink: form.buyLink || '#' });
    }
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Livres ({books.length})</h3>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openNew}
          className="px-4 py-2 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-sm rounded-xl flex items-center gap-2">
          <Plus size={16} /> Ajouter
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <motion.div key={book.id} layout className="glass-card rounded-xl overflow-hidden group">
            <div className="flex">
              <div className="w-24 h-32 flex-shrink-0">
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-3 flex flex-col">
                <h4 className="text-sm font-semibold text-white line-clamp-2">{book.title}</h4>
                <p className="text-xs text-[#64748B] mt-1">{book.author}</p>
                <p className="text-sm font-bold turquoise-gradient-text mt-auto">{book.price.toLocaleString()} FCFA</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(book)} className="p-1.5 rounded-lg bg-white/5 hover:bg-[#06B6D4]/10 text-[#94A3B8] hover:text-[#06B6D4] transition-colors"><Pencil size={12} /></button>
                  <button onClick={() => deleteBook(book.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-[#EF4444]/10 text-[#94A3B8] hover:text-[#EF4444] transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Modifier le Livre' : 'Ajouter un Livre'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            <input value={form.author || ''} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Auteur" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none resize-none" />
            <input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Prix (FCFA)" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            <input value={form.buyLink || ''} onChange={(e) => setForm({ ...form, buyLink: e.target.value })} placeholder="Lien d'achat" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            <CloudinaryUpload onUpload={(url) => setForm({ ...form, coverImage: url })} currentImage={form.coverImage} />
            <div>
              <p className="text-sm text-[#94A3B8] mb-2">Ou choisir une image existante</p>
              <div className="grid grid-cols-4 gap-2">
                {uploadedImages.map((url) => (
                  <button key={url} onClick={() => setForm({ ...form, coverImage: url })} className={`aspect-square rounded-xl overflow-hidden transition-all ${form.coverImage === url ? 'ring-2 ring-[#06B6D4]' : ''}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
              className="w-full py-3 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold rounded-xl">
              {editId ? 'Modifier' : 'Ajouter'}
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FormationsManager() {
  const { formations, addFormation, updateFormation, deleteFormation } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Formation>>({
    title: '', description: '', price: 0, duration: '', level: 'Débutant', image: '', modules: [],
  });

  const openEdit = (f: Formation) => { setEditId(f.id); setForm(f); setDialogOpen(true); };
  const openNew = () => { setEditId(null); setForm({ title: '', description: '', price: 0, duration: '', level: 'Débutant', image: uploadedImages[0], modules: [] }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.title) return;
    if (editId) {
      updateFormation(editId, form);
    } else {
      addFormation({ id: `formation-${Date.now()}`, title: form.title!, description: form.description || '', price: form.price || 0, duration: form.duration || '', level: form.level || 'Débutant', image: form.image || uploadedImages[0], modules: form.modules || [] });
    }
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Formations ({formations.length})</h3>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openNew} className="px-4 py-2 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-sm rounded-xl flex items-center gap-2">
          <Plus size={16} /> Ajouter
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {formations.map((f) => (
          <motion.div key={f.id} layout className="glass-card rounded-xl overflow-hidden group">
            <div className="flex">
              <div className="w-28 h-24 flex-shrink-0">
                <img src={f.image} alt={f.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-3 flex flex-col">
                <h4 className="text-sm font-semibold text-white line-clamp-1">{f.title}</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4]">{f.level}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#94A3B8]">{f.duration}</span>
                </div>
                <p className="text-sm font-bold turquoise-gradient-text mt-auto">{f.price.toLocaleString()} FCFA</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg bg-white/5 hover:bg-[#06B6D4]/10 text-[#94A3B8] hover:text-[#06B6D4] transition-colors"><Pencil size={12} /></button>
                  <button onClick={() => deleteFormation(f.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-[#EF4444]/10 text-[#94A3B8] hover:text-[#EF4444] transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Modifier la Formation' : 'Ajouter une Formation'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none resize-none" />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Prix (FCFA)" className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
              <input value={form.duration || ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Durée" className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            </div>
            <select value={form.level || 'Débutant'} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none">
              <option value="Débutant" className="bg-[#0F172A]">Débutant</option>
              <option value="Intermédiaire" className="bg-[#0F172A]">Intermédiaire</option>
              <option value="Avancé" className="bg-[#0F172A]">Avancé</option>
            </select>
            <CloudinaryUpload onUpload={(url) => setForm({ ...form, image: url })} currentImage={form.image} />
            <div>
              <p className="text-sm text-[#94A3B8] mb-2">Ou choisir une image existante</p>
              <div className="grid grid-cols-4 gap-2">
                {uploadedImages.map((url) => (
                  <button key={url} onClick={() => setForm({ ...form, image: url })} className={`aspect-square rounded-xl overflow-hidden transition-all ${form.image === url ? 'ring-2 ring-[#06B6D4]' : ''}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className="w-full py-3 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold rounded-xl">
              {editId ? 'Modifier' : 'Ajouter'}
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EventsManager() {
  const { events, addEvent, updateEvent, deleteEvent } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Event>>({
    title: '', date: '', location: '', description: '', price: 0, image: '',
  });

  const openEdit = (ev: Event) => { setEditId(ev.id); setForm(ev); setDialogOpen(true); };
  const openNew = () => { setEditId(null); setForm({ title: '', date: '', location: '', description: '', price: 0, image: uploadedImages[0] }); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.title) return;
    if (editId) {
      updateEvent(editId, form);
    } else {
      addEvent({ id: `event-${Date.now()}`, title: form.title!, date: form.date || '', location: form.location || '', description: form.description || '', price: form.price || 0, image: form.image || uploadedImages[0] });
    }
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Événements ({events.length})</h3>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openNew} className="px-4 py-2 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold text-sm rounded-xl flex items-center gap-2">
          <Plus size={16} /> Ajouter
        </motion.button>
      </div>

      <div className="space-y-4">
        {events.map((ev) => (
          <motion.div key={ev.id} layout className="glass-card rounded-xl p-4 flex items-center gap-4 group">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">{ev.title}</h4>
              <div className="flex gap-3 mt-1 text-xs text-[#64748B]">
                <span>{new Date(ev.date).toLocaleDateString('fr-FR')}</span>
                <span>{ev.location}</span>
              </div>
              <p className="text-sm font-bold turquoise-gradient-text mt-1">{ev.price.toLocaleString()} FCFA</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(ev)} className="p-2 rounded-lg bg-white/5 hover:bg-[#06B6D4]/10 text-[#94A3B8] hover:text-[#06B6D4] transition-colors"><Pencil size={14} /></button>
              <button onClick={() => deleteEvent(ev.id)} className="p-2 rounded-lg bg-white/5 hover:bg-[#EF4444]/10 text-[#94A3B8] hover:text-[#EF4444] transition-colors"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0F172A] border-white/10 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Modifier l\'Événement' : 'Ajouter un Événement'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-[#06B6D4]/50 focus:outline-none" />
              <input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Lieu" className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            </div>
            <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none resize-none" />
            <input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Prix (FCFA)" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#06B6D4]/50 focus:outline-none" />
            <CloudinaryUpload onUpload={(url) => setForm({ ...form, image: url })} currentImage={form.image} />
            <div>
              <p className="text-sm text-[#94A3B8] mb-2">Ou choisir une image existante</p>
              <div className="grid grid-cols-4 gap-2">
                {uploadedImages.map((url) => (
                  <button key={url} onClick={() => setForm({ ...form, image: url })} className={`aspect-square rounded-xl overflow-hidden transition-all ${form.image === url ? 'ring-2 ring-[#06B6D4]' : ''}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className="w-full py-3 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-[#081120] font-semibold rounded-xl">
              {editId ? 'Modifier' : 'Ajouter'}
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
