import { ApiProperty } from '@nestjs/swagger';
import { PRINT } from '../../constants/print.constants';
import { Expose } from 'class-transformer';

export class PrintResponse {
  @ApiProperty({
    description: PRINT.SWAGGER.ID_PRINT,
    example: 1,
  })
  @Expose()
  idPrint!: number;

  @ApiProperty({
    description: PRINT.SWAGGER.TITLE,
    example: 'Planta baixa do Museu - 1920',
  })
  @Expose()
  title!: string;

  @ApiProperty({
    description: PRINT.SWAGGER.DESCRIPTION,
    example: 'Reprodução impressa da planta original do edifício sede',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: PRINT.SWAGGER.URL_PRINT,
    example: 'https://museu.exemplo.com/arquivos/prints/planta-1920.pdf',
  })
  @Expose()
  urlPrint?: string;

  constructor(data: Partial<PrintResponse> = {}) {
    Object.assign(this, data);
  }
}
