'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Projects Delivered' },
  { value: '300+', label: 'Happy Clients' },
  { value: '8+', label: 'Years Experience' },
  { value: '99%', label: 'Client Satisfaction' },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-14 sm:pt-16 lg:pt-20"
      aria-label="Hero section"
    >
      {/* Animated background blobs — reduced size on mobile to avoid performance issues */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-16 sm:-left-32 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-16 sm:-right-32 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-primary-400/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-accent-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(10,82,204,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(10,82,204,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left — Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass-card px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 text-xs sm:text-sm"
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="font-medium text-[var(--muted)] leading-snug">
                🚀 Trusted by 300+ global clients across 20+ countries
              </span>
            </motion.div>

            {/* Headline — clamp-based font size for smooth scaling */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-bold leading-tight mb-4 sm:mb-6"
              style={{ fontSize: 'clamp(2rem, 6.5vw, 3.75rem)', lineHeight: 1.12 }}
            >
              Engineering Your{' '}
              <span className="gradient-text">Digital Success</span>{' '}
              — From Vision{' '}
              <span className="gradient-text">to Reality</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-5 sm:mb-8 max-w-xl"
            >
              TERVOM is a premium IT services company helping startups and enterprises build
              world-class web apps, mobile apps, and AI solutions. We don&apos;t just write code —
              we engineer competitive advantages that grow your business.
            </motion.p>

            {/* Trust pillars */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-5 sm:mb-8"
            >
              {[
                { icon: Shield, text: 'Secure & Scalable' },
                { icon: Zap, text: 'Fast Delivery' },
                { icon: Globe, text: 'Global Standards' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
                  <Icon size={14} className="text-primary-500 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons — full-width on mobile, auto on sm+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 w-full"
            >
              <a
                href="https://wa.me/917416858563"
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-bg text-white font-bold px-6 sm:px-8 py-4 rounded-2xl shadow-xl hover:opacity-90 hover:scale-[1.02] transition-all duration-200 min-h-[52px] text-base"
              >
                💬 Chat on WhatsApp
              </a>
              <Link
                href="/services"
                id="hero-view-services-btn"
                className="relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-bg text-white font-bold px-6 sm:px-8 py-4 rounded-2xl shadow-xl hover:shadow-[0_0_25px_rgba(10,82,204,0.45)] ring-2 ring-transparent hover:ring-primary-300/50 border border-white/20 hover:border-white/60 transition-all duration-300 group min-h-[52px] text-base"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-400 to-accent-400 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300 pointer-events-none" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore Services
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>

            {/* Stats — 2×2 on mobile, 4×1 on sm+ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card p-3 sm:p-0 sm:bg-transparent sm:border-0 sm:shadow-none text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-heading font-bold gradient-text">{stat.value}</div>
                  <div className="text-[11px] sm:text-xs text-[var(--muted)] mt-0.5 leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Illustration (hidden below lg, shown as below text on md) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-6 lg:mt-0 max-w-sm sm:max-w-xl lg:max-w-none mx-auto lg:mx-0"
          >
            {/* Ambient Background Glow Halo */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-purple-600/30 rounded-3xl blur-2xl animate-pulse pointer-events-none" />

            {/* Main Animated Card Container */}
            <div className="relative group">
              <div className="animate-float">
                <div className="glass-card p-2 sm:p-2.5 relative rounded-3xl overflow-hidden border border-primary-500/30 shadow-[0_20px_60px_rgba(10,82,204,0.3)] transition-all duration-500 group-hover:border-cyan-400/60 group-hover:shadow-[0_25px_75px_rgba(34,211,238,0.35)]">
                  {/* Glowing Sweep Sheen Animation Overlay */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                    <div className="absolute -inset-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out" />
                  </div>

                  <Image
                    src="/hero-workspace.png"
                    alt="TERVOM — Engineering Digital Solutions & Cloud Architecture"
                    width={900}
                    height={600}
                    priority
                    className="w-full h-auto rounded-2xl object-cover transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Floating Badge 1 — Cloud Architecture (Top Right) */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -top-4 sm:-top-5 -right-3 sm:-right-5 glass-card px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border border-cyan-500/40 shadow-[0_10px_30px_rgba(34,211,238,0.2)] bg-[#091326]/90 backdrop-blur-md z-30"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl animate-pulse">☁️</span>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-white flex items-center gap-1.5">
                    Cloud Native & AI
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                  <div className="text-[10px] text-cyan-300 font-medium">99.99% Uptime</div>
                </div>
              </motion.div>

              {/* Floating Badge 2 — Enterprise Security (Bottom Left) */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="absolute -bottom-4 sm:-bottom-5 -left-3 sm:-left-5 glass-card px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border border-indigo-500/40 shadow-[0_10px_30px_rgba(99,102,241,0.2)] bg-[#091326]/90 backdrop-blur-md z-30"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl">🛡️</span>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold text-white">Enterprise Security</div>
                  <div className="text-[10px] text-indigo-300 font-medium">End-to-End Encrypted</div>
                </div>
              </motion.div>

              {/* Floating Badge 3 — hidden on mobile to avoid overflow */}
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1.1 }}
                className="hidden sm:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2 glass-card px-3 sm:px-4 py-2 sm:py-3 border border-purple-500/40 bg-[#091326]/90 backdrop-blur-md shadow-lg z-30"
              >
                <div className="text-[10px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  Engineered Stack
                </div>
                <div className="flex gap-1.5">
                  {[
                    { label: 'React / Next.js', emoji: '⚛️' },
                    { label: 'Python / AI', emoji: '🐍' },
                    { label: 'Cloud Architecture', emoji: '☁️' },
                    { label: 'High-speed DB', emoji: '💾' },
                  ].map((tech, i) => (
                    <div
                      key={i}
                      title={tech.label}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm hover:scale-110 hover:border-purple-400/50 transition-all cursor-pointer"
                    >
                      {tech.emoji}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[var(--muted)]"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown size={20} className="animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
