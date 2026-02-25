import './globals.css';

import { GeistPixelSquare } from 'geist/font/pixel';
import { Github } from 'lucide-react';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser } from '@/data/queries/user';
import { AuthProvider } from '@/providers/AuthProvider';
import type { Metadata } from 'next';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  description: 'A Next.js 16 sales analytics dashboard with cascading filters, Tailwind CSS, and shadcn/ui',
  title: 'Next 16 Chart Dashboard',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const userPromise = getCurrentUser();
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <body className={`${geistMono.variable} ${GeistPixelSquare.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider value={userPromise}>
            <main>{children}</main>
          </AuthProvider>
          <div
            style={{ viewTransitionName: 'global-controls' }}
            className="fixed bottom-4 left-4 z-60 flex items-center gap-2"
          >
            <Link
              href="https://github.com/aurorascharff/next16-chart-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View source on GitHub"
            >
              <Github className="size-5" />
            </Link>
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
