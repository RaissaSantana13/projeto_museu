'use client';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';
import { LEGAL_LINKS } from '@/configs/legal-links';
import Link from 'next/link';
import { useDictionary } from '../../service/providers/i18n-providers';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const dict = useDictionary();
  return (
    <footer className="bg-background border-t border-sidebar-border">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 p-4 md:px-6">
        <p className="text-xs text-muted-foreground md:text-sm">
          © {currentYear}{' '}
          <Link
            href="/"
            className={cn(buttonVariants({ variant: 'link' }), 'inline p-0')}
          >
            Museu Virtual de Birigui
          </Link>
          .
        </p>
        <nav aria-label="Páginas legais">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {LEGAL_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="underline-offset-4 hover:text-primary hover:underline focus-visible:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-muted-foreground md:text-sm">
          {dict.project.designed}{' '}
          <a
            href="https://bri.ifsp.edu.br"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'link' }), 'inline p-0')}
          >
            : {dict.project.institution}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
