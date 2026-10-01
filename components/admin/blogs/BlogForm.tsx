'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { db } from '@/lib/db';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { DbBlog } from '@/lib/types/db';

const schema = z.object({
  title:             z.string().min(3, 'Title is required (min 3 chars)'),
  slug:              z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  author:            z.string().min(1, 'Author is required'),
  category:          z.string().optional(),
  reading_time:      z.coerce.number().int().min(1, 'Reading time must be at least 1 min'),
  short_description: z.string().min(10, 'Summary is required (min 10 chars)'),
  seo_title:         z.string().optional(),
  seo_description:   z.string().optional(),
  status:            z.enum(['draft', 'published']),
  published_at:      z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BlogForm({ blog }: { blog?: DbBlog }) {
  const router = useRouter();
  const isEdit = !!blog;
  const [imageUrl, setImageUrl] = useState<string | null>(blog?.image_url ?? null);
  const [tags, setTags] = useState<string[]>(blog?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  // Track whether the user clicked "Publish" or "Save as Draft"
  const submitActionRef = useRef<'published' | 'draft'>('draft');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your blog content here…' }),
    ],
    content: blog?.content || '',
    editorProps: {
      attributes: {
        class: 'min-h-[300px] p-4 text-slate-300 text-sm leading-relaxed focus:outline-none prose prose-invert max-w-none',
      },
    },
  });

  const defaultPublishedAt = blog?.published_at
    ? new Date(blog.published_at).toISOString().slice(0, 16)
    : '';

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:             blog?.title ?? '',
      slug:              blog?.slug ?? '',
      author:            blog?.author ?? 'TERVOM Team',
      category:          blog?.category ?? '',
      reading_time:      blog?.reading_time ?? 5,
      short_description: blog?.short_description ?? '',
      seo_title:         blog?.seo_title ?? '',
      seo_description:   blog?.seo_description ?? '',
      status:            (blog?.status as 'draft' | 'published') ?? 'draft',
      published_at:      defaultPublishedAt,
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('title', e.target.value);
    if (!isEdit) setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleCancel = () => {
    if (isEdit && blog) {
      // Reset form to original blog values
      reset({
        title:             blog.title,
        slug:              blog.slug,
        author:            blog.author,
        category:          blog.category ?? '',
        reading_time:      blog.reading_time ?? 5,
        short_description: blog.short_description,
        seo_title:         blog.seo_title ?? '',
        seo_description:   blog.seo_description ?? '',
        status:            blog.status,
        published_at:      defaultPublishedAt,
      });
      setImageUrl(blog.image_url ?? null);
      setTags(blog.tags ?? []);
      editor?.commands.setContent(blog.content || '');
    }
    router.push('/admin/blogs');
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const content = editor?.getHTML() || '';
      const now = new Date().toISOString();
      // Use the ref-captured action (set synchronously before form submit fires)
      const status = submitActionRef.current;
      const published_at = status === 'published'
        ? (data.published_at ? new Date(data.published_at).toISOString() : now)
        : null;

      const payload = {
        ...data,
        status,
        id: blog?.id,
        image_url: imageUrl,
        tags,
        content,
        published_at,
      };
      await db.saveBlog(payload);
      toast.success(isEdit ? 'Blog updated successfully' : 'Blog created successfully');
      router.push('/admin/blogs');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/60 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">

      {/* Basic */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Post Details</h3>
        <div>
          <label className={labelClass}>Title *</label>
          <input {...register('title')} onChange={handleTitleChange} className={inputClass} placeholder="My Amazing Blog Post" />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Slug *</label>
            <input {...register('slug')} className={inputClass} placeholder="my-amazing-blog-post" />
            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Author *</label>
            <input {...register('author')} className={inputClass} />
            {errors.author && <p className="text-red-400 text-xs mt-1">{errors.author.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input {...register('category')} className={inputClass} placeholder="Technology, AI, Web Dev…" />
          </div>
          <div>
            <label className={labelClass}>Reading Time (min)</label>
            <input type="number" {...register('reading_time')} className={inputClass} min={1} />
            {errors.reading_time && <p className="text-red-400 text-xs mt-1">{errors.reading_time.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Publish Date</label>
            <input
              type="datetime-local"
              {...register('published_at')}
              className={`${inputClass} [color-scheme:dark]`}
            />
            <p className="text-slate-600 text-[10px] mt-1">Leave empty to use current time when publishing</p>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select {...register('status')} className={`${inputClass} cursor-pointer`}>
              <option value="draft" className="bg-[#0d1526]">Draft</option>
              <option value="published" className="bg-[#0d1526]">Published</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Short Summary *</label>
          <textarea {...register('short_description')} rows={2} className={inputClass} placeholder="Brief summary shown on blog cards…" />
          {errors.short_description && <p className="text-red-400 text-xs mt-1">{errors.short_description.message}</p>}
        </div>
      </div>

      {/* Featured Image */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Featured Image</h3>
        <ImageUpload value={imageUrl} onChange={setImageUrl} label="Featured Image" />
      </div>

      {/* Content Editor */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Content</h3>
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-white/8">
          {[
            { label: 'B', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
            { label: 'I', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
            { label: 'H2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
            { label: 'H3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive('heading', { level: 3 }) },
            { label: '• List', action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive('bulletList') },
            { label: '1. List', action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive('orderedList') },
            { label: 'Code', action: () => editor?.chain().focus().toggleCode().run(), active: editor?.isActive('code') },
            { label: '―', action: () => editor?.chain().focus().setHorizontalRule().run(), active: false },
          ].map(({ label, action, active }) => (
            <button key={label} type="button" onClick={action} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${active ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>{label}</button>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] min-h-[280px]">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Tags</h3>
        <div className="flex gap-2 mb-2">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className={`${inputClass} flex-1`} placeholder="Add a tag and press Enter" />
          <button type="button" onClick={addTag} className="px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white transition-colors"><Plus size={16} /></button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500/15 text-pink-300 text-xs border border-pink-500/20">
              {t}<button type="button" onClick={() => setTags(tags.filter((_, j) => j !== i))} className="hover:text-red-400"><X size={12} /></button>
            </span>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">SEO</h3>
        <div><label className={labelClass}>Meta Title</label><input {...register('seo_title')} className={inputClass} /></div>
        <div><label className={labelClass}>Meta Description</label><textarea {...register('seo_description')} rows={2} className={inputClass} /></div>
      </div>

      {/* Publish */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="submit"
          onClick={() => { submitActionRef.current = 'published'; }}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? 'Update & Publish' : 'Publish Blog'}
        </button>
        <button
          type="submit"
          onClick={() => { submitActionRef.current = 'draft'; }}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-colors disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2.5 text-sm text-slate-500 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
