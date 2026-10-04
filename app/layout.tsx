import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AppShell from "@/components/layout/AppShell";

import Script from "next/script";
import { Toaster } from 'react-hot-toast';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0a52cc',
  viewportFit: 'cover',
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tervom.com"),
  title: {
    default: "TERVOM — Engineering Digital Success | Premium IT Services & Software Development",
    template: "%s | TERVOM",
  },
  description:
    "TERVOM is a premium IT services company delivering world-class web development, mobile apps, AI solutions, cloud computing, and digital marketing. Engineering Digital Success for startups and enterprises worldwide.",
  keywords: [
    "TERVOM",
    "IT services",
    "web development",
    "mobile app development",
    "AI solutions",
    "cloud computing",
    "digital marketing",
    "custom software",
    "SEO",
    "UI/UX design",
    "DevOps",
    "software development company",
    "engineering digital success",
  ],
  authors: [{ name: "TERVOM Team" }],
  creator: "TERVOM",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tervom.com",
    siteName: "TERVOM",
    title: "TERVOM — Engineering Digital Success | Premium IT Services",
    description:
      "Engineering Digital Success. Web, Mobile, AI, Cloud & more — delivered by a world-class team.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TERVOM — Engineering Digital Success",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TERVOM — Engineering Digital Success",
    description: "Premium IT services that transform your business. Code. Innovate. Elevate.",
    creator: "@tervom",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable}`}
    >
      <head>
        <link rel="canonical" href="https://tervom.com" />
        <meta name="theme-color" content="#0a52cc" />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "TERVOM",
              url: "https://tervom.com",
              logo: "https://tervom.com/tervom-logo.png",
              description: "Engineering Digital Success — Premium IT Services & Software Development",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-74168-58563",
                contactType: "customer service",
                availableLanguage: ["English", "Hindi"],
              },
              sameAs: [
                "https://twitter.com/tervom",
                "https://linkedin.com/company/tervom",
                "https://github.com/tervom",
                "https://instagram.com/tervom",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Toaster position="top-right" toastOptions={{ style: { background: '#0d1526', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '14px' }, success: { iconTheme: { primary: '#22d3ee', secondary: '#0d1526' } }, error: { iconTheme: { primary: '#f87171', secondary: '#0d1526' } } }} />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
