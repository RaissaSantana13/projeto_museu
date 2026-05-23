import { CrudOptions } from '@nestjsx/crud';

export const GLOBAL_CRUD_OPTIONS: Partial<CrudOptions> = {
  query: { softDelete: true },
};
