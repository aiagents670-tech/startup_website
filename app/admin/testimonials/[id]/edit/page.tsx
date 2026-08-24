import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import TestimonialForm from '@/components/admin/testimonials/TestimonialForm';
import type { DbTestimonial } from '@/lib/supabase/types';

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single();
  if (error || !data) notFound();
  return (<><AdminHeader title="Edit Testimonial" /><main className="flex-1 overflow-y-auto p-6"><TestimonialForm testimonial={data as DbTestimonial} /></main></>);
}
