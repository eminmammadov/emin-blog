import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import UpcomingPopUp from "@/components/UpcomingPopUp";
import { Suspense } from "react";

// Layout için statik metinler
const LAYOUT_TEXTS = {
  LOADING: 'Yüklənir...',
  META: {
    TITLE: 'Emin Blog - Blockchain ve Sistem Memarlığı Hakkında',
    DESCRIPTION: 'Az bilinən blockchain və sistem memarlığı haqqında texnoloji bloq yazıları',
    CREATOR: '@eminmammadov',
    PUBLISHER: 'Emin Blog',
    SITE_NAME: 'Emin Blog',
    ALT: 'Emin Blog'
  }
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  minimumScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Emin Blog',
    default: LAYOUT_TEXTS.META.TITLE,
  },
  description: LAYOUT_TEXTS.META.DESCRIPTION,
  keywords: ['blockchain', 'sistem memarlığı', 'texnologiya', 'bloq', 'Emin'],
  authors: [{ name: 'Emin', url: 'https://x.com/eminmammadov' }],
  creator: 'Emin',
  publisher: LAYOUT_TEXTS.META.PUBLISHER,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: '48x48' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        rel: 'manifest',
        url: '/favicon/site.webmanifest',
      },
    ],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://emin-bloq.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: LAYOUT_TEXTS.META.TITLE,
    description: LAYOUT_TEXTS.META.DESCRIPTION,
    url: 'https://example.com',
    siteName: LAYOUT_TEXTS.META.SITE_NAME,
    locale: 'az_AZ',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: LAYOUT_TEXTS.META.ALT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: LAYOUT_TEXTS.META.TITLE,
    description: LAYOUT_TEXTS.META.DESCRIPTION,
    creator: LAYOUT_TEXTS.META.CREATOR,
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
        className={`${dmSans.variable} antialiased flex flex-col min-h-screen`}
        data-new-gr-c-s-check-loaded="14.1234.0"
        data-gr-ext-installed=""
      >
        <Suspense fallback={<div className="h-screen bg-[#F7F7F3] flex items-center justify-center">{LAYOUT_TEXTS.LOADING}</div>}>
          <LoadingScreen />
        </Suspense>
        <Suspense fallback={<div className="h-16 bg-[#F7F7F3]"/>}>
          <Header />
        </Suspense>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <UpcomingPopUp />
      </body>
    </html>
  );
}
