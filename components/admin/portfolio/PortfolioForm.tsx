'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { DbPortfolio } from '@/lib/supabase/types';

const schema = z.object({
  title:             z.string().min(2, 'Title required'),
  slug:              z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/),
  category:          z.string().min(1, 'Category required'),
  client_name:       z.string().optional(),
  short_description: z.string().min(10, 'Description required'),
  full_description:  z.string().optional(),
  demo_url:          z.string().url().optional().or(z.literal('')),
  github_url:        z.string().url().optional().or(z.literal('')),
  case_study:        z.string().optional(),
  completion_date:   z.string().optional(),
  is_featured:       z.boolean().default(false),
  is_active:         z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function PortfolioForm({ project }: { project?: DbPortfolio }) {
  const router = useRouter();
  const isEdit = !!project;
  const [imageUrl, setImageUrl] = useState<string | null>(project?.image_url ?? null);
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies ?? []);
  const [features, setFeatures] = useState<string[]>(project?.features ?? []);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title ?? '', slug: project?.slug ?? '', category: project?.category ?? 'web',
      client_name: project?.client_name ?? '', short_description: project?.short_description ?? '',
      full_description: project?.full_description ?? '', demo_url: project?.demo_url ?? '',
      github_url: project?.github_url ?? '', case_study: project?.case_study ?? '',
      completion_date: project?.completion_date ?? '', is_featured: project?.is_featured ?? false, is_active: project?.is_active ?? true,
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('title', e.target.value);
    if (!isEdit) setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = { ...data, image_url: imageUrl, technologies, features };
      if (isEdit) {
        const { error } = await supabase.from('portfolio').update(payload).eq('id', project.id);
        if (error) throw error; toast.success('Project updated!');
      } else {
        const { error } = await supabase.from('portfolio').insert([{ ...payload, display_order: 999 }]);
        if (error) throw error; toast.success('Project added!');
      }
      router.push('/admin/portfolio'); router.refresh();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed.'); }
    finally { setSaving(false); }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/60 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Project Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Title *</label><input {...register('title')} onChange={handleTitleChange} className={inputClass} />{errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}</div>
          <div><label className={labelClass}>Slug *</label><input {...register('slug')} className={inputClass} />{errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}</div>
          <div>
            <label className={labelClass}>Category *</label>
            <select {...register('category')} className={inputClass}>
              {['web', 'mobile', 'ai', 'ecommerce', 'saas', 'other'].map(c => <option key={c} value={c} className="bg-[#0d1526]">{c}</option>)}
            </select>
          </div>
          <div><label className={labelClass}>Client Name</label><input {...register('client_name')} className={inputClass} /></div>
          <div><label className={labelClass}>Completion Date</label><input {...register('completion_date')} className={inputClass} placeholder="Q1 2024" /></div>
          <div><label className={labelClass}>Live Demo URL</label><input {...register('demo_url')} className={inputClass} placeholder="https://…" /></div>
          <div><label className={labelClass}>GitHub URL</label><input {...register('github_url')} className={inputClass} placeholder="https://github.com/…" /></div>
        </div>
        <div><label className={labelClass}>Short Description *</label><textarea {...register('short_description')} rows={2} className={inputClass} />{errors.short_description && <p className="text-red-400 text-xs mt-1">{errors.short_description.message}</p>}</div>
        <div><label className={labelClass}>Full Description</label><textarea {...register('full_description')} rows={4} className={inputClass} /></div>
        <div><label className={labelClass}>Case Study</label><textarea {...register('case_study')} rows={3} className={inputClass} placeholder="Problem, solution, results…" /></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded accent-blue-500" /><span className="text-sm text-slate-300">Active</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded accent-blue-500" /><span className="text-sm text-slate-300">Featured</span></label>
        </div>
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Project Image</h3>
        <ImageUpload value={imageUrl} onChange={setImageUrl} bucket="portfolio-images" folder="portfolio" label="Project Screenshot" />
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Technologies & Features</h3>
        <div>
          <label className={labelClass}>Technologies</label>
          <div className="flex gap-2 mb-2">
            <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), technologies.length && setTechnologies([...technologies, techInput.trim()]), setTechInput(''))} className={`${inputClass} flex-1`} placeholder="React, Node.js…" />
            <button type="button" onClick={() => { if (techInput.trim()) { setTechnologies([...technologies, techInput.trim()]); setTechInput(''); }}} className="px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white"><Plus size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">{technologies.map((t, i) => <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-300 text-xs border border-violet-500/20">{t}<button type="button" onClick={() => setTechnologies(technologies.filter((_, j) => j !== i))}><X size={12} /></button></span>)}</div>
        </div>
        <div>
          <label className={labelClass}>Key Features</label>
          <div className="flex gap-2 mb-2">
            <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), featureInput.trim() && (setFeatures([...features, featureInput.trim()]), setFeatureInput('')))} className={`${inputClass} flex-1`} placeholder="Add a feature…" />
            <button type="button" onClick={() => { if (featureInput.trim()) { setFeatures([...features, featureInput.trim()]); setFeatureInput(''); }}} className="px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white"><Plus size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-1.5">{features.map((f, i) => <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 text-xs border border-blue-500/20">{f}<button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))}><X size={12} /></button></span>)}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50">
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? 'Update Project' : 'Add Project'}
        </button>
        <button type="button" onClick={() => router.push('/admin/portfolio')} className="px-4 py-2.5 text-sm text-slate-500 hover:text-white">Cancel</button>
      </div>
    </form>
  );
}
