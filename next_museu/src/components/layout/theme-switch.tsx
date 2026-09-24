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

import { Library } from 'lucide-react';
import * as React from 'react';
import { useSettings } from '../../hooks/use-settings';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  // Atualiza a cor da barra do navegador (mobile)
  React.useEffect(() => {
    const colors: Record<string, string> = {
      light: '#ffffff',
      dark: '#020817',
      'theme-museu': '#f5f3ef', // Bege do museu
    };

    const themeColor = colors[theme as string] || '#ffffff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  }, [theme]);

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
          className="relative scale-95 rounded-full border border-muted-foreground/10"
        >
          <Sun className="size-[1.2rem] transition-all dark:rotate-90 dark:scale-0" />
          <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
          <Sun className="me-2 size-4" />
          Light
          <Check size={14} className={cn('ms-auto', theme !== 'light' && 'hidden')} />
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
          <Moon className="me-2 size-4" />
          Dark
          <Check size={14} className={cn('ms-auto', theme !== 'dark' && 'hidden')} />
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleThemeChange('theme-museu')}>
          <Library className="me-2 size-4 text-sepia-600" />
          Museu Histórico
          <Check size={14} className={cn('ms-auto', theme !== 'theme-museu' && 'hidden')} />
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
