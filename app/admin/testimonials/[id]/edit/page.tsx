'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import TestimonialForm from '@/components/admin/testimonials/TestimonialForm';
import type { DbTestimonial } from '@/lib/types/db';

export default function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [testimonial, setTestimonial] = useState<DbTestimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.getTestimonialById(id);
      setTestimonial(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Testimonial" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        </main>
      </>
    );
  }

  if (!testimonial) notFound();

  return (
    <>
      <AdminHeader title="Edit Testimonial" />
      <main className="flex-1 overflow-y-auto p-6">
        <TestimonialForm testimonial={testimonial} />
      </main>
    </>
  );
}
