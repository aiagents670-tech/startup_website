'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Send,
  CheckCircle,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Terminal,
  Zap,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
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
  const [n8nResponse, setN8nResponse] = useState<any | null>(null);
  const [submittedPayload, setSubmittedPayload] = useState<FormData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPayload, setShowPayload] = useState(false);

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
    setN8nResponse(null);
    setSubmittedPayload(data);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setN8nResponse(result.n8nResponse || null);
        setSubmitted(true);
        reset();
      } else {
        setSubmitError(result.message || 'Failed to submit form. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting contact message:', err);
      setSubmitError('An unexpected error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!n8nResponse) return;
    const textToCopy =
      typeof n8nResponse.body === 'object'
        ? JSON.stringify(n8nResponse.body, null, 2)
        : String(n8nResponse.body || JSON.stringify(n8nResponse, null, 2));

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    const isSuccessStatus = n8nResponse?.ok || (n8nResponse?.status >= 200 && n8nResponse?.status < 300);
    const statusText = n8nResponse?.status
      ? `${n8nResponse.status} ${n8nResponse.statusText || (isSuccessStatus ? 'OK' : '')}`
      : 'Processed';

    const responseContentString =
      typeof n8nResponse?.body === 'object'
        ? JSON.stringify(n8nResponse.body, null, 2)
        : n8nResponse?.body
        ? String(n8nResponse.body)
        : isSuccessStatus
        ? '{"message": "Workflow executed successfully", "status": "success"}'
        : '{"message": "No body returned from n8n test webhook"}';

    return (
      <div className="glass-card p-6 sm:p-8 space-y-6 animate-fade-in">
        {/* Success Header */}
        <div className="text-center pb-4 border-b border-[var(--border)]">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 border border-green-500/20">
            <CheckCircle size={36} className="text-green-500 animate-pulse" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-[var(--foreground)] mb-2">
            Inquiry Sent & n8n Workflow Triggered! 🎉
          </h3>
          <p className="text-[var(--muted)] text-sm max-w-md mx-auto">
            Your inquiry was submitted and forwarded to the n8n webhook workflow. Below is the direct response received from n8n.
          </p>
        </div>

        {/* Webhook Execution Meta Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                isSuccessStatus
                  ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSuccessStatus ? 'bg-green-400 animate-ping' : 'bg-amber-400'}`} />
              n8n Status: {statusText}
            </span>
            {n8nResponse?.responseTimeMs > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20 flex items-center gap-1">
                <Zap size={12} />
                {n8nResponse.responseTimeMs} ms
              </span>
            )}
          </div>
          <a
            href={n8nResponse?.webhookUrl || 'https://hemu123.app.n8n.cloud/webhook/tervom-inquiry'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--muted)] hover:text-primary-400 transition-colors flex items-center gap-1 truncate max-w-[220px] sm:max-w-xs"
            title={n8nResponse?.webhookUrl || 'https://hemu123.app.n8n.cloud/webhook/tervom-inquiry'}
          >
            <ExternalLink size={12} className="flex-shrink-0" />
            <span className="truncate">Webhook Endpoint</span>
          </a>
        </div>

        {/* n8n Response Output Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
              <Terminal size={14} className="text-primary-400" />
              n8n Workflow Response Payload
            </label>
            <button
              onClick={handleCopyResponse}
              className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto max-h-60 border border-slate-800 leading-relaxed shadow-inner select-all">
            <code>{responseContentString}</code>
          </pre>
        </div>

        {/* n8n Webhook Status Banner (Shown if webhook returned non-200) */}
        {(!isSuccessStatus || n8nResponse?.status === 404) && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-200">n8n Production Webhook Status:</p>
              <p className="leading-relaxed">
                Ensure your n8n workflow is toggled to <strong>Active</strong> in your n8n dashboard so production webhooks (<code className="px-1 py-0.5 bg-amber-500/20 rounded font-mono text-[11px]">/webhook/tervom-inquiry</code>) listen and execute automatically 24/7!
              </p>
            </div>
          </div>
        )}

        {/* Collapsible Form Payload Preview */}
        {submittedPayload && (
          <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface-2)]/50">
            <button
              onClick={() => setShowPayload(!showPayload)}
              className="w-full px-4 py-3 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] flex items-center justify-between transition-colors uppercase tracking-wider"
            >
              <span>Submitted Data Payload</span>
              {showPayload ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showPayload && (
              <div className="p-4 pt-0 space-y-2 border-t border-[var(--border)] text-xs text-[var(--foreground)] font-mono">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--border)]/50">
                  <span className="text-[var(--muted)] font-sans">Name:</span>
                  <span className="col-span-2">{submittedPayload.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--border)]/50">
                  <span className="text-[var(--muted)] font-sans">Email:</span>
                  <span className="col-span-2 truncate">{submittedPayload.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--border)]/50">
                  <span className="text-[var(--muted)] font-sans">Service:</span>
                  <span className="col-span-2">{submittedPayload.service}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--border)]/50">
                  <span className="text-[var(--muted)] font-sans">Business:</span>
                  <span className="col-span-2">{submittedPayload.businessType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-[var(--border)]/50">
                  <span className="text-[var(--muted)] font-sans">Budget:</span>
                  <span className="col-span-2">{submittedPayload.budget}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="text-[var(--muted)] font-sans">Message:</span>
                  <span className="col-span-2 whitespace-pre-wrap font-sans">{submittedPayload.message}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              setSubmitted(false);
              setN8nResponse(null);
              setSubmittedPayload(null);
            }}
            className="w-full gradient-bg text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm shadow-md active:scale-98"
          >
            <RefreshCw size={16} />
            Send Another Inquiry
          </button>
        </div>
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
