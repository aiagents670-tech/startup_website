import type { Metadata } from 'next';
import BlogClient from '@/components/blog/BlogClient';
import ContactCTA from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'TERVOM blog — insights on web development, AI, cloud computing, mobile apps, SEO, and digital transformation for businesses.',
};

export default function BlogPage() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
            Insights
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-6">
            Tech Insights & <span className="gradient-text">Expert Guides</span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-3xl mx-auto">
            Stay ahead with the latest insights on web development, AI, cloud, and digital business strategy.
          </p>
        </div>
      </section>

      <BlogClient />
      <ContactCTA />
    </>
  );
}
