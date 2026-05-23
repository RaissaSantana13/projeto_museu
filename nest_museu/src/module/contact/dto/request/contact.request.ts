import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TextField } from '../../../../commons/decorators/validation/text.decorators';
import { CONTACT } from '../../constants/contact.constantes';

export class ContactRequest {
  static entityName = CONTACT.ALIAS.toLowerCase();
  @ApiProperty({ description: CONTACT.SWAGGER.ID_CONTACT, example: '1' })
  @Type(() => Number)
  @IsOptional()
  idContact!: number;

  @ApiProperty({ description: CONTACT.SWAGGER.FIRST_NAME, example: 'Antônio ' })
  @TextField({ required: true, min: 6, max: 100, label: 'Nome', gender: 'm' })
  firstName!: string;

  @ApiProperty({ description: CONTACT.SWAGGER.LAST_NAME, example: 'Silva' })
  @TextField({ required: true, min: 6, max: 100, label: 'Nome', gender: 'm' })
  lastName!: string;

  @ApiProperty({
    description: CONTACT.SWAGGER.PHONE,
    example: '(99)-99999-9999',
  })
  @TextField({ required: true, min: 6, max: 50, label: 'Nome', gender: 'm' })
  phone!: string;

  @ApiProperty({
    description: CONTACT.SWAGGER.EMAIL,
    example: 'silva@gmail.com',
  })
  @TextField({ required: true, min: 6, max: 100, label: 'Nome', gender: 'm' })
  email!: string;

  @ApiProperty({
    description: CONTACT.SWAGGER.MESSAGE,
    example: 'texto referente a mensagem ',
  })
  @TextField({ required: true, min: 6, max: 100, label: 'Nome', gender: 'm' })
  message!: string;

  @ApiProperty({
    description: CONTACT.SWAGGER.AGREED_TO_PRIVACY,
    example: 'termo de concordância sim ou não',
  })
  agreedToPrivacy!: boolean;

  constructor(data: Partial<ContactRequest> = {}) {
    Object.assign(this, data);
  }
}
