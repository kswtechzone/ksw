import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { NavbarWrapper } from '@/components/layout/navbar-wrapper';
import { Footer } from '@/components/layout/footer';
import { JsonLd } from '@/components/JsonLd';
import { CursorGlow } from '@/components/ui/cursor-glow';
import { ParticleField } from '@/components/ui/particle-field';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://kswtechzone.com'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  title: {
    default: 'KSW TechZone | Transforming Ideas Into Digital Solutions',
    template: '%s | KSW TechZone',
  },
  description:
    'KSW TechZone is a Nepal-based technology company specializing in custom software development, web applications, mobile apps, SaaS, AI solutions, and digital marketing. We transform ideas into powerful digital solutions.',
  keywords: [
    'KSW TechZone', 'software development', 'web development', 'mobile apps',
    'digital marketing', 'Nepal tech company', 'SaaS', 'AI solutions',
    'cloud solutions', 'Kathmandu software company', 'ERP development',
    'CRM development', 'POS development', 'hospitality solutions',
    'e-commerce solutions', 'UI UX design', 'IT consulting Nepal',
    'custom software Nepal', 'mobile app development Nepal',
    'web development Nepal', 'digital marketing Nepal',
  ],
  authors: [{ name: 'KSW TechZone', url: 'https://kswtechzone.com' }],
  creator: 'KSW TechZone',
  publisher: 'KSW TechZone',
  category: 'technology',
  classification: 'Technology Company',
  referrer: 'origin-when-cross-origin',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kswtechzone.com',
    siteName: 'KSW TechZone',
    title: 'KSW TechZone | Transforming Ideas Into Digital Solutions',
    description:
      'Nepal-based technology company specializing in custom software development, web applications, mobile apps, SaaS, AI, and digital marketing.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'KSW TechZone' }],
    countryName: 'Nepal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KSW TechZone',
    description: 'Transforming Ideas Into Digital Solutions',
    images: ['/og-image.png'],
    site: '@kswtechzone',
    creator: '@kswtechzone',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://kswtechzone.com',
  },
  appleWebApp: {
    capable: true,
    title: 'KSW TechZone',
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <JsonLd />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ParticleField />
          <div className="relative min-h-screen flex flex-col">
            <NavbarWrapper />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CursorGlow />
        </ThemeProvider>
      </body>
    </html>
  );
}
