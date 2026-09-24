import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailRequest {
  @ApiProperty({
    description: 'teste de token',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
