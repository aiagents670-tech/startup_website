'use client';

import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center pt-14 sm:pt-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-16 sm:-left-32 w-64 sm:w-96 h-64 sm:h-96 bg-primary-500/15 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-64 sm:w-80 h-64 sm:h-80 bg-secondary-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4"
        >
          About TechVision
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-heading font-bold text-[var(--foreground)] mb-4 sm:mb-6"
          style={{ fontSize: 'clamp(1.75rem, 6vw, 3.75rem)', lineHeight: 1.15 }}
        >
          We&apos;re on a Mission to{' '}
          <span className="gradient-text">Empower Businesses</span>
          {' '}Through Technology
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[var(--muted)] text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed"
        >
          Founded in 2014, TechVision has grown from a 3-person startup to a global team of 50+ 
          passionate engineers, designers, and strategists. We&apos;ve delivered 500+ projects across 25+ countries.
        </motion.p>
      </div>
    </section>
  );
}
