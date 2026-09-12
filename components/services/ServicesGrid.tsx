'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';

interface Service {
  slug: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
  bg: string;
}

export default function ServicesGrid({ services: initialServices }: { services: Service[] }) {
  const [servicesList, setServicesList] = useState<Service[]>(initialServices);

  useEffect(() => {
    async function load() {
      try {
        const live = await db.getServices();
        if (live && live.length > 0) {
          const formatted = live
            .filter((s) => s.is_active !== false)
            .map((s) => ({
              slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
              icon: s.icon || '🌐',
              title: s.name,
              description: s.short_description,
              features: s.features || [],
              color: s.color || 'from-blue-500 to-cyan-500',
              bg: s.bg || 'bg-blue-500/10',
            }));
          if (formatted.length > 0) setServicesList(formatted);
        }
      } catch (err) {
        console.error('Error loading live services grid:', err);
      }
    }
    load();
    window.addEventListener('tervom_db_updated', load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener('tervom_db_updated', load);
      window.removeEventListener('storage', load);
    };
  }, []);
  return (
    <section className="section-padding bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, i) => {
            const contactHref = `/contact?service=${encodeURIComponent(service.title)}`;
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={contactHref}
                  className="group relative flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer glass-card p-6 border border-[var(--border)] transition-all duration-300 ease-out hover:-translate-y-[5px] hover:shadow-[0_15px_35px_rgba(59,130,246,0.25)] hover:border-primary-500/50 hover:ring-1 hover:ring-primary-500/30 active:scale-[0.98] active:brightness-125 block"
                  style={{ textDecoration: 'none' }}
                >
                  {/* Subtle edge light sheen & click ripple flash */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
                    <div className="absolute -inset-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out" />
                    <div className="absolute inset-0 opacity-0 group-active:opacity-100 bg-white/25 transition-opacity duration-150" />
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${service.bg} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h2 className="font-heading font-bold text-[var(--foreground)] text-xl mb-3 group-hover:text-primary-500 transition-colors duration-300">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="text-[var(--muted)] text-sm leading-relaxed mb-5 flex-1">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <span className="text-primary-500 font-bold">✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA link row */}
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 group-hover:gap-3 transition-all duration-300">
                    Get a Free Quote <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
