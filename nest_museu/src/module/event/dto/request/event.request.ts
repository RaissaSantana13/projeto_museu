import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BooleanField } from '../../../../commons/decorators/validation/boolean.decorator';
import { DateField } from '../../../../commons/decorators/validation/date.decorator';
import { TextField } from '../../../../commons/decorators/validation/text.decorator';
import { EVENT } from '../../constants/event.constants';

export class EventRequest {
  static entityName = EVENT.ALIAS.toLowerCase();
  @ApiProperty({
    description: EVENT.SWAGGER.TITLE,
    example: 'Exposição peças Dr. Renato Cordeiro',
  })
  @TextField({ required: true, min: 6, max: 250, label: 'Titulo', gender: 'm' })
  @Expose()
  title!: string;
  @ApiProperty({
    description: EVENT.SWAGGER.DESCRIPTION,
    example: 'Peças pertencentes família ',
  })
  @TextField({
    required: true,
    min: 6,
    max: 250,
    label: 'Descrição',
    gender: 'f',
  })
  @Expose()
  description!: string;
  @ApiProperty({
    description: EVENT.SWAGGER.START,
    example: 'Data de início: 01/04/2026 ',
  })
  @DateField({ required: true, label: 'Data', gender: 'f' })
  @Expose()
  start!: Date;
  @ApiProperty({
    description: EVENT.SWAGGER.START_TIME,
    example: 'Hora de início do evento 9:00:00',
  })
  @TextField({
    required: true,
    min: 2,
    max: 2,
    label: 'Hora de início',
    gender: 'f',
  })
  startTime!: string;
  @ApiProperty({
    description: EVENT.SWAGGER.DURATION_MINUTES,
    example: 'Tempo de duração do evento 60',
  })
  durationMinutes!: number;
  @ApiProperty({
    description: EVENT.SWAGGER.END,
    example: 'Data de encerramento: 30/04/2026',
  })
  @TextField({ required: true, label: 'Data', gender: 'f' })
  @Expose()
  end!: Date;
  @ApiProperty({ description: EVENT.SWAGGER.ALLDAY, example: 'true ' })
  @BooleanField({ required: true, label: 'Todos os dias', gender: 'm' })
  @Expose()
  allDay!: boolean;
  @ApiProperty({
    description: EVENT.SWAGGER.LOCATION,
    example: 'Museu de Birigui ',
  })
  @TextField({ required: true, min: 6, max: 100, label: 'Senha', gender: 'm' })
  @Expose()
  location!: string;
  @ApiProperty({ description: EVENT.SWAGGER.COLOR, example: 'azul' })
  @TextField({ required: true, min: 6, max: 30, label: 'Cor', gender: 'f' })
  @Expose()
  color!: string;

  constructor(data: Partial<EventRequest> = {}) {
    Object.assign(this, data);
  }
}
