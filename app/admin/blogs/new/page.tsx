import AdminHeader from '@/components/admin/layout/AdminHeader';
import BlogForm from '@/components/admin/blogs/BlogForm';

export default function NewBlogPage() {
  return (
    <>
      <AdminHeader title="New Blog Post" />
      <main className="flex-1 overflow-y-auto p-6"><BlogForm /></main>
    </>
  );
}
