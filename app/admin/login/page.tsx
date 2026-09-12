'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Shield,
  BarChart3,
  Users,
  Zap,
  CheckCircle2,
  Sun,
  Moon,
  AlertCircle,
} from 'lucide-react';

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your admin password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password. Please verify your credentials.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('tervom_admin_user', JSON.stringify({ email, loginAt: new Date().toISOString() }));
      }

      setSuccess(true);

      setTimeout(() => {
        router.push(nextPath);
        router.refresh();
      }, 600);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify your details.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      {/* Dynamic Background Lights & Tech Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0a_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="w-full max-w-6xl relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand & Technology Security Showcase */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-6 space-y-8 hidden lg:block pr-6"
        >
          {/* Logo & Company Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-0.5 shadow-[0_0_25px_rgba(59,130,246,0.4)] flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-[#091122] flex items-center justify-center overflow-hidden relative">
                <Image
                  src="/tervom-logo-dark.png"
                  alt="Tervom Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <span className="font-heading text-2xl font-bold tracking-wider text-white flex items-center gap-1.5">
                TERVOM
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400 block -mt-1">
                Technology Solutions
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="font-heading text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Welcome to <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Tervom Admin
              </span>
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed max-w-md">
              Secure access to your admin dashboard. Manage, monitor, and grow your business with confidence.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-4 pt-2">
            {[
              {
                icon: Shield,
                title: 'Secure & Protected',
                desc: 'Enterprise-grade security to keep your data safe and protected.',
                color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
              },
              {
                icon: BarChart3,
                title: 'Powerful Dashboard',
                desc: 'Real-time insights and analytics at your fingertips.',
                color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
              },
              {
                icon: Users,
                title: 'Role Based Access',
                desc: 'Granular permissions and role-based access control.',
                color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
              },
              {
                icon: Zap,
                title: 'Fast & Reliable',
                desc: 'Optimized performance for smooth administration.',
                color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-sm text-white">{title}</h2>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Security Footer Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/20 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Trusted & Secure</div>
              <div className="text-[11px] text-slate-400">
                Your data is encrypted and protected with industry best practices.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          <div className="relative rounded-3xl border border-white/10 bg-[#0d1627]/80 backdrop-blur-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Top Bar with Theme Toggle */}
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                ← Back to Site
              </Link>
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}
            </div>

            {/* Header / Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-0.5 mx-auto mb-4 shadow-xl shadow-blue-500/20 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-[#0d1627] flex items-center justify-center relative overflow-hidden">
                  <Image
                    src="/tervom-logo-dark.png"
                    alt="Tervom Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-1">
                Tervom Technology Solutions
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Sign in to your Tervom admin account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5" noValidate suppressHydrationWarning>
              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all"
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    suppressHydrationWarning
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/5 border-white/20 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600"
                    suppressHydrationWarning
                  />
                  <span>Remember Me</span>
                </label>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5"
                  >
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm sm:text-base shadow-[0_4px_20px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_28px_rgba(59,130,246,0.5)] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                suppressHydrationWarning
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 size={18} className="text-green-400" />
                    Access Granted! Redirecting...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative inline-block px-3 bg-[#0d1627] text-[11px] text-slate-500 uppercase tracking-widest">
                Protected Route
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-slate-400">
              <ShieldCheck size={18} className="text-blue-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-300 block">Secure Admin Access</span>
                Unauthorized access attempts are monitored and logged.
              </div>
            </div>

            {/* Footer Copyright */}
            <div className="text-center text-[11px] text-slate-500 mt-6">
              © {new Date().getFullYear()} Tervom Technology Solutions Pvt. Ltd. All rights reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060b14] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
      </div>
    }>
      <AdminLoginInner />
    </Suspense>
  );
}
