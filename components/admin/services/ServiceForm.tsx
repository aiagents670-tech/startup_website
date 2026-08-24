'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { DbService } from '@/lib/supabase/types';

const schema = z.object({
  name:              z.string().min(2, 'Name required'),
  slug:              z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Lowercase, numbers, hyphens only'),
  category:          z.string().optional(),
  icon:              z.string().optional(),
  short_description: z.string().min(10, 'Short description required'),
  full_description:  z.string().optional(),
  pricing:           z.string().optional(),
  delivery_time:     z.string().optional(),
  button_text:       z.string().default('Get a Quote'),
  button_link:       z.string().default('/contact'),
  color:             z.string().default('from-blue-500 to-cyan-500'),
  bg:                z.string().default('bg-blue-500/10'),
  is_featured:       z.boolean().default(false),
  is_active:         z.boolean().default(true),
  seo_title:         z.string().optional(),
  seo_description:   z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface ServiceFormProps {
  service?: DbService;
}

export default function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const isEdit = !!service;
  const [imageUrl, setImageUrl] = useState<string | null>(service?.image_url ?? null);
  const [features, setFeatures] = useState<string[]>(service?.features ?? []);
  const [technologies, setTechnologies] = useState<string[]>(service?.technologies ?? []);
  const [featureInput, setFeatureInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:              service?.name ?? '',
      slug:              service?.slug ?? '',
      category:          service?.category ?? '',
      icon:              service?.icon ?? '⚙️',
      short_description: service?.short_description ?? '',
      full_description:  service?.full_description ?? '',
      pricing:           service?.pricing ?? '',
      delivery_time:     service?.delivery_time ?? '',
      button_text:       service?.button_text ?? 'Get a Quote',
      button_link:       service?.button_link ?? '/contact',
      color:             service?.color ?? 'from-blue-500 to-cyan-500',
      bg:                service?.bg ?? 'bg-blue-500/10',
      is_featured:       service?.is_featured ?? false,
      is_active:         service?.is_active ?? true,
      seo_title:         service?.seo_title ?? '',
      seo_description:   service?.seo_description ?? '',
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('name', e.target.value);
    if (!isEdit) {
      setValue('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };
  const addTech = () => {
    if (techInput.trim()) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = { ...data, image_url: imageUrl, features, technologies };
      if (isEdit) {
        const { error } = await supabase.from('services').update(payload).eq('id', service.id);
        if (error) throw error;
        toast.success('Service updated!');
      } else {
        const { error } = await supabase.from('services').insert([{ ...payload, display_order: 999 }]);
        if (error) throw error;
        toast.success('Service created!');
      }
      router.push('/admin/services');
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

      {/* Basic Info */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Basic Information</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Service Name *</label>
            <input {...register('name')} onChange={handleNameChange} className={inputClass} placeholder="Web Development" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input {...register('slug')} className={inputClass} placeholder="web-development" />
            {errors.slug && <p className="text-red-400 text-xs mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Icon (Emoji)</label>
            <input {...register('icon')} className={inputClass} placeholder="🌐" />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input {...register('category')} className={inputClass} placeholder="Development, Design, Marketing…" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Short Description *</label>
          <textarea {...register('short_description')} rows={2} className={inputClass} placeholder="Brief description shown on cards…" />
          {errors.short_description && <p className="text-red-400 text-xs mt-1">{errors.short_description.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Full Description</label>
          <textarea {...register('full_description')} rows={4} className={inputClass} placeholder="Detailed service description…" />
        </div>
      </div>

      {/* Image */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Service Image</h3>
        <ImageUpload value={imageUrl} onChange={setImageUrl} bucket="service-images" folder="services" label="Service Image (Optional)" />
      </div>

      {/* Features & Technologies */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Features & Technologies</h3>

        {/* Features */}
        <div>
          <label className={labelClass}>Key Features</label>
          <div className="flex gap-2 mb-2">
            <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} className={`${inputClass} flex-1`} placeholder="Add a feature and press Enter" />
            <button type="button" onClick={addFeature} className="px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {features.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 text-xs border border-blue-500/20">
                {f}
                <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))} className="hover:text-red-400 transition-colors"><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className={labelClass}>Technologies Used</label>
          <div className="flex gap-2 mb-2">
            <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} className={`${inputClass} flex-1`} placeholder="React, Node.js, AWS…" />
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
      </div>

      {/* CTA & Styling */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Button & Styling</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Button Text</label>
            <input {...register('button_text')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Button Link</label>
            <input {...register('button_link')} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Card Gradient (Tailwind)</label>
            <input {...register('color')} className={inputClass} placeholder="from-blue-500 to-cyan-500" />
          </div>
          <div>
            <label className={labelClass}>Card Background (Tailwind)</label>
            <input {...register('bg')} className={inputClass} placeholder="bg-blue-500/10" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Pricing (Optional)</label>
            <input {...register('pricing')} className={inputClass} placeholder="Starting at $999" />
          </div>
          <div>
            <label className={labelClass}>Delivery Time</label>
            <input {...register('delivery_time')} className={inputClass} placeholder="2–4 weeks" />
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-slate-300">Active (visible on site)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded accent-blue-500" />
            <span className="text-sm text-slate-300">Featured</span>
          </label>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">SEO</h3>
        <div>
          <label className={labelClass}>Meta Title</label>
          <input {...register('seo_title')} className={inputClass} placeholder="Web Development Services | TERVOM" />
        </div>
        <div>
          <label className={labelClass}>Meta Description</label>
          <textarea {...register('seo_description')} rows={2} className={inputClass} placeholder="Premium web development services…" />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? 'Update Service' : 'Create Service'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/services')}
          className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
