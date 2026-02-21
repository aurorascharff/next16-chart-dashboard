import './globals.css';

import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
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
  description: 'A Next.js 16 sales analytics dashboard with cascading filters, Prisma, Tailwind CSS, and shadcn/ui',
  title: 'next16-chart-dashboard',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const userPromise = getCurrentUser();
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <NuqsAdapter>
        <body className={`${geistMono.variable} antialiased`}>
          <ThemeProvider>
            <AuthProvider value={userPromise}>
              <main>{children}</main>
            </AuthProvider>
            <ThemeToggle />
            <Toaster />
          </ThemeProvider>
        </body>
      </NuqsAdapter>
    </html>
  );
}
