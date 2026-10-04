'use client';

import { motion } from 'framer-motion';

const features = [
  { icon: '👨‍💻', title: 'Expert Engineers', description: 'Senior engineers with 8+ years of hands-on experience across diverse technology stacks and global projects.' },
  { icon: '💰', title: 'Transparent Pricing', description: 'Honest, competitive pricing with detailed proposals and zero hidden fees. Maximum value, every time.' },
  { icon: '⚡', title: 'On-Time Delivery', description: 'Agile sprints with weekly milestones ensure rapid, disciplined delivery without compromising on quality.' },
  { icon: '🔒', title: 'Enterprise Security', description: 'Security-first development with OWASP compliance, code audits, and rigorous penetration testing built in.' },
  { icon: '🚀', title: 'Future-Proof Tech', description: 'We build with the latest proven technology stacks so your product scales confidently for years ahead.' },
  { icon: '🎧', title: '24/7 Dedicated Support', description: 'Round-the-clock technical support with guaranteed SLA response times and dedicated account managers.' },
  { icon: '🔄', title: 'Agile & Iterative', description: 'Continuous feedback loops, full transparency, and iterative development keep you in control at every step.' },
  { icon: '💬', title: 'Clear Communication', description: 'Daily updates, weekly reports, and direct access to your project lead — no surprises, ever.' },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="section-padding relative overflow-hidden"
      aria-label="Why choose TERVOM"
    >
      {/* Background */}
      <div className="absolute inset-0 gradient-bg-soft pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left — Text */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3"
            >
              Why TERVOM
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6"
            >
              We Don&apos;t Just Deliver Code — <br />
              <span className="gradient-text">We Engineer Your Success</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[var(--muted)] text-lg leading-relaxed mb-8"
            >
              With 8+ years of proven delivery, TERVOM has perfected a development process that
              consistently produces exceptional results. Our clients don&apos;t just get
              software — they gain a strategic technology partner and a lasting competitive advantage.
            </motion.p>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              {['ISO 27001 Compliant', 'AWS Certified', 'GDPR Ready', 'Trusted by 300+ Clients'].map((badge) => (
                <div key={badge} className="glass-card px-4 py-2 text-xs font-semibold text-[var(--foreground)]">
                  ✓ {badge}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Feature grid: 2-col always */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 card-hover group"
              >
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {f.icon}
                </div>
                <h3 className="font-heading font-semibold text-[var(--foreground)] text-sm mb-1.5">
                  {f.title}
                </h3>
                <p className="text-[var(--muted)] text-xs leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
