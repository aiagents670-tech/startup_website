import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import ServiceForm from '@/components/admin/services/ServiceForm';
import type { DbService } from '@/lib/supabase/types';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
  if (error || !data) notFound();

  return (
    <>
      <AdminHeader title="Edit Service" />
      <main className="flex-1 overflow-y-auto p-6">
        <ServiceForm service={data as DbService} />
      </main>
    </>
  );
}
