'use client';

import { Bell, User } from 'lucide-react';

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title = 'Dashboard' }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b border-white/8 bg-[#060b14]/80 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="font-heading font-bold text-white text-lg">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-white/10">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <span className="text-xs text-slate-400 hidden sm:block truncate max-w-[120px]">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
