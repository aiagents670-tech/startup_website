'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ServiceForm from '@/components/admin/services/ServiceForm';
import type { DbService } from '@/lib/types/db';

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [service, setService] = useState<DbService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.getServiceById(id);
      setService(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Service" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        </main>
      </>
    );
  }

  if (!service) notFound();

  return (
    <>
      <AdminHeader title="Edit Service" />
      <main className="flex-1 overflow-y-auto p-6">
        <ServiceForm service={service} />
      </main>
    </>
  );
}
