'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { db } from '@/lib/db';
import type { DbService } from '@/lib/types/db';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminModal from '@/components/admin/ui/AdminModal';
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState';

function SortableRow({ service, onDelete, onToggle }: { service: DbService; onDelete: () => void; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3 w-8">
        <button {...attributes} {...listeners} className="cursor-grab text-slate-600 hover:text-slate-400 touch-none">
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{service.icon}</span>
          <div>
            <div className="text-sm font-medium text-white">{service.name}</div>
            <div className="text-xs text-slate-500">{service.slug}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell">{service.category || '—'}</td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${service.is_active ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>
          {service.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        {service.is_featured && <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400">Featured</span>}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <button onClick={onToggle} title={service.is_active ? 'Disable' : 'Enable'} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            {service.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <Link href={`/admin/services/${service.id}/edit`} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all">
            <Edit2 size={14} />
          </Link>
          <button onClick={onDelete} className="w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<DbService | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    const data = await db.getServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = services.findIndex(s => s.id === active.id);
    const newIndex = services.findIndex(s => s.id === over.id);
    const reordered = arrayMove(services, oldIndex, newIndex);
    setServices(reordered);
    await Promise.all(reordered.map((s, i) => db.saveService({ id: s.id, display_order: i })));
    toast.success('Order saved');
  };

  const handleToggle = async (service: DbService) => {
    await db.saveService({ id: service.id, is_active: !service.is_active });
    toast.success(service.is_active ? 'Service disabled' : 'Service enabled');
    fetchServices();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await db.deleteService(deleteTarget.id);
    setDeleting(false);
    toast.success('Service deleted');
    setDeleteTarget(null);
    fetchServices();
  };

  return (
    <>
      <AdminHeader title="Services" />
      <main className="flex-1 overflow-y-auto p-6">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services…"
              className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 w-64 transition-all"
            />
          </div>
          <Link href="/admin/services/new" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-all">
            <Plus size={16} /> Add Service
          </Link>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <AdminEmptyState
              title="No services yet"
              description="Add your first service to display it on the website."
              action={<Link href="/admin/services/new" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors"><Plus size={16} />Add Service</Link>}
            />
          ) : (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={services.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/8 text-left">
                      <th className="px-4 py-3 w-8" />
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Service</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Featured</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(service => (
                      <SortableRow
                        key={service.id}
                        service={service}
                        onDelete={() => setDeleteTarget(service)}
                        onToggle={() => handleToggle(service)}
                      />
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </main>

      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
        confirmDanger
        loading={deleting}
      />
    </>
  );
}
