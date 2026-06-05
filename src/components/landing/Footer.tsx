'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { toast } from 'sonner';

const footerLinks = {
  'Plateforme': [
    { label: 'Expertise', href: '#expertise', external: false },
    { label: 'Livres', href: '#books', external: false },
    { label: 'Formations', href: '#formations', external: false },
    { label: 'Événements', href: '#events', external: false },
  ],
  'Ressources': [
    { label: 'Blog', href: '#blog', external: true },
    { label: 'Podcast', href: '#podcast', external: true },
    { label: 'Cas d\'études', href: '#case-studies', external: true },
    { label: 'FAQ', href: '#faq', external: true },
  ],
  'Légal': [
    { label: 'Mentions légales', href: '#legal', external: true },
    { label: 'Politique de confidentialité', href: '#privacy', external: true },
    { label: 'CGV', href: '#terms', external: true },
    { label: 'Cookies', href: '#cookies', external: true },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/yveskossonou', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/yveskossonou', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/yveskossonou', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/in/yveskossonou', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/@yveskossonou', label: 'YouTube' },
];

export default function Footer() {
  const { logos } = useAppStore();

  const handleNavClick = (href: string, label: string, external: boolean) => {
    if (external) {
      toast.info(`${label} — Bientôt disponible`);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/5 bg-[#060D1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {logos.length > 0 ? (
                <img
                  src={logos[0].url}
                  alt="Yves Kossonou"
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#E8C84A] flex items-center justify-center text-[#081120] font-bold text-lg">
                  YK
                </div>
              )}
              <span className="text-xl font-bold gold-gradient-text">Yves Kossonou</span>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 max-w-sm">
              Expert en transformation digitale, je accompagne les entrepreneurs et organisations
              africains dans leur croissance grâce au digital et à l&apos;intelligence artificielle.
            </p>
            <div className="flex flex-col gap-2 text-sm text-[#64748B]">
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-[#D4AF37]" />
                contact@yveskossonou.com
              </span>
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-[#D4AF37]" />
                +225 07 00 00 00 00
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-[#D4AF37]" />
                Abidjan, Côte d&apos;Ivoire
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavClick(link.href, link.label, link.external)}
                      className="text-sm text-[#64748B] hover:text-[#D4AF37] transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#475569]">
            &copy; {new Date().getFullYear()} Yves Kossonou. Tous droits réservés.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-[#64748B] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
