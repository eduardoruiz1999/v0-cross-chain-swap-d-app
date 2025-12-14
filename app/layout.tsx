import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Script from 'next/script'

// Configuración del token Diamante
const DIAMANTE_TOKEN_CONFIG = {
  name: "Diamante Solana",
  symbol: "DIAMANTE",
  price: 6.00,
  address: "5zJo2GzYRgiZw5j3SBNpuqVcGok35kT3ADwsw74yJWV6",
  website: "https://diamantesolana.com",
  twitter: "@DiamanteSolana"
}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `Diamante Solana - ${DIAMANTE_TOKEN_CONFIG.symbol} Token Swap`,
  description: `Swap ${DIAMANTE_TOKEN_CONFIG.symbol} token on Solana network at fixed $${DIAMANTE_TOKEN_CONFIG.price} USD rate. Cross-chain bridge to Ethereum with $1.5M liquidity pool.`,
  keywords: [
    'Solana',
    'Diamante',
    'DIAMANTE',
    'crypto',
    'swap',
    'bridge',
    'cross-chain',
    'token',
    'DeFi',
    'web3'
  ],
  generator: 'v0.app + Next.js',
  authors: [{ name: 'Diamante Solana Team' }],
  creator: 'Diamante Solana',
  publisher: 'Diamante Solana',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://diamantesolana.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `Diamante Solana - ${DIAMANTE_TOKEN_CONFIG.symbol} Token`,
    description: `Swap ${DIAMANTE_TOKEN_CONFIG.symbol} at fixed $${DIAMANTE_TOKEN_CONFIG.price} USD with $1.5M liquidity pool`,
    url: 'https://diamantesolana.com',
    siteName: 'Diamante Solana',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Diamante Solana Token Swap',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Diamante Solana - ${DIAMANTE_TOKEN_CONFIG.symbol} Token`,
    description: `Fixed $${DIAMANTE_TOKEN_CONFIG.price} USD swap with $1.5M liquidity pool`,
    creator: DIAMANTE_TOKEN_CONFIG.twitter,
    images: ['/twitter-image.png'],
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  icons: {
    icon: [
      {
        url: '/favicon/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' }, // Cyan-500
    { media: '(prefers-color-scheme: dark)', color: '#0369a1' }, // Cyan-800
  ],
  appleWebApp: {
    title: 'Diamante Solana',
    statusBarStyle: 'black-translucent',
    startupImage: [
      {
        url: '/favicon/apple-startup.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://api.mainnet-beta.solana.com" />
        <link rel="preconnect" href="https://solscan.io" />
        <link rel="preconnect" href="https://jup.ag" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Diamante Solana Swap",
              "url": "https://diamantesolana.com",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "description": `Cross-chain swap platform for ${DIAMANTE_TOKEN_CONFIG.symbol} token at fixed $${DIAMANTE_TOKEN_CONFIG.price} USD`,
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
              "creator": {
                "@type": "Organization",
                "name": "Diamante Solana",
                "url": DIAMANTE_TOKEN_CONFIG.website,
              },
            }),
          }}
        />
        
        {/* Viewport Meta Tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* CSP Meta Tag (opcional pero recomendado) */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self' https://api.mainnet-beta.solana.com https://price.jup.ag https://public-api.solscan.io;"
        />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white`}>
        {/* Background Pattern */}
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
        
        {/* Main Content */}
        <main className="relative z-10">
          {children}
        </main>
        
        {/* Vercel Analytics */}
        <Analytics />
        
        {/* Solana Wallet Detection Script */}
        <Script
          id="solana-wallet-detection"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Detect if Phantom is installed
                const checkPhantom = setInterval(() => {
                  if (window.solana?.isPhantom) {
                    clearInterval(checkPhantom);
                    console.log('Phantom wallet detected');
                  }
                }, 100);
                
                // Cleanup after 5 seconds
                setTimeout(() => clearInterval(checkPhantom), 5000);
              })();
            `,
          }}
        />
        
        {/* Performance Monitoring */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </body>
    </html>
  )
                                }
