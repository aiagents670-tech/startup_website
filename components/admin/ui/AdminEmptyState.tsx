'use client';

import { FileX } from 'lucide-react';

interface AdminEmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function AdminEmptyState({
  title = 'No records found',
  description = 'Get started by adding your first entry.',
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <FileX size={24} className="text-slate-600" />
      </div>
      <h3 className="text-base font-semibold text-slate-300 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}
