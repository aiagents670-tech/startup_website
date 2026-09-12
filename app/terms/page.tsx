import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'TERVOM Terms of Service — the terms governing use of our website and services.',
};

const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing and using TERVOM\'s website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.' },
  { title: 'Services', content: 'TERVOM provides IT services including web development, mobile application development, AI solutions, cloud services, and digital marketing. The specific terms of any project will be outlined in a separate Statement of Work (SOW) or Service Agreement.' },
  { title: 'Intellectual Property', content: 'Upon full payment, clients receive ownership of all custom-developed code and assets. TERVOM retains rights to frameworks, libraries, and reusable components developed independently. Portfolio rights are retained unless explicitly agreed otherwise.' },
  { title: 'Payment Terms', content: 'Payment terms are specified in individual project agreements. Typically, projects require a 30-50% upfront payment, with the remainder due upon project milestones or completion. Late payments may incur interest charges.' },
  { title: 'Confidentiality', content: 'Both parties agree to maintain confidentiality of proprietary information shared during the engagement. TERVOM will not disclose client information to third parties without written consent, except as required by law.' },
  { title: 'Limitation of Liability', content: "TERVOM's liability is limited to the amount paid for the specific service giving rise to the claim. We are not liable for indirect, incidental, or consequential damages arising from use of our services." },
  { title: 'Governing Law', content: 'These terms are governed by the laws of India. Any disputes shall be resolved through binding arbitration in Hyderabad, Telangana, India.' },
];

export default function TermsPage() {
  return (
    <>
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-[var(--muted)] mb-8">
            <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">Terms of Service</span>
          </nav>
          <h1 className="font-heading text-4xl font-bold text-[var(--foreground)] mb-4">Terms of Service</h1>
          <p className="text-[var(--muted)]">Last updated: January 1, 2025</p>
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="glass-card p-8">
              <h2 className="font-heading font-bold text-xl text-[var(--foreground)] mb-3">{s.title}</h2>
              <p className="text-[var(--muted)] leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
