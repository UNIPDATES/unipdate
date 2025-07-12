import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from '@/lib/authContext';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Improves font loading performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: {
    default: "Unipdates - Your University Companion",
    template: "%s | Unipdates",
  },
  description: "Unipdates helps university students stay organized with academic resources, event tracking, and campus updates. Your all-in-one university companion.",
  keywords: [
    "university companion",
    "student organizer",
    "academic resources",
    "campus updates",
    "student portal",
    "university events",
    "study tools"
  ],
  authors: [{ name: "Unipdates Team" }],
  creator: "Unipdates",
  publisher: "Unipdates",
  metadataBase: new URL('https://unipdates.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Unipdates - Your University Companion",
    description: "Your all-in-one university companion for academic resources and campus updates.",
    url: 'https://unipdates.com', // Replace with your actual domain
    siteName: 'Unipdates',
    images: [
      {
        url: '/og-image.jpg', // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: 'Unipdates - University Companion',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Unipdates - Your University Companion",
    description: "Your all-in-one university companion for academic resources and campus updates.",
    images: ['/seo/twitter-image.jpg'], // Replace with your actual Twitter image
    creator: '@unipdates', // Replace with your actual Twitter handle
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
    google: 'your-google-verification-code', // Add your Google Search Console code
    yandex: 'your-yandex-verification-code', // Add if using Yandex
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/seo/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/seo/apple-touch-icon.png" />
        <link rel="manifest" href="/seo/site.webmanifest" />
        
        {/* Theme color for browsers */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      </head>
      
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-unilight-bg text-unilight-text-800 dark:bg-unidark-bg dark:text-unidark-text-base transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <main id="main-content" className="min-h-[calc(100vh-10rem)]"> {/* Added main landmark */}
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        
        {/* Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Unipdates",
              "url": "https://unipdates.com", // Replace with your actual domain
              "description": "Your all-in-one university companion for academic resources and campus updates.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </body>
    </html>
  );
}