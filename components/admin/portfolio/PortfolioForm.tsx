'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/lib/db';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { DbPortfolio } from '@/lib/types/db';

const schema = z.object({
  title:             z.string().min(2, 'Title required'),
  slug:              z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
  category:          z.string().min(1, 'Category required'),
  client_name:       z.string().optional(),
  short_description: z.string().min(10, 'Short description required'),
  full_description:  z.string().optional(),
  demo_url:          z.string().optional(),
  github_url:        z.string().optional(),
  completion_date:   z.string().optional(),
  is_featured:       z.boolean(),
  is_active:         z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface PortfolioFormProps {
  project?: DbPortfolio;
}

export default function PortfolioForm({ project }: PortfolioFormProps) {
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
      title:             project?.title ?? '',
      slug:              project?.slug ?? '',
      category:          project?.category ?? 'Web',
      client_name:       project?.client_name ?? '',
      short_description: project?.short_description ?? '',
      full_description:  project?.full_description ?? '',
      demo_url:          project?.demo_url ?? '',
      github_url:        project?.github_url ?? '',
      completion_date:   project?.completion_date ?? '',
      is_featured:       project?.is_featured ?? true,
      is_active:         project?.is_active ?? true,
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('title', e.target.value);
    if (!isEdit) {
      setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const addTech = () => {
    if (techInput.trim()) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        id: project?.id,
        image_url: imageUrl,
        technologies,
        features,
      };
      await db.savePortfolio(payload);
      toast.success(isEdit ? 'Project updated!' : 'Project created!');
      router.push('/admin/portfolio');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/60 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Basic Info */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Project Overview</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Project Title *</label>
            <input {...register('title')} onChange={handleTitleChange} className={inputClass} placeholder="FinTrack Pro" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input {...register('slug')} className={inputClass} placeholder="fintrack-pro" />
            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category *</label>
            <select {...register('category')} className={`${inputClass} bg-slate-900 cursor-pointer`}>
              <option value="Web">Web App</option>
              <option value="Mobile">Mobile App</option>
              <option value="AI">AI Solutions</option>
              <option value="Ecommerce">Ecommerce</option>
              <option value="CRM">CRM</option>
              <option value="ERP">ERP</option>
            </select>
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Client Name</label>
            <input {...register('client_name')} className={inputClass} placeholder="FinTrack Inc." />
          </div>
        </div>

        <div>
          <label className={labelClass}>Short Description *</label>
          <textarea {...register('short_description')} rows={2} className={inputClass} placeholder="Brief summary of the project…" />
          {errors.short_description && <p className="text-red-400 text-xs mt-1">{errors.short_description.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Full Description</label>
          <textarea {...register('full_description')} rows={4} className={inputClass} placeholder="Detailed case study and results…" />
        </div>
      </div>

      {/* Image */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Project Image</h3>
        <ImageUpload value={imageUrl} onChange={setImageUrl} label="Project Cover Image" />
      </div>

      {/* Tech & Features */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Tech Stack & Key Features</h3>

        <div>
          <label className={labelClass}>Technologies Used</label>
          <div className="flex gap-2 mb-2">
            <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} className={`${inputClass} flex-1`} placeholder="Next.js, Python, PostgreSQL…" />
            <button type="button" onClick={addTech} className="px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/15 text-violet-300 text-xs border border-violet-500/20">
                {t}
                <button type="button" onClick={() => setTechnologies(technologies.filter((_, j) => j !== i))} className="hover:text-red-400 transition-colors"><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Key Features / Results</label>
          <div className="flex gap-2 mb-2">
            <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} className={`${inputClass} flex-1`} placeholder="300% faster reporting…" />
            <button type="button" onClick={addFeature} className="px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {features.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 text-xs border border-purple-500/20">
                {f}
                <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="hover:text-red-400 transition-colors"><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Links & Visibility */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Live Links & Options</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Live Demo URL</label>
            <input {...register('demo_url')} className={inputClass} placeholder="https://example.com" />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input {...register('github_url')} className={inputClass} placeholder="https://github.com/..." />
          </div>
        </div>
        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded accent-violet-500" />
            <span className="text-sm text-slate-300">Active (Visible on site)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded accent-violet-500" />
            <span className="text-sm text-slate-300">Featured Project</span>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? 'Update Project' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/portfolio')}
          className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
