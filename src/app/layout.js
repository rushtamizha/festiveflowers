import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { site } from '@/config/site';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import JsonLd from '@/components/ui/JsonLd';
import InlineScript from '@/components/ui/InlineScript';
import PaintedFlag from '@/components/layout/PaintedFlag';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import ScrollProgress from '@/components/layout/ScrollProgress';
import CartDrawerHost from '@/components/layout/CartDrawerHost';
import Toaster from '@/components/layout/Toaster';
import TabBar from '@/components/layout/TabBar';
import ClickSpark from '@/components/reactbits/ClickSpark';

// One variable font file for the whole site, self-hosted by next/font (no request to Google at runtime).
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Premium Handcrafted Wedding Garlands & Bridal Flowers`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: site.seo.keywords,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: 'shopping',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en_IN',
    url: '/',
    title: `${site.name} | Premium Handcrafted Wedding Garlands & Bridal Flowers`,
    description: site.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: `${site.name}: handcrafted wedding garlands` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} | Premium Handcrafted Wedding Garlands`,
    description: site.description,
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: site.themeColor,
  width: 'device-width',
  initialScale: 1,
};

// Marks the document as "painted" right after the first frame (or on the first scroll / tap,
// or after 1.5s at the latest). CSS uses it to hold back below-the-fold sections until then.
const markPainted = `(function(){var d=document.documentElement;function p(){d.setAttribute('data-painted','')}try{new PerformanceObserver(function(l,o){o.disconnect();requestAnimationFrame(p)}).observe({type:'paint',buffered:true})}catch(e){p()}setTimeout(p,1500);['scroll','pointerdown','keydown','touchstart'].forEach(function(n){addEventListener(n,p,{once:true,passive:true})})})()`;

export default function RootLayout({ children }) {
  return (
    <html lang={site.locale} className={spaceGrotesk.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col antialiased">
        <InlineScript html={markPainted} />
        <PaintedFlag />
        <noscript>
          <style>{`.after-paint,.after-paint-phone{content-visibility:auto!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <TabBar />
        <CartDrawerHost />
        <Toaster />
        <SmoothScroll />
        <ClickSpark />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
