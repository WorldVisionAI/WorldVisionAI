import { Inter } from 'next/font/google';
import type React from 'react';
import './globals.css';
import NextAuthProvider from '@/components/next-auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WorldVisionAI',
  description: '',
};

const MiniKitProviderWithNoSSR = dynamic(
  () => import('../components/minikit-provider'),
  { ssr: false },
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   const ErudaProvider = dynamic(
  //     () => import('../components/Eruda').then((c) => c.ErudaProvider),
  //     {
  //       ssr: false,
  //     },
  //   );
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>
          {/* <ErudaProvider> */}
          <MiniKitProviderWithNoSSR>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </MiniKitProviderWithNoSSR>
          {/* </ErudaProvider> */}
        </NextAuthProvider>
      </body>
    </html>
  );
}
