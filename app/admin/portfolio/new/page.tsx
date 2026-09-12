'use client';

import AdminHeader from '@/components/admin/layout/AdminHeader';
import PortfolioForm from '@/components/admin/portfolio/PortfolioForm';

export default function NewPortfolioPage() {
  return (
    <>
      <AdminHeader title="Add Portfolio Project" />
      <main className="flex-1 overflow-y-auto p-6">
        <PortfolioForm />
      </main>
    </>
  );
}
