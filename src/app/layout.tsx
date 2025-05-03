import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Emin Blog',
    default: 'Emin Blog - Blockchain ve Sistem Memarlığı Hakkında',
  },
  description: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji blog yazıları',
  keywords: ['blockchain', 'sistem memarlığı', 'texnologiya', 'blog', 'Emin'],
  authors: [{ name: 'Emin', url: 'https://github.com/eminmammadov' }],
  creator: 'Emin',
  publisher: 'Emin Blog',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Emin Blog - Blockchain ve Sistem Memarlığı Hakkında',
    description: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji blog yazıları',
    url: 'https://example.com',
    siteName: 'Emin Blog',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Emin Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emin Blog - Blockchain ve Sistem Memarlığı Hakkında',
    description: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji blog yazıları',
    creator: '@eminmammadov',
    images: ['/images/og-image.jpg'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased`}
        data-new-gr-c-s-check-loaded="14.1233.0"
        data-gr-ext-installed=""
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
