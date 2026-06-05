'use client';

import { Button } from '@/components/ui/button';
import { LogIn, Menu } from 'lucide-react';
import Link from 'next/link';
import { ThemeSwitch } from '../../layout/theme-switch';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur bg-background/75">
      <div className="w-full flex h-16 items-center justify-between">
        <div className="flex items-center gap-8  ml-3">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tighter italic"
          >
            MUSEU DE <span className="text-primary underline">BIRIGUI</span>
          </Link>
        </div>
        <div className="flex items-center gap-4 mr-3">
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link
              href="/acervo"
              className="hover:text-primary transition-colors"
            >
              Acervo
            </Link>
            <Link
              href="/tour-virtual"
              className="hover:text-primary transition-colors"
            >
              Tour Virtual
            </Link>

            <Link
              href="#pesquisa"
              className="hover:text-primary transition-colors"
            >
              Histórias
            </Link>
            <Link href="#faq" className="hover:text-primary transition-colors">
              Suporte
            </Link>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link href="/dashboard">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
