import { Request } from 'express';

export interface Link {
  href: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export interface PageMetadata {
  page: number;
  pageSize: number;
  totalPages: number;
}

export class HateoasHelper {
  /**
   * Garante que a rota comece com '/' para ser tratada como relativa à raiz
   */
  private static formatRoute(routePath: string): string {
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  /**
   * Gera links de paginação relativos preservando Query Params
   */
  static generatePaginationLinks(
    req: Request,
    page: PageMetadata,
    routePath: string,
  ): Record<string, Link> {
    const basePath = this.formatRoute(routePath);

    const buildUrl = (p: number) => {
      const searchParams = new URLSearchParams();

      // Adiciona os parâmetros de paginação atuais
      searchParams.set('page', p.toString());
      searchParams.set('pageSize', page.pageSize.toString());

      // Preserva os demais Query Params da requisição original
      Object.keys(req.query).forEach((key) => {
        if (key !== 'page' && key !== 'pageSize' && req.query[key]) {
          searchParams.set(key, String(req.query[key]));
        }
      });

      return `${basePath}?${searchParams.toString()}`;
    };

    const links: Record<string, Link> = {
      self: { href: buildUrl(page.page), method: 'GET' },
      first: { href: buildUrl(1), method: 'GET' },
      last: { href: buildUrl(page.totalPages), method: 'GET' },
    };

    if (page.page > 1) {
      links.prev = { href: buildUrl(page.page - 1), method: 'GET' };
    }

    if (page.page < page.totalPages) {
      links.next = { href: buildUrl(page.page + 1), method: 'GET' };
    }

    return links;
  }

  /**
   * Gera links relativos para um recurso ou coleção
   */
  static generateResourceLinks(
    routePath: string,
    id?: number | string,
  ): Record<string, Link> {
    const basePath = this.formatRoute(routePath);

    const links: Record<string, Link> = {
      list: { href: basePath, method: 'GET' },
      create: { href: basePath, method: 'POST' },
    };

    // Se houver ID, usamos o ID. Se não, usamos o placeholder :id
    // Isso habilita os botões na DataTable do Next.js
    const resourcePath = id ? `${basePath}/${id}` : `${basePath}/:id`;

    links.self = { href: resourcePath, method: 'GET' };
    links.update = { href: resourcePath, method: 'PUT' };
    links.delete = { href: resourcePath, method: 'DELETE' };

    return links;
  }

  static generateCollectionLinks(
    req: any,
    page: PageMetadata,
    routePath: string,
  ) {
    return {
      ...this.generatePaginationLinks(req, page, routePath), // Navegação (Next/Prev)
      ...this.generateResourceLinks(routePath), // Ações (Create/Update/Delete)
    };
  }
}
