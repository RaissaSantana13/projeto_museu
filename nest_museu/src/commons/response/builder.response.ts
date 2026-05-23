import { ApiResponse, Link } from './api.response';

export class ResponseBuilder<T> {
  private response: Partial<ApiResponse<T>> = {};

  private constructor() {
    this.response = new ApiResponse<T>();
  }

  static status<T>(status: number): ResponseBuilder<T> {
    const builder = new ResponseBuilder<T>();
    builder.response.status = status;
    builder.response.timestamp = new Date().toISOString();
    //builder.response._links = {};
    return builder;
  }

  message(mensagem: string): this {
    this.response.mensagem = mensagem;
    return this;
  }

  error(erro: string | null): this {
    this.response.erro = erro;
    return this;
  }

  data(dados: T | null): this {
    this.response.dados = dados;
    return this;
  }

  path(path: string): this {
    this.response.path = path;
    return this;
  }

  metodo(metodo: string): this {
    this.response.metodo = metodo;
    return this;
  }

  link(rel: string, href: string, method?: string): this {
    if (!this.response._links) {
      this.response._links = {};
    }
    this.response._links[rel] = { href, method };
    return this;
  }

  links(links: Record<string, Link>): this {
    this.response._links = {
      ...this.response._links,
      ...links,
    };
    return this;
  }

  build(): ApiResponse<T> {
    const response: ApiResponse<T> = {
      status: this.response.status!,
      timestamp: this.response.timestamp!,
      mensagem: this.response.mensagem,
      erro: this.response.erro,
      path: this.response.path,
      metodo: this.response.metodo,
    };

    if (this.response._links !== undefined && this.response._links !== null) {
      response._links = this.response._links;
    }

    if (this.response.dados !== undefined && this.response.dados !== null) {
      response.dados = this.response.dados;
    }

    if (this.response.erro) {
      response.erro = this.response.erro;
    }

    return response;
  }
}
