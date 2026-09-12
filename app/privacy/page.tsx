import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'TERVOM Privacy Policy — how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, including your name, email address, phone number, and project details when you contact us or use our services. We also collect usage data automatically when you visit our website, including IP address, browser type, pages visited, and time spent on pages.',
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services; respond to your inquiries and fulfill your requests; send you technical notices and support messages; communicate with you about products, services, offers, and events; and monitor and analyze trends and usage.',
    },
    {
      title: 'Information Sharing',
      content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.',
    },
    {
      title: 'Data Security',
      content: 'We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. We use industry-standard encryption and security protocols.',
    },
    {
      title: 'Cookies',
      content: 'We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, please contact us at privacy@tervom.com.',
    },
    {
      title: 'Contact Us',
      content: 'If you have questions about this Privacy Policy, please contact us at: privacy@tervom.com.',
    },
  ];

  return (
    <>
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-[var(--muted)] mb-8">
            <Link href="/" className="hover:text-primary-500 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">Privacy Policy</span>
          </nav>
          <h1 className="font-heading text-4xl font-bold text-[var(--foreground)] mb-4">Privacy Policy</h1>
          <p className="text-[var(--muted)]">Last updated: January 1, 2025</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="glass-card p-8">
              <h2 className="font-heading font-bold text-xl text-[var(--foreground)] mb-3">{section.title}</h2>
              <p className="text-[var(--muted)] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
