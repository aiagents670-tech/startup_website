'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="w-full md:w-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
        noValidate
        suppressHydrationWarning
      >
        <div className="relative flex-1 sm:w-72 md:w-72">
          <input
            id="newsletter-email-input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error' || status === 'success') {
                setStatus('idle');
                setMessage('');
              }
            }}
            placeholder="Enter your email"
            disabled={status === 'loading'}
            suppressHydrationWarning
            className={`w-full px-4 py-3 rounded-xl bg-[var(--surface-2)] border ${
              status === 'error'
                ? 'border-red-500/80 focus:border-red-500'
                : status === 'success'
                ? 'border-green-500/80 focus:border-green-500'
                : 'border-[var(--border)] focus:border-primary-500'
            } text-[var(--foreground)] placeholder-[var(--muted)] text-base sm:text-sm min-h-[48px] focus:outline-none transition-colors duration-200 disabled:opacity-60`}
          />
        </div>
        <button
          id="newsletter-subscribe-btn"
          type="submit"
          disabled={status === 'loading'}
          suppressHydrationWarning
          className="relative overflow-hidden gradient-bg text-white px-6 py-3 rounded-xl text-base sm:text-sm font-semibold min-h-[48px] hover:opacity-90 active:scale-95 transition-all duration-200 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Subscribing...
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      {/* Feedback Messages */}
      {message && (
        <div
          className={`mt-2 text-xs flex items-center gap-1.5 transition-all duration-300 ${
            status === 'success' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle2 size={14} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={14} className="flex-shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
