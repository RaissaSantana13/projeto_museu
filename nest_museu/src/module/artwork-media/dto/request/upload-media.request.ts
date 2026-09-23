import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UploadMediaRequest {
  @ApiPropertyOptional({
    description: 'Obra opcional; deixe vazio para arquivo independente',
  })
  @Transform(({ value }) =>
    value === '' || value == null ? undefined : Number(value),
  )
  @IsOptional()
  @IsInt()
  @Min(1)
  idArtwork?: number;

  @ApiPropertyOptional({
    description: 'Classificação opcional, pode ser definida depois',
    example: 'imagem',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @MaxLength(20)
  mediaType?: string;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) =>
    value === '' || value == null
      ? undefined
      : value === 'true'
        ? true
        : value === 'false'
          ? false
          : value,
  )
  @IsOptional()
  @IsBoolean()
  isMain?: boolean;
}
