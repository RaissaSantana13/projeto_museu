// export interface Link {
//   href: string;
//   method?: string;
// }

import { ApiProperty } from '@nestjsx/crud/lib/crud';

// export interface ApiResponse<T> {
//   status: number;
//   timestamp: string;
//   path?: string | null;
//   mensagem?: string;
//   erro?: string | null;
//   dados?: T | null;
//   metodo?: string;
//   _links?: Record<string, Link>;
// }

export class Link {
  @ApiProperty({ example: 'https://api.exemplo.com/v1/usuarios/1' })
  href!: string;

  @ApiProperty({ example: 'GET', required: false })
  method?: string;
}

export class ApiResponse<T> {
  @ApiProperty({ description: 'Código do status HTTP', example: 200 })
  status!: number;

  @ApiProperty({
    description: 'Data e hora da resposta',
    example: '2023-10-27T10:00:00.000Z',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Caminho da requisição',
    example: '/api/v1/usuario',
    required: false,
  })
  path?: string | null;

  @ApiProperty({
    description: 'Mensagem de sucesso ou informativa',
    example: 'Operação realizada',
    required: false,
  })
  mensagem?: string;

  @ApiProperty({
    description: 'Detalhes do erro, se houver',
    example: null,
    required: false,
  })
  erro?: string | null;

  // Deixamos sem tipo específico aqui, o Controller cuidará disso
  @ApiProperty({
    description: 'Dados da resposta (Generic T)',
    required: false,
  })
  dados?: T | null;

  @ApiProperty({
    description: 'Método HTTP utilizado',
    example: 'GET',
    required: false,
  })
  metodo?: string;

  @ApiProperty({
    description: 'Links HATEOAS para navegação',
    required: false,
    type: 'object',
    additionalProperties: { $ref: '#/components/schemas/Link' },
  })
  _links?: Record<string, Link>;
}
