'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    // Login page — no sidebar, just full-screen
    return (
      <div className="min-h-screen bg-[#060b14]" suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060b14] flex" suppressHydrationWarning>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
