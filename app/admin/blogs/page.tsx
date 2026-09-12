'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, BookOpen, Tag, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { db } from '@/lib/db';
import type { DbBlog } from '@/lib/types/db';
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

  const fetchBlogs = async () => {
    setLoading(true);
    const data = await db.getBlogs();
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const filtered = blogs.filter(b => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.author?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (b.category?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await db.deleteBlog(deleteTarget.id);
    setDeleting(false);
    toast.success('Blog deleted successfully');
    setDeleteTarget(null);
    fetchBlogs();
  };

  const toggleStatus = async (blog: DbBlog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    await db.saveBlog({
      id: blog.id,
      status: newStatus,
      published_at: newStatus === 'published' ? (blog.published_at ?? new Date().toISOString()) : blog.published_at,
    });
    toast.success(newStatus === 'published' ? 'Blog published successfully' : 'Blog moved to draft');
    fetchBlogs();
  };

  const publishedCount = blogs.filter(b => b.status === 'published').length;
  const draftCount = blogs.filter(b => b.status === 'draft').length;

  return (
    <>
      <AdminHeader title="Blog Posts" />
      <main className="flex-1 overflow-y-auto p-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Posts', value: blogs.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Published', value: publishedCount, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'Drafts', value: draftCount, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`rounded-2xl border border-white/8 ${bg} p-4`}>
              <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search blogs…"
                className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 w-52 transition-all"
              />
            </div>
            {(['all', 'published', 'draft'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-pink-500/20"
          >
            <Plus size={16} /> New Post
          </Link>
        </div>

        {/* Blog cards grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            title="No blog posts found"
            description={search ? 'No blogs match your search. Try a different keyword.' : 'Write your first blog post to get started.'}
            action={
              !search ? (
                <Link
                  href="/admin/blogs/new"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-semibold hover:bg-pink-500 transition-colors"
                >
                  <Plus size={16} />New Post
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onToggleStatus={() => toggleStatus(blog)}
                onDelete={() => setDeleteTarget(blog)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete this blog? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmDanger
        loading={deleting}
      />
    </>
  );
}

// ── Blog Card ────────────────────────────────────────────────────────────────

function BlogCard({
  blog,
  onToggleStatus,
  onDelete,
}: {
  blog: DbBlog;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  const publishDate = blog.published_at
    ? format(new Date(blog.published_at), 'MMM d, yyyy')
    : format(new Date(blog.created_at), 'MMM d, yyyy');

  return (
    <article className="group flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/12 transition-all overflow-hidden">

      {/* Cover image */}
      <div className="relative w-full h-40 bg-gradient-to-br from-pink-500/10 to-rose-500/5 flex-shrink-0 overflow-hidden">
        {blog.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={32} className="text-pink-400/40" />
          </div>
        )}
        {/* Status badge */}
        <button
          onClick={onToggleStatus}
          title="Click to toggle status"
          className={`absolute top-3 left-3 inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all hover:scale-105 shadow-lg ${
            blog.status === 'published'
              ? 'bg-green-500/90 text-white'
              : 'bg-slate-700/90 text-slate-300'
          }`}
        >
          {blog.status === 'published' ? '● Published' : '○ Draft'}
        </button>
        {/* Category badge */}
        {blog.category && (
          <span className="absolute top-3 right-3 inline-flex px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-pink-300 border border-pink-500/20">
            {blog.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Title */}
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-pink-300 transition-colors">
          {blog.title}
        </h3>

        {/* Short description */}
        {blog.short_description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {blog.short_description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
          {blog.author && (
            <span className="flex items-center gap-1">
              <User size={10} />
              {blog.author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {publishDate}
          </span>
          {blog.reading_time && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {blog.reading_time} min read
            </span>
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 text-[10px] border border-pink-500/15"
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
            {blog.tags.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-500 text-[10px]">
                +{blog.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1 mt-auto border-t border-white/5">
          <Link
            href={`/admin/blogs/${blog.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
          >
            <Edit2 size={12} />
            Edit
          </Link>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
