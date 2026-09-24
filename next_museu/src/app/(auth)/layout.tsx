import { LanguageDropdown } from '../../components/layout/language-dropdown';
import { ThemeSwitch } from '../../components/layout/theme-switch';
import { getClientDictionary } from '../../lib/get-dictionary';
import { Providers } from '../../service/providers';
import { House } from 'lucide-react';
import Link from 'next/link';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, dict } = await getClientDictionary();
  return (
    /* IMPORTANTE: Usamos o Providers aqui para que o ThemeSwitch e o LanguageDropdown 
       tenham acesso aos contextos (Settings, Theme, I18n), mas como este é o layout 
       de (auth), ele não terá o Sidebar (que está em outro Route Group).
    */
    <Providers locale={locale} dictionary={dict}>
      <div className="relative min-h-screen flex items-center justify-center bg-background/50 overflow-hidden">
        {/* Fundo Decorativo para o Museu (Opcional) */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
          {/* Aqui você poderia colocar uma marca d'água do brasão de Birigui ou textura de papel antigo */}
        </div>

        {/* CANTO SUPERIOR ESQUERDO: Voltar para a página principal */}
        <div className="pointer-events-auto absolute top-4 left-4 z-50 flex items-center gap-3 md:top-8 md:left-8">
          <Link
            href="/"
            aria-label="Voltar para a tela principal"
            title="Voltar para a tela principal"
            className="pointer-events-auto inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <House className="size-5" aria-hidden="true" />
          </Link>
          <span className="text-xl font-black tracking-tighter text-primary uppercase">
            {dict.app.name}
          </span>
        </div>

        {/* CANTO SUPERIOR DIREITO: Seletores */}
        <div className="fixed top-4 right-4 md:top-8 md:right-8 z-50 flex items-center gap-2">
          <LanguageDropdown />
          <ThemeSwitch />
        </div>

        {/* CENTRO: O Formulário */}
        <main className="relative z-10 w-full flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-500">
          {children}
        </main>
      </div>
    </Providers>
  );
}
