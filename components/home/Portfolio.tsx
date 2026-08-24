'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { portfolioProjects, portfolioCategories } from '@/lib/data/portfolio';

const categoryLabels: Record<string, string> = {
  all: 'All Projects',
  web: 'Web',
  mobile: 'Mobile',
  ai: 'AI',
  crm: 'CRM',
  erp: 'ERP',
  ecommerce: 'Ecommerce',
};

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered =
    activeFilter === 'all'
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="section-padding bg-[var(--surface)]" aria-label="Portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3"
          >
            Our Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4"
          >
            Work That <span className="gradient-text">Speaks for Itself</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] max-w-2xl mx-auto"
          >
            500+ projects delivered across industries. Real solutions, real impact — here are some of TERVOM&apos;s most transformative works.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              id={`portfolio-filter-${cat}`}
              onClick={() => setActiveFilter(cat)}
              suppressHydrationWarning
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeFilter === cat
                  ? 'gradient-bg text-white shadow-lg scale-105'
                  : 'glass-card text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {categoryLabels[cat] ?? cat}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass-card overflow-hidden card-hover group"
              >
                {/* Image placeholder with gradient */}
                <div className="relative h-48 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 flex items-center justify-center overflow-hidden">
                  <div className="text-6xl opacity-50 group-hover:scale-125 transition-transform duration-500">
                    {project.category === 'web' && '🌐'}
                    {project.category === 'mobile' && '📱'}
                    {project.category === 'ai' && '🤖'}
                    {project.category === 'crm' && '👥'}
                    {project.category === 'erp' && '⚙️'}
                    {project.category === 'ecommerce' && '🛒'}
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 glass-card px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                    {project.categoryLabel}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-heading font-bold text-[var(--foreground)] text-lg mb-2 group-hover:text-primary-500 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium">
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[var(--surface-2)] text-[var(--muted)]">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:gap-2.5 transition-all"
                    >
                      View Details
                      <ArrowRight size={14} />
                    </Link>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl glass-card hover:border-primary-500/50 transition-colors text-[var(--muted)] hover:text-primary-500"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 gradient-bg text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:opacity-90 hover:scale-105 transition-all"
          >
            View All Projects
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
