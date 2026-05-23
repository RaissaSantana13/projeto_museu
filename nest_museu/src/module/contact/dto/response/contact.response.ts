import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CONTACT } from '../../constants/contact.constantes';

export class ContactResponse {
  @ApiProperty({ description: CONTACT.SWAGGER.ID_CONTACT, example: '1' })
  @Expose()
  idContact!: number;

  @ApiProperty({ description: CONTACT.SWAGGER.FIRST_NAME, example: 'Antônio ' })
  @Expose()
  firstName!: string;

  @ApiProperty({ description: CONTACT.SWAGGER.LAST_NAME, example: 'Silva' })
  @Expose()
  lastName!: string;

  @ApiProperty({
    description: CONTACT.SWAGGER.PHONE,
    example: '(99)-99999-9999',
  })
  @Expose()
  phone!: string;

  @ApiProperty({
    description: CONTACT.SWAGGER.EMAIL,
    example: 'silva@gmail.com',
  })
  @Expose()
  email!: string;

  @ApiProperty({
    description: CONTACT.SWAGGER.MESSAGE,
    example: 'texto referente a mensagem ',
  })
  @Expose()
  message!: string;

  @ApiProperty({
    description: CONTACT.SWAGGER.AGREED_TO_PRIVACY,
    example: 'termo de concordância sim ou não',
  })
  @Expose()
  agreedToPrivacy!: boolean;

  @ApiProperty({ description: CONTACT.SWAGGER.STATUS, example: 'Aberto' })
  @Expose()
  status!: number;

  constructor(data: Partial<ContactResponse> = {}) {
    Object.assign(this, data);
  }
}
