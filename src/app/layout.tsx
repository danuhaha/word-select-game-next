import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';
import React from 'react';

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'], // Include Cyrillic subset for Russian
  weight: ['400', '500', '700'], // Specify font weights
});

export const metadata: Metadata = {
  title: 'Слова',
  description: 'Составь как можно больше слов!',
  metadataBase: new URL('https://games.onthewifi.com/words'),
  icons: {
    icon: `/icon.ico`,
    apple: `/apple-icon.png`,
  },
  openGraph: {
    title: 'Слова',
    description: 'Составь как можно больше слов!',
    url: 'https://games.onthewifi.com/words',
    siteName: 'Слова',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ru',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body className={roboto.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
