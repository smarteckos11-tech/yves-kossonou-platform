'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  User as FirebaseUser,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type AuthMode = 'login' | 'register' | 'reset';

export default function LoginPage() {
  const { setView, setUser, setFirebaseUser } = useAppStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);
        // Try to get user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || 'Utilisateur',
              email: data.email || firebaseUser.email || '',
              avatar: data.avatar || firebaseUser.photoURL || '/images/ChatGPT Image 3 juin 2026, 21_08_22.png',
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Utilisateur',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || '/images/ChatGPT Image 3 juin 2026, 21_08_22.png',
            });
          }
        } catch {
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Utilisateur',
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || '/images/ChatGPT Image 3 juin 2026, 21_08_22.png',
          });
        }
        setView('dashboard');
      }
    });

    return () => unsubscribe();
  }, [setView, setUser, setFirebaseUser]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        // Auth state listener will handle the rest
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        // Save to Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          name,
          email,
          phone,
          avatar: '',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      const errorCode = err?.code || '';
      if (errorCode === 'auth/user-not-found') setError('Aucun compte trouvé avec cet email');
      else if (errorCode === 'auth/wrong-password') setError('Mot de passe incorrect');
      else if (errorCode === 'auth/email-already-in-use') setError('Cet email est déjà utilisé');
      else if (errorCode === 'auth/weak-password') setError('Le mot de passe doit contenir au moins 6 caractères');
      else if (errorCode === 'auth/invalid-email') setError('Email invalide');
      else if (errorCode === 'auth/invalid-credential') setError('Identifiants incorrects');
      else setError(err?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Veuillez entrer votre email pour réinitialiser votre mot de passe');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMode('login');
      setError('');
      alert('Un email de réinitialisation a été envoyé à ' + email);
    } catch (err: any) {
      const errorCode = err?.code || '';
      if (errorCode === 'auth/user-not-found') setError('Aucun compte trouvé avec cet email');
      else if (errorCode === 'auth/invalid-email') setError('Email invalide');
      else setError(err?.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Save to Firestore if new user
      if (result.user) {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', result.user.uid), {
            name: result.user.displayName || '',
            email: result.user.email || '',
            avatar: result.user.photoURL || '',
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err?.message || 'Erreur de connexion Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 animated-gradient-bg" />
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #D4AF37, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-20 w-4 h-4 rounded-full bg-[#D4AF37]/40"
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-32 left-32 w-6 h-6 rounded-full bg-[#3B82F6]/30"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-20 w-3 h-3 rounded-full bg-[#8B5CF6]/40"
        animate={{ y: [0, 25, 0], x: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-strong rounded-3xl p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#E8C84A] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/20"
            >
              <span className="text-[#081120] font-bold text-3xl">YK</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {mode === 'login' ? 'Bienvenue' : 'Créer un compte'}
            </h1>
            <p className="text-[#94A3B8] text-sm">
              {mode === 'login' ? 'Connectez-vous à votre espace' : 'Rejoignez la plateforme'}
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 px-4 py-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-sm text-[#94A3B8] mb-1.5 block">Nom complet</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Yves Kossonou"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#94A3B8] mb-1.5 block">Téléphone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+225 07 12 34 56"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm text-[#94A3B8] mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yveskossonou.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#94A3B8] mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-[#64748B] focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#CBD5E1] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10 text-[#D4AF37] focus:ring-[#D4AF37]/30" />
                  <span className="text-xs text-[#94A3B8]">Se souvenir de moi</span>
                </label>
                <button type="button" onClick={handlePasswordReset} className="text-xs text-[#D4AF37] hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#E8C84A] text-[#081120] font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Se connecter' : 'Créer le compte'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-[#64748B]">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 glass rounded-xl text-[#CBD5E1] font-medium flex items-center justify-center gap-3 hover:border-white/20 transition-all disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </motion.button>

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-sm text-[#94A3B8] hover:text-[#D4AF37] transition-colors"
            >
              {mode === 'login' ? (
                <>Pas encore de compte ? <span className="text-[#D4AF37] font-medium">Créer un compte</span></>
              ) : (
                <>Déjà un compte ? <span className="text-[#D4AF37] font-medium">Se connecter</span></>
              )}
            </button>
          </div>

          {/* Back to site */}
          <div className="mt-3 text-center">
            <button
              onClick={() => setView('landing')}
              className="text-sm text-[#64748B] hover:text-[#D4AF37] transition-colors"
            >
              ← Retour au site
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
