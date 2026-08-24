'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, MessageCircle } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section
      id="contact-cta"
      className="section-padding relative overflow-hidden"
      aria-label="Contact call to action"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 sm:p-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 gradient-bg-soft border border-primary-500/20 px-4 py-2 rounded-full mb-6"
          >
            <span className="text-primary-500 text-sm font-semibold">✨ Limited Slots Available — Book Your Consultation</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-6"
          >
            Ready to Engineer Your{' '}
            <span className="gradient-text">Digital Future?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] text-lg max-w-2xl mx-auto mb-10"
          >
            Join 300+ successful companies that trusted TERVOM to engineer their digital success.
            Let&apos;s discuss your project and build something extraordinary together.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            <Link
              href="/contact#booking"
              id="cta-book-consultation-btn"
              className="inline-flex items-center gap-2 gradient-bg text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:opacity-90 hover:scale-105 transition-all duration-200"
            >
              <Calendar size={18} />
              Schedule Free Consultation
            </Link>
            <Link
              href="/contact#quote"
              id="cta-get-quote-btn"
              className="inline-flex items-center gap-2 glass-card text-[var(--foreground)] font-semibold px-8 py-4 rounded-2xl hover:border-primary-500/50 hover:scale-105 transition-all duration-200"
            >
              <MessageCircle size={18} />
              Get a Quote
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 text-[var(--muted)] text-sm"
          >
            {[
              '✅ Free Discovery Call',
              '✅ No Commitment Required',
              '✅ Response Within 24h',
              '✅ 100% Confidential',
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
