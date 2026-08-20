import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class AddColaboratorToEventRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_event!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id_colaborator!: number;

  constructor(data: Partial<AddColaboratorToEventRequest> = {}) {
    Object.assign(this, data);
  }
}
