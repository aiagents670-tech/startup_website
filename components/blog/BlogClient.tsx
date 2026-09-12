'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { blogPosts as staticPosts, blogCategories } from '@/lib/data/blog';
import { db } from '@/lib/db';

const categoryColors: Record<string, string> = {
  AI: 'from-cyan-500 to-blue-500',
  React: 'from-blue-400 to-blue-600',
  Python: 'from-yellow-500 to-green-500',
  Cloud: 'from-sky-500 to-cyan-500',
  SEO: 'from-orange-500 to-yellow-500',
  'UI/UX': 'from-pink-500 to-rose-500',
  Business: 'from-emerald-500 to-teal-500',
  Security: 'from-red-500 to-rose-500',
  'Web Development': 'from-violet-500 to-purple-500',
};

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [postsList, setPostsList] = useState<any[]>(staticPosts);

  useEffect(() => {
    async function load() {
      try {
        const live = await db.getBlogs();
        if (live && live.length > 0) {
          const formatted = live
            .filter((b) => b.status === 'published')
            .map((b) => ({
              id: b.id,
              slug: b.slug || b.title.toLowerCase().replace(/\s+/g, '-'),
              title: b.title,
              excerpt: b.short_description,
              category: b.category || 'Engineering',
              author: { name: b.author || 'TERVOM Team', role: 'Engineering' },
              date: (b.published_at || b.created_at || '').substring(0, 10),
              readTime: `${b.reading_time || 5} min read`,
              tags: b.tags || [],
              featured: true,
            }));
          if (formatted.length > 0) setPostsList(formatted);
        }
      } catch (err) {
        console.error('Error loading live blog list:', err);
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

  const filtered = activeCategory === 'All'
    ? postsList
    : postsList.filter((p) => p.category === activeCategory || p.tags.includes(activeCategory));

  const featured = postsList.filter((p) => p.featured);

  return (
    <section className="section-padding bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Featured posts */}
        {activeCategory === 'All' && (
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {featured.slice(0, 2).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="glass-card overflow-hidden card-hover group block"
              >
                <div className={`h-48 bg-gradient-to-br ${categoryColors[post.category] ?? 'from-primary-500 to-secondary-500'} flex items-center justify-center relative`}>
                  <span className="text-7xl opacity-30">📝</span>
                  <div className="absolute top-4 left-4 glass-card px-3 py-1 text-xs font-bold text-white bg-black/20">
                    Featured
                  </div>
                  <div className="absolute top-4 right-4 glass-card px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="font-heading font-bold text-[var(--foreground)] text-xl mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-[var(--muted)] text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full gradient-bg text-white flex items-center justify-center text-xs font-bold">
                          {post.author.name.charAt(0)}
                        </div>
                        {post.author.name}
                      </span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                    </div>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              id={`blog-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'gradient-bg text-white shadow-lg'
                  : 'glass-card text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="glass-card overflow-hidden card-hover group block h-full"
                >
                  <div className={`h-40 bg-gradient-to-br ${categoryColors[post.category] ?? 'from-primary-500 to-secondary-500'} flex items-center justify-center relative`}>
                    <span className="text-5xl opacity-30">📰</span>
                    <div className="absolute top-3 right-3 glass-card px-2.5 py-0.5 text-xs font-semibold text-[var(--foreground)]">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-[var(--muted)] mb-3">
                      <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                    </div>
                    <h3 className="font-heading font-bold text-[var(--foreground)] mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[var(--muted)] text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                        <div className="w-6 h-6 rounded-full gradient-bg text-white flex items-center justify-center text-xs font-bold">
                          {post.author.name.charAt(0)}
                        </div>
                        {post.author.name}
                      </div>
                      <span className="text-primary-500 text-xs font-semibold flex items-center gap-1">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
