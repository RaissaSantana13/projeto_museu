'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState, type ReactNode } from 'react';

export function NavbarFrame({
  overHero,
  children,
}: {
  overHero: boolean;
  children: ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overHero) return;

    const update = () => setScrolled(window.scrollY > 16);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [overHero]);

  return (
    <nav
      aria-label="Navegação principal"
      data-over-hero={overHero && !scrolled ? 'true' : undefined}
      className={cn(
        'group/nav sticky top-0 z-50 h-16 w-full shrink-0 border-b bg-background/95 backdrop-blur',
        'transition-colors duration-200 motion-reduce:transition-none',
        overHero && [
          '-mb-16 bg-background/70 backdrop-blur-md',
          'data-[over-hero=true]:border-transparent data-[over-hero=true]:bg-transparent data-[over-hero=true]:text-white data-[over-hero=true]:backdrop-blur-none',
          'data-[over-hero=true]:[&_[data-slot=button]]:border-white/35 data-[over-hero=true]:[&_[data-slot=button]]:bg-transparent data-[over-hero=true]:[&_[data-slot=button]]:text-white data-[over-hero=true]:[&_[data-slot=button]:hover]:bg-white/15',
        ],
      )}
    >
      {children}
    </nav>
  );
}
