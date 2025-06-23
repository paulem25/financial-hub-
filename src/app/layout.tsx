import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calculatrices Financières Gamifiées - Maîtrisez vos finances en vous amusant',
  description: 'Calculatrices financières interactives avec système de gamification inspiré de Duolingo. Calculez vos crédits, investissements, retraite et optimisez votre budget tout en gagnant des points et des badges.',
  keywords: ['calculatrice financière', 'crédit immobilier', 'investissement', 'retraite', 'budget', 'gamification'],
  authors: [{ name: 'Calculatrices Financières' }],
  creator: 'Calculatrices Financières',
  publisher: 'Calculatrices Financières',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://calculatrices-financieres.fr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Calculatrices Financières Gamifiées',
    description: 'Maîtrisez vos finances en vous amusant avec nos calculatrices interactives',
    url: 'https://calculatrices-financieres.fr',
    siteName: 'Calculatrices Financières',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Calculatrices Financières Gamifiées',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculatrices Financières Gamifiées',
    description: 'Maîtrisez vos finances en vous amusant',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#58CC02',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Preload des polices importantes */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          as="style"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap"
          as="style"
        />
        
        {/* PWA Meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Calculatrices Financières" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#58CC02" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Analytics et performance */}
        <meta name="google-site-verification" content="your-verification-code" />
        
        {/* Prefetch des ressources importantes */}
        <link rel="prefetch" href="/api/user" />
        <link rel="prefetch" href="/api/gamification" />
      </head>
      <body className="antialiased bg-duolingo-background text-duolingo-text min-h-screen">
        {/* Conteneur principal avec structure responsive */}
        <div className="flex flex-col min-h-screen">
          {/* Header sera ajouté ici */}
          <div id="header-portal" />
          
          {/* Contenu principal */}
          <main className="flex-1 relative">
            {children}
          </main>
          
          {/* Footer sera ajouté ici */}
          <div id="footer-portal" />
        </div>
        
        {/* Portails pour les modals et notifications */}
        <div id="modal-portal" />
        <div id="toast-portal" />
        <div id="confetti-portal" />
        
        {/* Script de performance pour PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enregistrement du service worker
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
              
              // Optimisation des performances
              if ('loading' in HTMLImageElement.prototype) {
                document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                  img.src = img.dataset.src;
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
} 