import { Request } from 'express';
import { SIS_MUSEU } from '../enum/sis-museu.enum';
import { HateoasHelper } from '../helpers/hateoas.helpers';
import { Page } from '../pagination/pagination.sistema';

export abstract class BaseController {
  protected abstract readonly entityPath: string;

  protected get fullPath(): string {
    return `${SIS_MUSEU.ROTA_VERSIONAMENTO}/${this.entityPath}`;
  }

  protected getResourceLinks(id?: number): Record<string, any> {
    return HateoasHelper.generateResourceLinks(this.fullPath);
  }

  protected getCollectionLinks(
    req: Request,
    page: Page<any>,
  ): Record<string, any> {
    const metadata = {
      page: page.page,
      pageSize: page.pageSize,
      totalPages: page.totalPages,
      totalElements: page.totalElements,
    };

    return HateoasHelper.generateCollectionLinks(req, metadata, this.fullPath);
  }
}
