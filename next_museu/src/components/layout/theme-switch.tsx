'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Check, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import * as React from 'react';
import { useSettings } from '../../hooks/use-settings';

export function ThemeSwitch() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const [mounted, setMounted] = React.useState(false);
  const activeTheme = mounted
    ? resolvedTheme ?? (theme === 'light' ? 'light' : 'dark')
    : 'light';

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Atualiza a cor da barra do navegador (mobile)
  React.useEffect(() => {
    const colors: Record<string, string> = {
      light: '#f7e8af',
      dark: '#262522',
    };

    const themeColor = colors[theme as string] || '#ffffff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  }, [activeTheme]);

  // Função única para atualizar localmente (next-themes) e no servidor (cookies)
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    updateSettings({ ...settings, mode: newTheme as any });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative scale-95 rounded-full border border-muted-foreground/20 bg-background/80 text-foreground shadow-sm backdrop-blur-sm"
        >
          <Sun
            className={cn(
              'size-[1.2rem] transition-all',
              activeTheme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0',
            )}
          />
          <Moon
            className={cn(
              'absolute size-[1.2rem] transition-all',
              activeTheme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0',
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56 bg-background text-foreground shadow-lg">
        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className={cn('focus:bg-accent', activeTheme === 'dark' && 'bg-accent text-accent-foreground')}
        >
          <Moon className="me-2 size-4" />
          Dark
          <Check size={14} className={cn('ms-auto', activeTheme !== 'dark' && 'hidden')} />
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className={cn('focus:bg-accent', activeTheme === 'light' && 'bg-accent text-accent-foreground')}
        >
          <Sun className="me-2 size-4 text-primary" />
          Light
          <Check size={14} className={cn('ms-auto', activeTheme !== 'light' && 'hidden')} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
