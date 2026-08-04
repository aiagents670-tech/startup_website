'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '@/lib/data/testimonials';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const visible = [
    testimonials[(current - 1 + testimonials.length) % testimonials.length],
    testimonials[current],
    testimonials[(current + 1) % testimonials.length],
  ];

  return (
    <section id="testimonials" className="section-padding bg-[var(--surface)]" aria-label="Client testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3"
          >
            Client Love
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4"
          >
            What Our <span className="gradient-text">Clients Say</span>
          </motion.h2>
        </div>

        {/* Slider */}
        <div className="relative">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {visible.map((testimonial, i) => (
              <motion.div
                key={`${testimonial.id}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-6 transition-all duration-300 ${
                  i === 1 ? 'md:scale-105 border-primary-500/30 shadow-xl' : 'md:scale-95 opacity-70'
                }`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, s) => (
                    <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Review */}
                <p className="text-[var(--muted)] text-sm leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.review}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[var(--foreground)]">{testimonial.name}</div>
                    <div className="text-xs text-[var(--muted)]">{testimonial.role} · {testimonial.company}</div>
                  </div>
                </div>

                {/* Project tag */}
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <span className="text-xs text-primary-500 font-medium">📌 {testimonial.project}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              id="testimonial-prev-btn"
              onClick={prev}
              suppressHydrationWarning
              className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-[var(--muted)] hover:text-primary-500 hover:border-primary-500/50 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  suppressHydrationWarning
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 h-2 gradient-bg'
                      : 'w-2 h-2 bg-[var(--border)] hover:bg-primary-500/50'
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              id="testimonial-next-btn"
              onClick={next}
              suppressHydrationWarning
              className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-[var(--muted)] hover:text-primary-500 hover:border-primary-500/50 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
