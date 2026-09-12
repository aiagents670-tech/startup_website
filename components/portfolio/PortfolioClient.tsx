'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { portfolioProjects as staticPortfolio, portfolioCategories } from '@/lib/data/portfolio';
import { db } from '@/lib/db';

const categoryLabels: Record<string, string> = {
  all: 'All',
  web: 'Web',
  mobile: 'Mobile',
  ai: 'AI',
  crm: 'CRM',
  erp: 'ERP',
  ecommerce: 'Ecommerce',
};

const categoryEmojis: Record<string, string> = {
  web: '🌐', mobile: '📱', ai: '🤖', crm: '👥', erp: '⚙️', ecommerce: '🛒',
};

export default function PortfolioClient() {
  const [filter, setFilter] = useState('all');
  const [projectsList, setProjectsList] = useState<any[]>(staticPortfolio);

  useEffect(() => {
    async function load() {
      try {
        const live = await db.getPortfolio();
        if (live && live.length > 0) {
          const formatted = live
            .filter((p) => p.is_active !== false)
            .map((p) => ({
              id: p.id,
              slug: p.slug || p.title.toLowerCase().replace(/\s+/g, '-'),
              title: p.title,
              category: p.category.toLowerCase(),
              categoryLabel: p.category,
              description: p.short_description,
              results: p.features || [],
              tech: p.technologies || [],
              image: p.image_url || '/images/portfolio/fintrack.jpg',
              liveUrl: p.demo_url || '#',
              featured: p.is_featured,
            }));
          if (formatted.length > 0) setProjectsList(formatted);
        }
      } catch (err) {
        console.error('Error loading live portfolio page:', err);
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

  const filtered = filter === 'all'
    ? projectsList
    : projectsList.filter((p) => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <section className="section-padding bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              id={`portfolio-page-filter-${cat}`}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filter === cat
                  ? 'gradient-bg text-white shadow-lg'
                  : 'glass-card text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {categoryLabels[cat] ?? cat}
            </button>
          ))}
        </div>

        {/* Grid */}
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
                {/* Image */}
                <div className="relative h-52 bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 flex items-center justify-center">
                  <span className="text-7xl opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500">
                    {categoryEmojis[project.category] ?? '💻'}
                  </span>
                  <div className="absolute top-3 left-3 glass-card px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                    {project.categoryLabel}
                  </div>
                  {project.featured && (
                    <div className="absolute top-3 right-3 gradient-bg px-2.5 py-1 rounded-full text-white text-xs font-bold">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-heading font-bold text-[var(--foreground)] text-lg mb-2">
                    {project.title}
                  </h3>
                  <p className="text-[var(--muted)] text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Results highlights */}
                  <div className="mb-4 space-y-1">
                    {project.results.slice(0, 2).map((r: string) => (
                      <div key={r} className="text-xs text-green-500 flex items-center gap-1.5">
                        <span>↑</span> {r}
                      </div>
                    ))}
                  </div>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tech.slice(0, 4).map((t: string) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Link href={`/portfolio/${project.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:gap-2.5 transition-all">
                      View Details <ArrowRight size={14} />
                    </Link>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl glass-card hover:border-primary-500/50 text-[var(--muted)] hover:text-primary-500 transition-all">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
