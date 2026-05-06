import type { Metadata } from "next";
import "./globals.css";

import { Inter, Outfit, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import PublicShell from "@/app/components/PublicShell";
import { CartProvider } from "@/app/context/CartContext";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { CompareProvider } from "@/app/context/CompareContext";
import { SettingsProvider } from "@/app/context/SettingsContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://triastor.ma'),
  title: {
    default: 'Tria Lampe – Lumière & Design Premium au Maroc',
    template: '%s | Tria Lampe'
  },
  description: 'Découvrez Tria Lampe, votre destination premium pour des luminaires design, lampes de table, suspensions et éclairages d\'exception au Maroc. Élégance et qualité garanties.',
  keywords: ['luminaires maroc', 'lampes design maroc', 'suspensions maroc', 'tria lampe', 'éclairage luxe maroc'],
  authors: [{ name: 'Tria Lampe' }],
  creator: 'Tria Lampe',
  publisher: 'Tria Lampe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Tria Lampe – Lumière & Design Premium au Maroc',
    description: 'Boutique spécialisée en luminaires design et éclairage haut de gamme.',
    url: 'https://triastor.ma',
    siteName: 'Tria Lampe',
    locale: 'fr_MA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tria Lampe Maroc',
    description: 'Luminaires design et éclairage premium.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import NotificationOverlay from "./components/NotificationOverlay";
import ScrollToTop from "./components/ScrollToTop";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = saved === 'dark' || saved === 'light' ? saved : (prefersDark ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                } catch(e) {}
              })();
            `,
          }}
        />

      </head>
      <body className={`${inter.variable} ${outfit.variable} ${playfair.variable} antialiased font-sans`} suppressHydrationWarning>
        <ThemeProvider>
          <NotificationProvider>
            <SettingsProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CompareProvider>
                    <CartProvider>
                      <PublicShell>
                        {children}
                      </PublicShell>
                      <NotificationOverlay />
                      <ScrollToTop />

                    </CartProvider>
                  </CompareProvider>
                </WishlistProvider>
              </AuthProvider>
            </SettingsProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
