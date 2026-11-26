import AccessibilityToolbar from '@/components/layout/AccessibilityToolbar';
import VLibras from '@/components/layout/VLibras';
import { Footer } from '@/components/shared/landing/footer';
import { Navbar } from '@/components/shared/landing/nav-bar';
import type { ReactNode } from 'react';

export default function LegalPagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AccessibilityToolbar />
      <VLibras />
      <div className="a11y-page-content flex min-h-screen flex-col">
        <Navbar />
        {children}
        <Footer />
      </div>
    </>
  );
}
