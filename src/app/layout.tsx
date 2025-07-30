import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const roboto = Roboto({
  subsets: ['latin', 'cyrillic'], // Include Cyrillic subset for Russian
  weight: ['400', '500', '700'], // Specify font weights
});

export const metadata: Metadata = {
  title: "Word Select Game",
  description: "A word game where you find words within a jumbled word",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={roboto.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
