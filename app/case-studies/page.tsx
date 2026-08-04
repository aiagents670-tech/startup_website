import type { Metadata } from 'next';
import { caseStudies } from '@/lib/data/testimonials';

import ContactCTA from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Deep-dive case studies showing how TechVision solved complex business challenges with technology. Real results, real impact.',
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-blob" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
            Case Studies
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-6">
            Real Problems, <span className="gradient-text">Real Solutions</span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-3xl mx-auto">
            In-depth stories of how we transformed businesses through technology.
          </p>
        </div>
      </section>

      <section className="section-padding bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {caseStudies.map((study, i) => (
              <div key={study.id} className="glass-card overflow-hidden">
                <div className={`grid lg:grid-cols-2 gap-0 ${i % 2 !== 0 ? 'lg:[direction:rtl]' : ''}`}>
                  {/* Visual */}
                  <div className="h-64 lg:h-auto bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 flex items-center justify-center lg:[direction:ltr]">
                    <span className="text-8xl opacity-40">🏆</span>
                  </div>
                  {/* Content */}
                  <div className="p-8 lg:[direction:ltr]">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="gradient-bg text-white px-3 py-1 rounded-full text-xs font-bold">
                        {study.industry}
                      </span>
                      <span className="glass-card px-3 py-1 text-xs font-medium text-[var(--muted)]">
                        {study.duration}
                      </span>
                      <span className="glass-card px-3 py-1 text-xs font-medium text-[var(--muted)]">
                        Team of {study.team}
                      </span>
                    </div>

                    <h2 className="font-heading text-2xl font-bold text-[var(--foreground)] mb-3">
                      {study.title}
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">Challenge</h3>
                        <p className="text-[var(--muted)] text-sm">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">Solution</h3>
                        <p className="text-[var(--muted)] text-sm">{study.solution}</p>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {study.results.map((r) => (
                        <div key={r} className="gradient-bg-soft border border-primary-500/20 rounded-xl p-3 text-center">
                          <span className="text-[var(--foreground)] font-semibold text-xs">{r}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {study.technologies.map((t) => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-500 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <blockquote className="border-l-2 border-primary-500 pl-4 text-[var(--muted)] italic text-sm">
                      &ldquo;{study.testimonial.text}&rdquo;
                      <cite className="block mt-1 text-primary-500 not-italic font-semibold text-xs">
                        — {study.testimonial.author}
                      </cite>
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
