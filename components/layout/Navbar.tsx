'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import TervomLogo from '@/components/layout/TervomLogo';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) setMobileOpen(false);
    });
    return () => { active = false; };
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 tervom-header-glass`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        {/* Nav row — h-14 on mobile, h-20 on desktop */}
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0" aria-label="TERVOM Home">
            <TervomLogo />
            <span className="text-[9px] font-semibold tracking-[0.18em] text-[var(--muted)] uppercase leading-tight hidden sm:block mt-1">
              Engineering Digital Success.
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-primary-500 active'
                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              id="nav-cta-btn"
              className="hidden sm:inline-flex items-center gap-2 gradient-bg text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full shadow-lg hover:opacity-90 hover:scale-105 transition-all duration-200 min-h-[44px]"
            >
              Start Your Project
            </Link>

            {/* Mobile hamburger — 48×48 touch target */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors active:scale-95"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — full-width drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
          >
            <div
              className="tervom-header-glass border-t border-white/10 px-4 py-3 flex flex-col gap-1"
              style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center px-4 py-3.5 rounded-2xl text-base font-semibold min-h-[52px] transition-colors ${
                      pathname === link.href
                        ? 'gradient-bg-soft text-primary-500'
                        : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] active:bg-[var(--surface-2)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* CTA inside menu */}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 gradient-bg text-white text-base font-bold px-5 py-4 rounded-2xl text-center hover:opacity-90 transition-opacity min-h-[52px] flex items-center justify-center shadow-lg"
              >
                🚀 Start Your Project
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
