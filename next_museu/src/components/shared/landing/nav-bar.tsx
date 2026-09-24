'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LogIn, Menu } from 'lucide-react';
import Link from 'next/link';
import { ThemeSwitch } from '../../layout/theme-switch';

const acervoItems = [
  {
    title: 'Obras',
    href: '/acervo/obras',
    description: 'Explore o acervo de obras do museu.',
  },
  {
    title: 'Fotos',
    href: '/acervo/fotos',
    description: 'Confira o registro fotográfico do acervo.',
  },
  {
    title: 'Documentos',
    href: '/acervo/documentos',
    description: 'Acesse os documentos históricos do acervo.',
  },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[var(--navbar-background)]">
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
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto bg-transparent p-0 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary">
                    Acervo
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-3">
                      {acervoItems.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {item.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Acervo</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {acervoItems.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <Link href={item.href}>{item.title}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/tour-virtual">Tour Virtual</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#pesquisa">Histórias</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#faq">Suporte</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}