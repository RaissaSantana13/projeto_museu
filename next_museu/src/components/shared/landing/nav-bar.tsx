import { Button } from '@/components/ui/button';
import { hasActiveSession } from '@/lib/auth-session';
import { ChevronDown, FileText, Image, Menu, Palette } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { ThemeSwitch } from '../../layout/theme-switch';
import { NavbarAccount } from './navbar-account';
import { NavbarFrame } from './navbar-frame';

const navLinkClass =
  'transition-colors hover:text-primary group-data-[over-hero=true]/nav:hover:text-white group-data-[over-hero=true]/nav:hover:underline';

export async function Navbar({ overHero = false }: { overHero?: boolean }) {
  const signedIn = await hasActiveSession();

  return (
    <NavbarFrame overHero={overHero}>
      <div className="flex h-full w-full items-center justify-between">
        <div className="-ml-2 flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <NextImage
              src="/images/logo_sem_escrita%20(3).png"
              alt="Museu de Birigui"
              width={450}
              height={100}
              priority
              className="h-16 w-auto max-w-[45vw] object-contain"
            />
          </Link>
        </div>
        <div className="flex items-center gap-4 mr-3">
          <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground group-data-[over-hero=true]/nav:text-white md:flex">
            <div className="group relative">
              <button
                type="button"
                className={`inline-flex items-center gap-1 bg-transparent p-0 ${navLinkClass}`}
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
            <Link href="/tour-virtual" className={navLinkClass}>
              Tour Virtual
            </Link>

            <Link href="/programacao" className={navLinkClass}>
              Programação
            </Link>

            <Link href="#faq" className={navLinkClass}>
              Suporte
            </Link>
          </div>
          <NavbarAccount signedIn={signedIn} />
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <ThemeSwitch />
        </div>
      </div>
    </NavbarFrame>
  );
}
