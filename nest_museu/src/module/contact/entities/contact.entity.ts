import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { CONTACT } from '../constants/contact.constantes';

@Entity(CONTACT.ENTITY)
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn({ name: CONTACT.TABLE_FIELDS.ID_CONTACT })
  idContact!: number;

  @Column({ name: CONTACT.TABLE_FIELDS.FIRST_NAME, length: 100 })
  firstName!: string;

  @Column({ name: CONTACT.TABLE_FIELDS.LAST_NAME, length: 100 })
  lastName!: string;

  @Column({ name: CONTACT.TABLE_FIELDS.PHONE, length: 50 })
  phone!: string;

  @Column({ name: CONTACT.TABLE_FIELDS.EMAIL, length: 100 })
  email!: string;

  @Column({ name: CONTACT.TABLE_FIELDS.MESSAGE, type: 'text' })
  message!: string;

  @Column({
    name: CONTACT.TABLE_FIELDS.AGREED_TO_PRIVACY,
    type: 'boolean',
    default: false,
  })
  agreedToPrivacy!: boolean;
  /*
  @Column({ name: CONTACT.TABLE_FIELDS.STATUS })
  status!: number;
  */
  constructor(data: Partial<Contact> = {}) {
    super();
    Object.assign(this, data);
  }
}
