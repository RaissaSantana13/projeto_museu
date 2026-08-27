import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSchoolGroupRequest {
  @ApiProperty({ description: 'Nome da turma/grupo' })
  @IsString()
  @IsNotEmpty()
  groupName!: string;

  @ApiProperty({ description: 'Total de alunos', required: false })
  @IsInt()
  @IsOptional()
  totalStudents?: number;

  @ApiProperty({ description: 'ID da escola vinculada' })
  @IsInt()
  @IsNotEmpty()
  idSchool!: number;

  @ApiProperty({ description: 'ID do representante responsável', required: false })
  @IsInt()
  @IsOptional()
  idRepresentative?: number;
}

export class UpdateSchoolGroupRequest extends CreateSchoolGroupRequest {}