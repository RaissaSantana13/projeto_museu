import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PAGINATION } from './pagination.enum';

export class PaginationDto {
  @ApiPropertyOptional({
    example: PAGINATION.PAGE,
    description: 'Número da página (maior ou igual a 1)',
    default: PAGINATION.PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = PAGINATION.PAGE;

  @ApiPropertyOptional({
    example: PAGINATION.PAGESIZE,
    description: 'Quantidade de itens por página (maior ou igual a 1)',
    default: PAGINATION.PAGESIZE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = PAGINATION.PAGESIZE;

  @ApiPropertyOptional({
    example: 'id',
    description: 'Atributo da classe/banco para ordenação',
  })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'Ordem da paginação (ASC ou DESC)',
    default: PAGINATION.ASC,
  })
  @IsOptional()
  @IsString()
  @IsIn([PAGINATION.ASC, PAGINATION.DESC])
  order?: string = PAGINATION.ASC;

  @ApiPropertyOptional({
    example: 'museu',
    description: 'Termo para filtro de busca de texto',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
