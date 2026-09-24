'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, FileText, Image, LogIn, Menu, Palette } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { ThemeSwitch } from '../../layout/theme-switch';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur bg-background/75">
      <div className="w-full flex h-16 items-center justify-between">
        <div className="flex items-center gap-8  ml-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-xl font-bold tracking-tighter italic"
          >
            MUSEU DE <span className="text-primary underline">BIRIGUI</span>
          </Link>
        </div>
        <div className="flex items-center gap-4 mr-3">
          <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center gap-1 bg-transparent p-0 hover:text-primary transition-colors"
                aria-haspopup="true"
              >
                Acervo
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
              </button>
              <div className="invisible absolute left-1/2 top-[calc(100%-1px)] z-50 w-56 -translate-x-1/2 rounded-md border bg-popover p-1 text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <Link
                  href="/acervo?tipo=obra"
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Palette className="size-4 text-primary" />
                  Obras e objetos
                </Link>
                <Link
                  href="/acervo?tipo=foto"
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Image className="size-4 text-primary" />
                  Fotografias
                </Link>
                <Link
                  href="/acervo?tipo=documento"
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <FileText className="size-4 text-primary" />
                  Documentos históricos
                </Link>
              </div>
            </div>
            <Link
              href="/tour-virtual"
              className="hover:text-primary transition-colors"
            >
              Tour Virtual
            </Link>

            <Link
              href="/programacao"
              className="hover:text-primary transition-colors"
            >
              Programação
            </Link>

            <Link href="#faq" className="hover:text-primary transition-colors">
              Suporte
            </Link>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
            <Link href="/login">
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
