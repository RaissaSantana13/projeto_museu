'use client';

import { logoutAuthAction } from '@/actions/auth/logout-auth-action';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

export function NavbarAccount({ signedIn }: { signedIn: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">
          <LogIn aria-hidden="true" /> Entrar
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir menu da conta"
          title="Abrir menu da conta"
          disabled={isPending}
        >
          <UserCircle className="size-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[60]">
        <DropdownMenuItem asChild>
          <Link href="/perfil">
            <UserCircle aria-hidden="true" /> Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => startTransition(() => logoutAuthAction())}
        >
          <LogOut aria-hidden="true" /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
