'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '@/lib/db';
import ImageUpload from '@/components/admin/ui/ImageUpload';
import type { DbTestimonial } from '@/lib/types/db';

const schema = z.object({
  client_name: z.string().min(2, 'Name required'),
  company:     z.string().min(1, 'Company required'),
  position:    z.string().min(1, 'Position required'),
  review:      z.string().min(20, 'Review required'),
  rating:      z.coerce.number().int().min(1).max(5),
  project:     z.string().optional(),
  is_featured: z.boolean(),
  is_active:   z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function TestimonialForm({ testimonial }: { testimonial?: DbTestimonial }) {
  const router = useRouter();
  const isEdit = !!testimonial;
  const [imageUrl, setImageUrl] = useState<string | null>(testimonial?.image_url ?? null);
  const [saving, setSaving] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      client_name: testimonial?.client_name ?? '',
      company:     testimonial?.company ?? '',
      position:    testimonial?.position ?? '',
      review:      testimonial?.review ?? '',
      rating:      testimonial?.rating ?? 5,
      project:     testimonial?.project ?? '',
      is_featured: testimonial?.is_featured ?? false,
      is_active:   testimonial?.is_active ?? true,
    },
  });

  const currentRating = watch('rating');

  const onSubmit = async (data: FormValues) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        id: testimonial?.id,
        image_url: imageUrl,
      };
      await db.saveTestimonial(payload);
      toast.success(isEdit ? 'Testimonial updated!' : 'Testimonial added!');
      router.push('/admin/testimonials');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/60 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300">Client Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Client Name *</label><input {...register('client_name')} className={inputClass} placeholder="John Smith" />{errors.client_name && <p className="text-red-400 text-xs mt-1">{errors.client_name.message}</p>}</div>
          <div><label className={labelClass}>Company *</label><input {...register('company')} className={inputClass} placeholder="Acme Corp" />{errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}</div>
          <div><label className={labelClass}>Position *</label><input {...register('position')} className={inputClass} placeholder="CEO, CTO…" />{errors.position && <p className="text-red-400 text-xs mt-1">{errors.position.message}</p>}</div>
          <div><label className={labelClass}>Project</label><input {...register('project')} className={inputClass} placeholder="E-Commerce Platform" /></div>
        </div>
        <div>
          <label className={labelClass}>Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setValue('rating', star)} className="transition-transform hover:scale-110">
                <Star size={24} className={(hoverRating || currentRating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'} />
              </button>
            ))}
          </div>
        </div>
        <div><label className={labelClass}>Review *</label><textarea {...register('review')} rows={4} className={inputClass} placeholder="Write the client testimonial…" />{errors.review && <p className="text-red-400 text-xs mt-1">{errors.review.message}</p>}</div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded accent-blue-500" /><span className="text-sm text-slate-300">Active</span></label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded accent-blue-500" /><span className="text-sm text-slate-300">Featured</span></label>
        </div>
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
        <ImageUpload value={imageUrl} onChange={setImageUrl} label="Client Photo (Optional)" />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50">
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? 'Update' : 'Add Testimonial'}
        </button>
        <button type="button" onClick={() => router.push('/admin/testimonials')} className="px-4 py-2.5 text-sm text-slate-500 hover:text-white transition-colors">Cancel</button>
      </div>
    </form>
  );
}
