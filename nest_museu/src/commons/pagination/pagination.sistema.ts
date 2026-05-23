import { Pageable } from './page.response';

export class Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  pageSize: number;
  page: number;
  lastPage: number;
  fields: string;
  order: string;

  private constructor(
    content: T[],
    totalPages: number,
    totalElements: number,
    pageSize: number,
    page: number,
    lastPage: number,
    fields: string,
    order: string,
  ) {
    this.content = content;
    this.totalPages = totalPages;
    this.totalElements = totalElements;
    this.pageSize = pageSize;
    this.page = page;
    this.lastPage = lastPage;
    this.fields = fields;
    this.order = order;
  }

  static of<T>(
    content: T[],
    totalElements: number,
    pageable: Pageable,
  ): Page<T> {
    const pageSize = pageable.pageSize;
    const page = pageable.page;
    const totalPages = Math.ceil(totalElements / pageSize);
    const lastPage = totalPages;
    const fields = pageable.fields;
    const order = pageable.orders;
    return new Page(
      content,
      totalPages,
      totalElements,
      pageSize,
      page,
      lastPage,
      fields,
      order,
    );
  }
}
