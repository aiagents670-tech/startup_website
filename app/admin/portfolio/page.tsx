'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/lib/db';
import type { DbPortfolio } from '@/lib/types/db';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminModal from '@/components/admin/ui/AdminModal';
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState';

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<DbPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<DbPortfolio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const data = await db.getPortfolio();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await db.deletePortfolio(deleteTarget.id);
    setDeleting(false);
    toast.success('Project deleted');
    setDeleteTarget(null);
    fetch();
  };

  return (
    <>
      <AdminHeader title="Portfolio" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…" className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 w-64" />
          </div>
          <Link href="/admin/portfolio/new" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-sm font-semibold hover:opacity-90 transition-all">
            <Plus size={16} /> Add Project
          </Link>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <AdminEmptyState title="No projects yet" description="Add your first portfolio project." action={<Link href="/admin/portfolio/new" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors"><Plus size={16} />Add Project</Link>} />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">Project</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left hidden md:table-cell">Featured</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(project => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {project.image_url ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-violet-400 text-xs font-bold">{project.title.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">{project.title}</div>
                          <div className="text-xs text-slate-500">{project.client_name || project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell">{project.category}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {project.is_featured && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400">Featured</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/portfolio/${project.id}/edit`} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all"><Edit2 size={14} /></Link>
                        <button onClick={() => setDeleteTarget(project)} className="w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <AdminModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Project" description={`Delete "${deleteTarget?.title}"? This removes it from the live website.`} confirmLabel="Delete" confirmDanger loading={deleting} />
    </>
  );
}
