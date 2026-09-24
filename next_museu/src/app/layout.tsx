// src/app/layout.tsx
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter, Lora } from 'next/font/google';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { getClientDictionary } from '../lib/get-dictionary';
import { Providers } from '../service/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Museu - Dashboard',
  description: 'Sistema de Gestão do Museu',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { locale, dict } = await getClientDictionary();

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${lora.variable} font-sans scroll-smooth`}
      >
        <Providers locale={locale} dictionary={dict}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            themes={['light', 'dark', 'theme-museu']}
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                style: { marginTop: '1rem' },
              }}
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
