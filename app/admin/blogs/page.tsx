'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import type { DbBlog } from '@/lib/supabase/types';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminModal from '@/components/admin/ui/AdminModal';
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<DbBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteTarget, setDeleteTarget] = useState<DbBlog | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (data) setBlogs(data as DbBlog[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const filtered = blogs.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('blogs').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) toast.error('Delete failed');
    else { toast.success('Blog deleted'); setDeleteTarget(null); fetch(); }
  };

  const toggleStatus = async (blog: DbBlog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from('blogs').update({ status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : null }).eq('id', blog.id);
    if (error) toast.error('Failed to update');
    else { toast.success(newStatus === 'published' ? 'Published!' : 'Moved to draft'); fetch(); }
  };

  return (
    <>
      <AdminHeader title="Blog Posts" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search blogs…" className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 w-52" />
            </div>
            {(['all', 'published', 'draft'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>{f}</button>
            ))}
          </div>
          <Link href="/admin/blogs/new" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-all">
            <Plus size={16} /> New Post
          </Link>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <AdminEmptyState title="No blog posts" description="Write your first blog post." action={<Link href="/admin/blogs/new" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-500 transition-colors"><Plus size={16} />New Post</Link>} />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">Title</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left hidden sm:table-cell">Author</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(blog => (
                  <tr key={blog.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={14} className="text-pink-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white line-clamp-1">{blog.title}</div>
                          <div className="text-xs text-slate-500">{blog.category || blog.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell">{blog.author}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">
                      {blog.published_at ? format(new Date(blog.published_at), 'MMM d, yyyy') : format(new Date(blog.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(blog)} className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition-all hover:opacity-80 ${blog.status === 'published' ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>
                        {blog.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/blogs/${blog.id}/edit`} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all"><Edit2 size={14} /></Link>
                        <button onClick={() => setDeleteTarget(blog)} className="w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <AdminModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Blog Post" description={`Delete "${deleteTarget?.title}"? This is permanent.`} confirmLabel="Delete" confirmDanger loading={deleting} />
    </>
  );
}
