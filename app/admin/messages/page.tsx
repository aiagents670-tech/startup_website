'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, Mail, Download, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { db } from '@/lib/db';
import type { DbContactMessage } from '@/lib/types/db';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminModal from '@/components/admin/ui/AdminModal';
import AdminEmptyState from '@/components/admin/ui/AdminEmptyState';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<DbContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<DbContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DbContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const data = await db.getMessages();
    setMessages(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.service.toLowerCase().includes(search.toLowerCase())
  );

  const markRead = async (msg: DbContactMessage) => {
    await db.markMessageRead(msg.id, !msg.is_read);
    fetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await db.deleteMessage(deleteTarget.id);
    setDeleting(false);
    toast.success('Message deleted');
    setDeleteTarget(null);
    if (selected?.id === deleteTarget.id) setSelected(null);
    fetch();
  };

  const exportCSV = () => {
    const rows = [
      ['Name', 'Email', 'Phone', 'Service', 'Budget', 'Message', 'Date'],
      ...filtered.map(m => [m.name, m.email, m.phone || '', m.service, m.budget, m.message.replace(/,/g, ';'), format(new Date(m.created_at), 'yyyy-MM-dd')]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'messages.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  return (
    <>
      <AdminHeader title="Contact Messages" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…" className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/60 w-64" />
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-all">
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className="flex gap-4 h-[calc(100vh-220px)]">
          {/* List */}
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 rounded-2xl border border-white/8 bg-white/[0.02] overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
              <AdminEmptyState title="No messages" description="Contact form submissions will appear here." />
            ) : (
              filtered.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => { setSelected(msg); if (!msg.is_read) markRead(msg); }}
                  className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-all ${selected?.id === msg.id ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : ''}`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-medium ${msg.is_read ? 'text-slate-300' : 'text-white font-semibold'}`}>{msg.name}</span>
                    <span className="text-[10px] text-slate-500">{format(new Date(msg.created_at), 'MMM d')}</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{msg.email}</div>
                  <div className="text-xs text-slate-600 truncate mt-0.5">{msg.service} · {msg.budget}</div>
                  {!msg.is_read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />}
                </button>
              ))
            )}
          </div>

          {/* Detail */}
          <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.02] p-6 overflow-y-auto hidden md:block">
            {selected ? (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                    <p className="text-sm text-slate-400">{selected.email} {selected.phone && `· ${selected.phone}`}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => markRead(selected)} title={selected.is_read ? 'Mark unread' : 'Mark read'} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                      {selected.is_read ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <a href={`mailto:${selected.email}`} className="w-8 h-8 rounded-lg hover:bg-blue-500/15 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all">
                      <Mail size={15} />
                    </a>
                    <button onClick={() => setDeleteTarget(selected)} className="w-8 h-8 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[['Service', selected.service], ['Budget', selected.budget], ['Business Type', selected.business_type], ['Date', format(new Date(selected.created_at), 'MMM d, yyyy h:mm a')]].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-white/5 border border-white/8 p-3">
                      <div className="text-xs text-slate-500 mb-0.5">{k}</div>
                      <div className="text-sm text-white font-medium">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-white/5 border border-white/8 p-4">
                  <div className="text-xs text-slate-500 mb-2">Message</div>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                <a href={`mailto:${selected.email}?subject=Re: Your inquiry about ${selected.service}`} className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors w-fit">
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-sm">Select a message to view details</div>
            )}
          </div>
        </div>
      </main>
      <AdminModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Message" description={`Permanently delete message from "${deleteTarget?.name}"?`} confirmLabel="Delete" confirmDanger loading={deleting} />
    </>
  );
}
