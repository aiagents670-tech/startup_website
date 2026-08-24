'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { services } from '@/lib/data/services';



export default function Services() {
  return (
    <section id="services" className="section-padding" aria-label="Our services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20"
          >
            <Sparkles size={14} />
            What We Deliver
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-4"
          >
            Comprehensive IT Solutions <span className="gradient-text">That Scale With You</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[var(--muted)] max-w-2xl mx-auto text-lg"
          >
            From concept to deployment, TERVOM delivers end-to-end technology solutions engineered to grow with your business.
            <span className="block mt-1 text-sm text-primary-500 font-medium">Click any service to get a free consultation →</span>
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const contactHref = `/contact?service=${encodeURIComponent(service.title)}`;

            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 80 }}
              >
                <Link
                  href={contactHref}
                  className="group relative flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-[5px] hover:shadow-[0_15px_35px_rgba(59,130,246,0.25)] hover:ring-1 hover:ring-primary-500/40 active:scale-[0.98] active:brightness-125"
                  style={{ textDecoration: 'none' }}
                  aria-label={`Get a quote for ${service.title}`}
                >
                  {/* Animated gradient glowing border */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    style={{ padding: '1.5px' }}
                  />
                  <div className="absolute inset-[1.5px] rounded-2xl bg-[var(--surface)] z-0" />

                  {/* Static border (idle) */}
                  <div className="absolute inset-0 rounded-2xl border border-[var(--border)] group-hover:border-transparent transition-colors duration-300" />

                  {/* Edge light shimmer & click flash ripple overlay */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
                    <div className="absolute -inset-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out" />
                    <div className="absolute inset-0 opacity-0 group-active:opacity-100 bg-white/20 transition-opacity duration-150" />
                  </div>

                  {/* Card content */}
                  <div className="relative z-20 p-6 flex flex-col h-full">
                    {/* Number badge */}
                    <div className="flex items-start justify-between mb-4">
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl ${service.bg} flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
                      >
                        {service.icon}
                      </div>

                      {/* Index badge */}
                      <span
                        className={`text-xs font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent tabular-nums`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-heading font-bold text-[var(--foreground)] text-base mb-2 group-hover:bg-gradient-to-r group-hover:${service.color} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[var(--muted)] text-xs leading-relaxed mb-4 flex-1">
                      {service.description}
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {service.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${service.bg} text-[var(--muted)] border border-[var(--border)] group-hover:border-transparent transition-colors`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA row */}
                    <div
                      className={`flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}
                    >
                      <span>Get a Quote</span>
                      <ArrowRight
                        size={13}
                        className={`group-hover:translate-x-1 transition-transform duration-300 text-primary-500`}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 gradient-bg text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:opacity-90 hover:scale-105 transition-all"
          >
            View All Services
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
