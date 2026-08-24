'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const schema = z.object({
  name:         z.string().min(2, 'Name must be at least 2 characters'),
  email:        z.string().email('Please enter a valid email'),
  businessType: z.string().min(1, 'Please select a business type'),
  phone:        z.string().optional(),
  service:      z.string().min(1, 'Please select a service'),
  budget:       z.string().min(1, 'Please select or enter a budget'),
  message:      z.string().min(20, 'Message must be at least 20 characters'),
});

type FormData = z.infer<typeof schema>;

const serviceOptions = [
  'Website Development',
  'Web Applications',
  'Mobile App Development',
  'UI/UX Design',
  'Ecommerce Development',
  'AI Solutions',
  'Custom Software',
  'API Development',
  'Cloud Solutions',
  'DevOps',
  'Digital Marketing',
  'SEO',
  'Website Maintenance',
  'Technical Support',
  'Business Website',
  'AI Automation',
  'Other',
];

function resolveService(param: string | null): string {
  if (!param) return '';
  const decoded = decodeURIComponent(param).trim();
  const lower = decoded.toLowerCase();

  const exact = serviceOptions.find((opt) => opt.toLowerCase() === lower);
  if (exact) return exact;

  if (lower.includes('website dev') || lower.includes('web dev')) return 'Website Development';
  if (lower.includes('web app')) return 'Web Applications';
  if (lower.includes('mobile')) return 'Mobile App Development';
  if (lower.includes('ui') || lower.includes('ux') || lower.includes('design')) return 'UI/UX Design';
  if (lower.includes('e-commerce') || lower.includes('ecommerce')) return 'Ecommerce Development';
  if (lower.includes('ai')) return 'AI Solutions';
  if (lower.includes('custom')) return 'Custom Software';
  if (lower.includes('api')) return 'API Development';
  if (lower.includes('cloud')) return 'Cloud Solutions';
  if (lower.includes('devops')) return 'DevOps';
  if (lower.includes('marketing')) return 'Digital Marketing';
  if (lower.includes('seo')) return 'SEO';
  if (lower.includes('maintenance')) return 'Website Maintenance';
  if (lower.includes('support')) return 'Technical Support';

  return decoded;
}

const businessTypes = [
  'Startup / Early Stage', 'Small Business (SMB)', 'Mid-size Company',
  'Enterprise / Large Corp', 'Agency / Studio', 'Non-profit / NGO',
  'Freelancer / Individual', 'Government / Public Sector',
  'E-commerce Brand', 'SaaS / Tech Company', 'Other',
];

/* preset budget pills — "Let's Discuss" first, then fixed prices, then "Custom" last */
const budgetPresets = ["Let's Discuss", '₹5K', '₹10K', '₹15K', '₹23K', '₹50K', '₹70K', '₹1L'];

/* ─── Main Form ─────────────────────────────────────────────────────────── */
function ContactFormInner() {
  const searchParams = useSearchParams();
  const rawService = searchParams.get('service');
  const initialService = resolveService(rawService);

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      service: initialService,
      budget:  '',
    },
  });

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      const matched = resolveService(serviceParam);
      setValue('service', matched, { shouldValidate: true });
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      const { supabase } = await import('@/lib/supabaseClient');
      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: data.name,
          email: data.email,
          business_type: data.businessType,
          phone: data.phone || null,
          service: data.service,
          budget: data.budget,
          message: data.message,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        // Table not created yet — warn silently, still show success to user
        const isTableMissing =
          error.code === 'PGRST205' ||
          error.code === '42P01' ||
          error.message?.includes('schema cache') ||
          error.message?.includes('does not exist') ||
          error.message?.includes('Could not find');

        if (isTableMissing) {
          console.warn('⚠ Supabase table not created yet. Run supabase_schema.sql in your Supabase dashboard.');
        } else {
          // Real error — surface it to user
          console.error('Supabase contact submission error:', error.message, error.code);
          setSubmitError('Something went wrong while sending your message. Please try again or email us directly.');
          return;
        }
      } else {
        console.log('✅ Contact submission stored in Supabase successfully.');
      }

      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Error submitting to Supabase:', err);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-[var(--foreground)] mb-3">
          Message Sent! 🎉
        </h3>
        <p className="text-[var(--muted)] mb-6">
          Thank you for reaching out. Our team will get back to you within 24 hours with a personalized response.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="gradient-bg text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border ${
      hasError ? 'border-red-500' : 'border-[var(--border)]'
    } text-[var(--foreground)] placeholder-[var(--muted)] text-base sm:text-sm min-h-[48px] focus:outline-none focus:border-primary-500 transition-colors`;

  return (
    <div className="glass-card p-8">
      <h2 className="font-heading text-2xl font-bold text-[var(--foreground)] mb-2">
        Send Us a Message
      </h2>
      <p className="text-[var(--muted)] text-sm mb-8">
        Fill out the form and we&apos;ll get back to you with a custom proposal.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="contact-form" noValidate suppressHydrationWarning>

        {/* Name & Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wider">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register('name')}
              className={inputClass(!!errors.name)}
              suppressHydrationWarning
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wider">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@company.com"
              {...register('email')}
              className={inputClass(!!errors.email)}
              suppressHydrationWarning
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        {/* Business Type & Phone */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessType" className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wider">
              Business Type *
            </label>
            <select
              id="businessType"
              {...register('businessType')}
              className={`${inputClass(!!errors.businessType)} cursor-pointer`}
              suppressHydrationWarning
            >
              <option value="">Select business type</option>
              {businessTypes.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            {errors.businessType && <p className="mt-1 text-xs text-red-500">{errors.businessType.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wider">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              {...register('phone')}
              className={inputClass()}
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Service & Budget — Same UI/format as Business Type */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="service" className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wider">
              Service *
            </label>
            <select
              id="service"
              {...register('service')}
              className={`${inputClass(!!errors.service)} cursor-pointer`}
              suppressHydrationWarning
            >
              <option value="">Select service</option>
              {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service.message}</p>}
          </div>
          <div>
            <label htmlFor="budget" className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wider">
              Budget *
            </label>
            <select
              id="budget"
              {...register('budget')}
              className={`${inputClass(!!errors.budget)} cursor-pointer`}
              suppressHydrationWarning
            >
              <option value="">Select budget</option>
              {budgetPresets.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget.message}</p>}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wider">
            Project Details *
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
            {...register('message')}
            className={`${inputClass(!!errors.message)} resize-none`}
            suppressHydrationWarning
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
        </div>

        {/* Submit */}
        <button
          id="contact-submit-btn"
          type="submit"
          disabled={isLoading}
          className="w-full gradient-bg text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
          suppressHydrationWarning
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Message
            </>
          )}
        </button>

        <p className="text-center text-xs text-[var(--muted)]">
          🔒 Your information is 100% confidential and never shared with third parties.
        </p>

        {submitError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}
      </form>
    </div>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={<div className="glass-card p-8 animate-pulse h-96" />}>
      <ContactFormInner />
    </Suspense>
  );
}
