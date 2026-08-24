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
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      aria-label="Hero section"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-primary-400/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(10,82,204,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(10,82,204,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-[var(--muted)]">
                🚀 Trusted by 300+ global clients across 20+ countries
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
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
              className="text-lg text-[var(--muted)] leading-relaxed mb-8 max-w-xl"
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
              className="flex flex-wrap gap-4 mb-8"
            >
              {[
                { icon: Shield, text: 'Secure & Scalable' },
                { icon: Zap, text: 'Fast Delivery' },
                { icon: Globe, text: 'Global Standards' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
                  <Icon size={14} className="text-primary-500" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto"
            >
              <a
                href="https://wa.me/917416858563"
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-bg text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:opacity-90 hover:scale-105 transition-all duration-200 min-h-[48px]"
              >
                💬 Chat on WhatsApp
              </a>
              <Link
                href="/services"
                id="hero-view-services-btn"
                className="relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center gap-2 gradient-bg text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-[0_0_25px_rgba(10,82,204,0.45)] ring-2 ring-transparent hover:ring-primary-300/50 border border-white/20 hover:border-white/60 transition-all duration-300 group min-h-[48px]"
              >
                {/* Light shimmer sweep animation */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                
                {/* Glowing border background aura */}
                <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-500 via-primary-400 to-accent-400 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300 pointer-events-none" />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore Services
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="text-2xl font-heading font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Main card */}
            <div className="relative">
              <div className="animate-float">
                <div className="glass-card p-2 relative rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl">
                  <Image
                    src="/hero-workspace.png"
                    alt="TERVOM — Engineering Digital Solutions"
                    width={800}
                    height={550}
                    priority
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-6 -right-6 glass-card px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">Project Delivered</div>
                  <div className="text-xs text-[var(--muted)]">On time & on budget</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                className="absolute -bottom-6 -left-6 glass-card px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <span className="text-xl">⭐</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">5-Star Rated</div>
                  <div className="text-xs text-[var(--muted)]">300+ client reviews</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute top-1/2 -right-16 transform -translate-y-1/2 glass-card px-4 py-3"
              >
                <div className="text-xs font-semibold text-[var(--foreground)] mb-1">Tech Stack</div>
                <div className="flex gap-1.5">
                  {['⚛️', '🐍', '☁️', '🤖'].map((emoji, i) => (
                    <div key={i} className="w-7 h-7 rounded-lg bg-[var(--surface-2)] flex items-center justify-center text-sm">
                      {emoji}
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--muted)]"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown size={20} className="animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
