import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import BlogForm from '@/components/admin/blogs/BlogForm';
import type { DbBlog } from '@/lib/supabase/types';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
  if (error || !data) notFound();
  return (
    <>
      <AdminHeader title="Edit Blog Post" />
      <main className="flex-1 overflow-y-auto p-6"><BlogForm blog={data as DbBlog} /></main>
    </>
  );
}
