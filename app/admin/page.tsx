'use client';

import { useEffect, useState } from 'react';
import { Wrench, Briefcase, BookOpen, MessageSquare, Star, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import StatsCard from '@/components/admin/ui/StatsCard';
import { supabase } from '@/lib/supabase/client';

interface Stats {
  services: number;
  portfolio: number;
  blogs: number;
  messages: number;
  testimonials: number;
}

const quickLinks = [
  { label: 'Add Service', href: '/admin/services/new', icon: Wrench, color: 'from-blue-600 to-cyan-500' },
  { label: 'Add Project', href: '/admin/portfolio/new', icon: Briefcase, color: 'from-violet-600 to-purple-500' },
  { label: 'Write Blog', href: '/admin/blogs/new', icon: BookOpen, color: 'from-pink-600 to-rose-500' },
  { label: 'Add Testimonial', href: '/admin/testimonials/new', icon: Star, color: 'from-amber-500 to-orange-500' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ services: 0, portfolio: 0, blogs: 0, messages: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [svc, port, blg, msg, test] = await Promise.all([
          supabase.from('services').select('id', { count: 'exact', head: true }),
          supabase.from('portfolio').select('id', { count: 'exact', head: true }),
          supabase.from('blogs').select('id', { count: 'exact', head: true }),
          supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
          supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        ]);
        setStats({
          services:     svc.count ?? 0,
          portfolio:    port.count ?? 0,
          blogs:        blg.count ?? 0,
          messages:     msg.count ?? 0,
          testimonials: test.count ?? 0,
        });
      } catch (e) {
        console.error('Failed to load dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statsCards = [
    { title: 'Total Services',     value: stats.services,     icon: Wrench,         color: 'bg-blue-500' },
    { title: 'Portfolio Projects',  value: stats.portfolio,    icon: Briefcase,      color: 'bg-violet-500' },
    { title: 'Blog Posts',          value: stats.blogs,        icon: BookOpen,       color: 'bg-pink-500' },
    { title: 'Contact Messages',    value: stats.messages,     icon: MessageSquare,  color: 'bg-emerald-500' },
    { title: 'Testimonials',        value: stats.testimonials, icon: Star,           color: 'bg-amber-500' },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* Stats */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statsCards.map((card, i) => (
              <StatsCard key={card.title} {...card} index={i} loading={loading} />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map(({ label, href, icon: Icon, color }, i) => (
              <motion.div key={href} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.06 }}>
                <Link
                  href={href}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/6 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{label}</span>
                  <ArrowRight size={14} className="ml-auto text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Manage Sections */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Manage Content</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Services', desc: `${stats.services} total services`, href: '/admin/services', icon: Wrench, color: 'text-blue-400' },
              { title: 'Portfolio', desc: `${stats.portfolio} projects`, href: '/admin/portfolio', icon: Briefcase, color: 'text-violet-400' },
              { title: 'Blog', desc: `${stats.blogs} posts`, href: '/admin/blogs', icon: BookOpen, color: 'text-pink-400' },
              { title: 'Messages', desc: `${stats.messages} submissions`, href: '/admin/messages', icon: MessageSquare, color: 'text-emerald-400' },
              { title: 'Testimonials', desc: `${stats.testimonials} reviews`, href: '/admin/testimonials', icon: Star, color: 'text-amber-400' },
              { title: 'Settings', desc: 'Site configuration', href: '/admin/settings', icon: Plus, color: 'text-slate-400' },
            ].map(({ title, desc, href, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/5 hover:border-white/15 transition-all group"
              >
                <Icon size={20} className={color} />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">{title}</div>
                  <div className="text-xs text-slate-500">{loading ? '...' : desc}</div>
                </div>
                <ArrowRight size={14} className="ml-auto text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
