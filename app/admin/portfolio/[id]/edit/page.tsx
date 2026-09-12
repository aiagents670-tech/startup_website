'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import PortfolioForm from '@/components/admin/portfolio/PortfolioForm';
import type { DbPortfolio } from '@/lib/types/db';

export default function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<DbPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.getPortfolioById(id);
      setProject(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Project" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        </main>
      </>
    );
  }

  if (!project) notFound();

  return (
    <>
      <AdminHeader title="Edit Project" />
      <main className="flex-1 overflow-y-auto p-6">
        <PortfolioForm project={project} />
      </main>
    </>
  );
}
