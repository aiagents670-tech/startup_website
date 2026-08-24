'use client';

import { motion } from 'framer-motion';
import { companyStats } from '@/lib/data/team';

const values = [
  { icon: '🎯', title: 'Excellence', description: 'We never settle for "good enough". Every pixel, every line of code is crafted with precision.' },
  { icon: '🤝', title: 'Partnership', description: 'We treat every client relationship as a long-term partnership, not a transaction.' },
  { icon: '💡', title: 'Innovation', description: 'We stay ahead of technology trends to deliver future-proof solutions.' },
  { icon: '🔒', title: 'Integrity', description: 'Transparent communication and honest advice, even when it\'s not what clients want to hear.' },
];

export default function AboutStory() {
  return (
    <>
      {/* Story Section */}
      <section className="section-padding bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-primary-500 mb-3 block">Our Story</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6">
                From Startup to <span className="gradient-text">Global Leader</span>
              </h2>
              <div className="space-y-4 text-[var(--muted)] leading-relaxed">
                <p>TechVision started in 2014 with three engineers in a small San Francisco apartment with a bold vision: to make premium software development accessible to every business, not just Fortune 500 companies.</p>
                <p>Within two years, we had our first 50 clients and a team of 15. By 2018, we launched our dedicated AI division, becoming one of the first boutique agencies to offer enterprise AI solutions.</p>
                <p>Today, we&apos;re a team of 50+ world-class engineers, designers, and strategists, serving 300+ clients across 25 countries. But our core mission remains unchanged — we exist to help businesses grow through technology.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {companyStats.map((stat) => (
                <div key={stat.label} className="glass-card p-5 text-center card-hover">
                  <div className="font-heading text-2xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-[var(--muted)] text-xs">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { label: 'Our Mission', icon: '🎯', text: 'To democratize access to world-class software development, enabling businesses of all sizes to compete in the digital age through innovative, reliable, and scalable technology solutions.' },
              { label: 'Our Vision', icon: '🔭', text: 'To be the most trusted technology partner for growth-focused companies worldwide, recognized for delivering exceptional products that create real business impact.' },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-8"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-heading font-bold text-xl text-[var(--foreground)] mb-3">{item.label}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Core Values */}
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-[var(--foreground)] mb-2">
              Our <span className="gradient-text">Core Values</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center card-hover"
              >
                <div className="text-3xl mb-3">{v.icon}</div>
                <h4 className="font-heading font-bold text-[var(--foreground)] mb-2">{v.title}</h4>
                <p className="text-[var(--muted)] text-sm">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
