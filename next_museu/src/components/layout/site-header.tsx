import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LanguageDropdown } from './language-dropdown';
import { NavUser } from './nav-user';
import { ThemeSwitch } from './theme-switch';

export function SiteHeader({ name }: { name: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-50">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Trigger ajustado para ser visível no fundo escuro */}
        <SidebarTrigger className="-ml-1 text-sidebar-foreground hover:bg-sidebar-accent" />

        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4 bg-sidebar-border" />

        {/* Título com a fonte Serifada (Lora) para o Museu */}
        <h1 className="text-base font-serif font-semibold tracking-wide">Museu Virtual - Birigui</h1>

        <div className="ml-auto flex items-center gap-2">
          <LanguageDropdown />
          <ThemeSwitch />

          <NavUser name={name} />
        </div>
      </div>
    </header>
  );
}
