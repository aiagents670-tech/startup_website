'use client';

import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from './NewsletterForm';
import { Mail, Phone, Lock } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaYoutube } from 'react-icons/fa';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/case-studies' },
  ],
  services: [
    { label: 'Web Development', href: '/services/web-development' },
    { label: 'Mobile Apps', href: '/services/mobile-apps' },
    { label: 'AI Solutions', href: '/services/ai-solutions' },
    { label: 'Cloud Services', href: '/services/cloud-solutions' },
    { label: 'UI/UX Design', href: '/services/ui-ux-design' },
    { label: 'SEO & Marketing', href: '/services/seo' },
  ],
  portfolio: [
    { label: 'All Projects', href: '/portfolio' },
    { label: 'Web Projects', href: '/portfolio?filter=web' },
    { label: 'Mobile Projects', href: '/portfolio?filter=mobile' },
    { label: 'AI Projects', href: '/portfolio?filter=ai' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Sitemap', href: '/sitemap.xml' },
    { label: 'Admin Portal', href: '/admin/login' },
  ],
};

const socialLinks = [
  { icon: FaTwitter, href: 'https://twitter.com/tervom', label: 'Twitter' },
  { icon: FaLinkedin, href: 'https://linkedin.com/company/tervom', label: 'LinkedIn' },
  { icon: FaGithub, href: 'https://github.com/tervom', label: 'GitHub' },
  { icon: FaInstagram, href: 'https://instagram.com/tervom', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://youtube.com/tervom', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[var(--surface)] border-t border-[var(--border)] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter */}
        <div className="py-8 sm:py-12 border-b border-[var(--border)]">
          <div className="glass-card p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
            <div>
              <h3 className="text-xl font-heading font-bold text-[var(--foreground)] mb-1">
                Stay ahead with TERVOM
              </h3>
              <p className="text-[var(--muted)] text-sm">
                Get the latest insights on technology, AI, and digital innovation — straight to your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-8 sm:py-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/tervom-logo-dark.png"
                  alt="TERVOM Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl gradient-text leading-tight tracking-wide">
                  TERVOM
                </span>
                <span className="text-[9px] font-semibold tracking-[0.15em] text-[var(--muted)] uppercase leading-tight">
                  Engineering Digital Success.
                </span>
              </div>
            </Link>
            <p className="text-[var(--muted)] text-sm leading-relaxed mb-6 max-w-xs">
              We engineer digital success for startups and enterprises worldwide. Scalable, modern, and future-proof technology solutions — delivered with precision.
            </p>
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:hello@tervom.com" className="flex items-center gap-3 text-[var(--muted)] hover:text-primary-500 transition-colors text-sm group">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                  <Mail size={14} className="text-primary-500" />
                </div>
                hello@tervom.com
              </a>
              <a href="tel:+917416858563" className="flex items-center gap-3 text-[var(--muted)] hover:text-primary-500 transition-colors text-sm group">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                  <Phone size={14} className="text-primary-500" />
                </div>
                +91 74168 58563
              </a>
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Company', links: footerLinks.company },
            { title: 'Services', links: footerLinks.services },
            { title: 'Legal', links: footerLinks.legal },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-heading font-semibold text-[var(--foreground)] mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[var(--muted)] hover:text-primary-500 text-sm transition-colors flex items-center gap-1.5"
                    >
                      {link.label === 'Admin Portal' && <Lock size={12} className="text-primary-400" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-5 sm:py-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
            <p className="text-[var(--muted)] text-sm">
              © {new Date().getFullYear()} TERVOM. All rights reserved. Code. Innovate. Elevate.
            </p>
            <Link
              href="/admin/login"
              id="footer-admin-login-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 hover:text-primary-300 text-xs font-semibold border border-primary-500/20 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <Lock size={12} />
              Admin Login
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-11 h-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-primary-500 hover:border-primary-500/50 hover:bg-primary-500/10 transition-all duration-200 active:scale-95"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
