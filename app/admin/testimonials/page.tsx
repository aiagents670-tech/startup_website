'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import type { DbTestimonial } from '@/lib/supabase/types';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminModal from '@/components/admin/ui/AdminModal';
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState';

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<DbTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<DbTestimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('display_order');
    if (data) setItems(data as DbTestimonial[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from('testimonials').delete().eq('id', deleteTarget.id);
    setDeleting(false);
    if (error) toast.error('Delete failed');
    else { toast.success('Deleted'); setDeleteTarget(null); fetch(); }
  };

  const toggleActive = async (item: DbTestimonial) => {
    await supabase.from('testimonials').update({ is_active: !item.is_active }).eq('id', item.id);
    toast.success(item.is_active ? 'Hidden' : 'Shown');
    fetch();
  };

  return (
    <>
      <AdminHeader title="Testimonials" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-end mb-5">
          <Link href="/admin/testimonials/new" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-all">
            <Plus size={16} /> Add Testimonial
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <AdminEmptyState title="No testimonials" description="Add client reviews to display on the homepage." action={<Link href="/admin/testimonials/new" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 transition-colors"><Plus size={16} />Add Testimonial</Link>} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={item.id} className={`rounded-2xl border p-5 transition-all ${item.is_active ? 'border-white/8 bg-white/[0.02]' : 'border-white/4 bg-white/[0.01] opacity-60'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {item.image_url ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden relative flex-shrink-0">
                        <Image src={item.image_url} alt={item.client_name} fill sizes="36px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-400 text-sm font-bold">{item.client_name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-white">{item.client_name}</div>
                      <div className="text-xs text-slate-500">{item.position} · {item.company}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(item.rating)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3 italic">"{item.review}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {item.is_featured && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400">Featured</span>}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.is_active ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>{item.is_active ? 'Active' : 'Hidden'}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggleActive(item)} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all text-xs">{item.is_active ? '🙈' : '👁'}</button>
                    <Link href={`/admin/testimonials/${item.id}/edit`} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all"><Edit2 size={13} /></Link>
                    <button onClick={() => setDeleteTarget(item)} className="w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <AdminModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Testimonial" description={`Delete review from "${deleteTarget?.client_name}"?`} confirmLabel="Delete" confirmDanger loading={deleting} />
    </>
  );
}
