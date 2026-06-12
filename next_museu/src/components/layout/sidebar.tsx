'use client';

import {
  Archive,
  CalendarCheck,
  ChevronRight,
  LayoutDashboard,
  Settings2,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  Sidebar as SidebarWrapper,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSettings } from '@/hooks/use-settings';
import { i18n } from '../../configs/i18n';
import { DictionaryType } from '../../type/type';

// Carregamento dinâmico do CommandMenu para evitar Erro 500/SSR mismatch
const CommandMenu = dynamic(
  () => import('./command-menu').then((mod) => mod.CommandMenu),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-full animate-pulse rounded-md bg-muted/50 border" />
    ),
  },
);

export function Sidebar({ dictionary }: { dictionary: DictionaryType }) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const { settings } = useSettings();

  if (!dictionary?.navigation) return null;

  const nav = dictionary.navigation;
  const isRTL =
    i18n.localeDirection[
      dictionary.lang as keyof typeof i18n.localeDirection
    ] === 'rtl';

  if (settings.layout === 'horizontal' && !isMobile) return null;

  const itemStyle =
    'text-[15px] font-semibold hover:text-accent-foreground transition-colors';
  const subItemStyle = 'text-[14px] font-medium';

  return (
    <SidebarWrapper
      side={isRTL ? 'right' : 'left'}
      className="border-r border-border/50 shadow-lg"
    >
      <SidebarHeader className="border-b border-border/40 pb-4 gap-4">
        <Link
          href="/"
          className="w-fit flex items-center gap-3 p-3"
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <Image
            src="/images/icons/shadboard.svg"
            alt="Logo"
            height={32}
            width={32}
            className="dark:invert"
          />
          <span className="text-xl tracking-tight font-bold">
            Museu Digital
          </span>
        </Link>

        {/* --- ADIÇÃO DO COMMAND MENU --- */}
        <div className="px-3">
          {/* <CommandMenu dictionary={dictionary} buttonClassName="w-full border-2" /> */}
        </div>
      </SidebarHeader>

      <ScrollArea className="flex-1 px-2 py-2">
        <SidebarContent className="gap-1">
          {/* SEÇÃO: DASHBOARD */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={nav.dashboards}
                    isActive={pathname === '/dashboard'}
                    className={itemStyle}
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <LayoutDashboard className="size-5" />
                      <span className="ml-2.5">
                        {(nav.dashboards || '').toUpperCase()}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* SEÇÃO: USUÁRIO */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <Collapsible className="group/collapsible w-full">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={nav.usuario?.gestao}
                        className={itemStyle}
                      >
                        <Settings2 className="size-5" />
                        <span>{nav.usuario?.gestao}</span>
                        <ChevronRight className="ml-auto size-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l-2 border-primary/30 ml-4 px-2">
                        {/* Usuários */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/usuario'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/usuario"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>{nav.usuario?.listagem}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/usuario/novo'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/usuario/novo"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>{nav.usuario?.novo}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* Roles (Papéis) */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/roles'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/roles"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>{nav.roles?.listagem}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/roles/novo'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/roles/novo"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>{nav.roles?.novo}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* Resources (Recursos) */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/resources'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/resources"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>{nav.resources?.listagem}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/resources/novo'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/recursos/novo"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>{nav.resources?.novo}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* Permissions (Permissões) */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/permissions'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/permissions"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>{nav.permissions?.listagem}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              pathname === '/dashboard/permissions/novo'
                            }
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/permissions/novo"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>{nav.permissions?.novo}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* Contatos */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/contact'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/contact"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>{nav.contato?.listagem}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* ======================================= */}
          {/* SEÇÃO: GESTÃO DE ACERVO                 */}
          {/* ======================================= */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <Collapsible className="group/collapsible w-full">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip="Gestão de Acervo"
                        className={itemStyle}
                      >
                        <Archive className="size-5" />
                        <span>Gestão de Acervo</span>
                        <ChevronRight className="ml-auto size-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l-2 border-primary/30 ml-4 px-2">
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/acervo/obra'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/acervo/obra"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>Cadastrar Obra</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              pathname === '/dashboard/acervo/obradestaque'
                            }
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/acervo/obradestaque"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>Cadastro de Obras em Destaque</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              pathname === '/dashboard/acervo/documento'
                            }
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/acervo/documento"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>Cadastro de Documentos</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/acervo/foto'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/acervo/foto"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>Cadastro de Fotos</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {/* AQUI ESTÁ O CADASTRO 360 DENTRO DE ACERVO */}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === '/dashboard/acervo/obra-360'}
                            className={subItemStyle}
                          >
                            <Link
                              href="/dashboard/acervo/obra-360"
                              onClick={() => isMobile && setOpenMobile(false)}
                            >
                              <span>Cadastro de Obras 360°</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* SEÇÃO: EVENTOS */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={nav.eventos}
                    isActive={pathname === '/dashboard/event'}
                    className={`${itemStyle} bg-primary/5`}
                  >
                    <Link
                      href="/dashboard/event"
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <CalendarCheck className="size-5" />
                      <span className="font-bold">{nav.eventos}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </ScrollArea>
    </SidebarWrapper>
  );
}
