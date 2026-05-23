import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { VERIFICATION } from '../constants/verification.constants';

@Entity(VERIFICATION.ENTITY) // Nome da tabela no banco
export class Verification extends BaseEntity {
  @PrimaryColumn({ name: VERIFICATION.TABLE_FIELDS.ID, type: 'text' })
  id!: string;

  @Column({ name: VERIFICATION.TABLE_FIELDS.IDENTIFIER, type: 'text' })
  identifier!: string; // Ex: o e-mail do usuário "usuario@email.com"

  @Column({ name: VERIFICATION.TABLE_FIELDS.VALUE, type: 'text' })
  value!: string; // O token ou código secreto gerado

  @Column({
    name: VERIFICATION.TABLE_FIELDS.EXPIRES_AT,
    type: 'timestamptz',
  })
  expiresAt!: Date;

  constructor(data: Partial<Verification> = {}) {
    super();
    Object.assign(this, data);
  }
}
