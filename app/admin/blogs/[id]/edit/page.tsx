'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import BlogForm from '@/components/admin/blogs/BlogForm';
import type { DbBlog } from '@/lib/types/db';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blog, setBlog] = useState<DbBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.getBlogById(id);
      setBlog(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Blog Post" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        </main>
      </>
    );
  }

  if (!blog) notFound();

  return (
    <>
      <AdminHeader title="Edit Blog Post" />
      <main className="flex-1 overflow-y-auto p-6"><BlogForm blog={blog} /></main>
    </>
  );
}
