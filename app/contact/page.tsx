import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { Mail, Phone, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with TERVOM. Book a free consultation, request a quote, or reach us via email, phone, or WhatsApp. We respond within 24 hours.',
};

const contactInfo = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'hello@tervom.com',
    href: 'mailto:hello@tervom.com',
    color: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+91 74168 58563',
    href: 'tel:+917416858563',
    color: 'bg-green-500/10',
    iconColor: 'text-green-500',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp Chat',
    value: '+91 74168 58563',
    href: 'https://wa.me/917416858563?text=Hello%20TERVOM%2C%20I%20would%20like%20to%20discuss%20a%20project',
    color: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-primary-500 mb-4">
            Get In Touch
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-6">
            Let&apos;s Build Something <span className="gradient-text">Amazing Together</span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            Ready to transform your business? We&apos;d love to hear about your project.
            Get a free consultation and custom quote within 24 hours.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[var(--foreground)] mb-2">
                  Contact <span className="gradient-text">Information</span>
                </h2>
                <p className="text-[var(--muted)] text-sm">
                  Reach out through any channel. We typically respond within 2-4 hours during business hours.
                </p>
              </div>

              {/* Contact Info Cards */}
              {contactInfo.map(({ icon: Icon, label, value, href, color, iconColor }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="glass-card p-5 flex items-start gap-4 card-hover block group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={iconColor} size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-0.5">{label}</div>
                    <div className="font-semibold text-[var(--foreground)] text-sm">{value}</div>
                  </div>
                </a>
              ))}

              {/* Dedicated WhatsApp Quick Chat Banner */}
              <div className="glass-card p-6 bg-gradient-to-br from-emerald-950/40 via-[var(--surface-1)] to-[var(--surface-2)] border border-emerald-500/30 rounded-2xl space-y-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={24} className="text-[#25D366] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[var(--foreground)] flex items-center gap-2">
                      Chat on WhatsApp
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                      </span>
                    </h3>
                    <p className="text-xs text-[var(--muted)]">Instant response • Active now</p>
                  </div>
                </div>

                <p className="text-xs text-[var(--foreground)]/80 leading-relaxed">
                  Prefer real-time chat? Tap below to connect directly with our engineering team on WhatsApp.
                </p>

                <a
                  href="https://wa.me/917416858563?text=Hello%20TERVOM%2C%20I%20would%20like%20to%20discuss%20a%20project"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-whatsapp-direct-btn"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.5)] transition-all active:scale-98"
                >
                  <MessageCircle size={18} />
                  Start WhatsApp Chat Now
                </a>
              </div>

              {/* Social links */}
              <div className="glass-card p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Twitter', href: 'https://twitter.com/tervom', emoji: '🐦' },
                    { name: 'LinkedIn', href: 'https://linkedin.com/company/tervom', emoji: '💼' },
                    { name: 'GitHub', href: 'https://github.com/tervom', emoji: '🐙' },
                    { name: 'YouTube', href: 'https://youtube.com/tervom', emoji: '▶️' },
                    { name: 'Instagram', href: 'https://instagram.com/tervom', emoji: '📷' },
                  ].map(({ name, href, emoji }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card px-3 py-2 text-xs font-medium text-[var(--muted)] hover:text-primary-500 hover:border-primary-500/50 transition-all flex items-center gap-1.5"
                    >
                      <span>{emoji}</span> {name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div id="quote" className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
