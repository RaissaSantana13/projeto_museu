'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Earth } from 'lucide-react';
import { useSettings } from '../../hooks/use-settings';
import { LocaleType } from '../../type/type';

export function LanguageDropdown() {
  const { settings, updateSettings } = useSettings();

  const currentLocale = settings.locale as LocaleType;

  const handleLocaleChange = (newLocale: string) => {
    updateSettings({
      ...settings,
      locale: newLocale as LocaleType,
    });
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-full border-sidebar-border bg-sidebar px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Earth className="size-4 text-sidebar-foreground" />
          <span className="text-xs font-bold uppercase">{currentLocale}</span>
          <ChevronDown className="size-3 text-sidebar-foreground/80" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 bg-popover text-popover-foreground">
        <div className="px-2 py-1.5 text-xs font-semibold text-popover-foreground">Idioma / Language</div>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={currentLocale} onValueChange={handleLocaleChange}>
          <DropdownMenuRadioItem value="pt" className="cursor-pointer data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground">
            Português (BR)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en" className="cursor-pointer data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground">
            English (US)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="es" className="cursor-pointer data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground">
            Español (ES)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
