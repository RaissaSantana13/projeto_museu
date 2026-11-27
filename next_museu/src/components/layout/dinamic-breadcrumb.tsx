'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Dicionário para traduzir as rotas da URL para nomes amigáveis
const routeLabels: Record<string, string> = {
  dashboard: 'Início',
  usuario: 'Usuários',
  novo: 'Novo Cadastro',
  listar: 'Listagem',
  contact: 'Contato',
  event: 'Evento',
  acervo: 'Acervo Histórico',
  permissions:'Permissão',
};

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // 1. Quebrar a URL em partes e remover itens vazios
  const allSegments = pathname.split('/').filter(Boolean);

  // 2. Criar  lista de itens que serão EXIBIDOS
  const breadcrumbItems: BreadcrumbItem[] = [];
  let cumulativePath = '';

  allSegments.forEach((segment) => {
    cumulativePath += `/${segment}`;

    // O link textual para o painel é exibido separadamente.
    if (segment === 'dashboard') return;

    // Verifica se o segmento é um número (ID)
    const isId = !isNaN(Number(segment));

    if (!isId) {
      breadcrumbItems.push({
        label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: cumulativePath,
      });
    } else {
      // Se for um ID, não adiciona ao array visual,
      // mas o cumulativePath já guarda para o próximo link (ex: "Editar")
    }
  });

  if (!breadcrumbItems.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-2">
      <ol className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-sans">
        <li className="flex items-center gap-2">
          <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
            Início
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />

              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-primary transition-colors capitalize">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
