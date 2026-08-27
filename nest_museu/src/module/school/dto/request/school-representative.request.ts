import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSchoolRepresentativeRequest {
  @ApiProperty({ description: 'ID da escola associada' })
  @IsNumber()
  @IsNotEmpty()
  idSchool!: number;

  @ApiProperty({ description: 'ID do usuário vinculado ao representante' })
  @IsNumber()
  @IsNotEmpty()
  idUser!: number;
}

export class UpdateSchoolRepresentativeRequest extends CreateSchoolRepresentativeRequest {}