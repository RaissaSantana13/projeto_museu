import { ApiProperty } from '@nestjsx/crud/lib/crud';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendConfirmationRequest {
  @ApiProperty({
    example: 'usuario@exemplo.com',
    description: 'E-mail usado no cadastro',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
