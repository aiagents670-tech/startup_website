import type { Metadata } from 'next';
import { services } from '@/lib/data/services';
import ServicesGrid from '@/components/services/ServicesGrid';
import ContactCTA from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'IT Services',
  description:
    "Explore TERVOM's full range of IT services: Web Development, Mobile Apps, AI Solutions, Cloud Computing, UI/UX Design, SEO, Digital Marketing, and more.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
            Our Services
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-6">
            Technology Solutions That <span className="gradient-text">Drive Results</span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-3xl mx-auto">
            From web development to AI — we provide end-to-end technology services tailored to your business needs.
          </p>
        </div>
      </section>

      <ServicesGrid services={services} />
      <ContactCTA />
    </>
  );
}
