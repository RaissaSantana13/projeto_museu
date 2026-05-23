import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EVENT } from '../../constants/event.constants';

export class EventResponse {
  @ApiProperty({ description: EVENT.SWAGGER.ID_EVENT, example: '1' })
  @Expose()
  idEvent!: number;
  @ApiProperty({
    description: EVENT.SWAGGER.TITLE,
    example: 'Exposição peças Dr. Renato Cordeiro',
  })
  @Expose()
  title!: string;
  @ApiProperty({
    description: EVENT.SWAGGER.DESCRIPTION,
    example: 'Peças pertencentes família ',
  })
  @Expose()
  description!: string;
  @ApiProperty({
    description: EVENT.SWAGGER.START,
    example: 'Data de início: 01/04/2026 ',
  })
  @Expose()
  start_date!: Date;
  @ApiProperty({
    description: EVENT.SWAGGER.START_TIME,
    example: 'Hora de início do evento 9:00:00',
  })
  @Expose()
  startTime!: string;
  @ApiProperty({
    description: EVENT.SWAGGER.DURATION_MINUTES,
    example: 'Tempo de duração do evento 60',
  })
  @Expose()
  durationMinutes!: number;
  @ApiProperty({
    description: EVENT.SWAGGER.END,
    example: 'Data de encerramento: 30/04/2026',
  })
  @Expose()
  end_date!: Date;
  @ApiProperty({ description: EVENT.SWAGGER.ALLDAY, example: 'true ' })
  @Expose()
  allDay!: boolean;
  @ApiProperty({
    description: EVENT.SWAGGER.LOCATION,
    example: 'Museu de Birigui ',
  })
  @Expose()
  location!: string;
  @ApiProperty({ description: EVENT.SWAGGER.COLOR, example: 'azul' })
  @Expose()
  color!: string;

  constructor(data: Partial<EventResponse> = {}) {
    Object.assign(this, data);
  }
}
