import type { Metadata } from 'next';
import PortfolioClient from '@/components/portfolio/PortfolioClient';
import ContactCTA from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    "Explore TERVOM's portfolio of 500+ successful projects spanning web development, mobile apps, AI solutions, ERP, CRM, and ecommerce platforms.",
};

export default function PortfolioPage() {
  return (
    <>
      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-blob" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">Our Work</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-6">
            500+ Projects, <span className="gradient-text">Infinite Impact</span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-3xl mx-auto">
            From startups to Fortune 500 companies, we&apos;ve built products that transform businesses.
          </p>
        </div>
      </section>

      <PortfolioClient />
      <ContactCTA />
    </>
  );
}
