import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { ACCOUNT } from '../constants/accounts.constants';

@Entity(ACCOUNT.ENTITY)
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: ACCOUNT.TABLE_FIELDS.ID_ACCOUNT })
  idAccount!: string;

  @Column({ name: ACCOUNT.TABLE_FIELDS.ID_USUARIO })
  usuarioId!: number;

  @Column({ name: ACCOUNT.TABLE_FIELDS.ACCOUNT_ID })
  accountId!: string;

  @Column({ name: ACCOUNT.TABLE_FIELDS.PROVIDER_ID })
  providerId!: number;

  @Column({
    name: ACCOUNT.TABLE_FIELDS.ACCESS_TOKEN,
    nullable: true,
    type: 'text',
  })
  accessToken!: string;

  @Column({
    name: ACCOUNT.TABLE_FIELDS.REFRESH_TOKEN,
    nullable: true,
    type: 'text',
  })
  refreshToken!: string;

  @Column({
    name: ACCOUNT.TABLE_FIELDS.ACCESS_TOKEN_EXPIRES_AT,
    nullable: true,
  })
  accessTokenExpiresAt!: Date;

  // @Column({
  //   name: ACCOUNT.TABLE_FIELDS.REFRESH_TOKEN_EXPIRES_AT,
  //   nullable: true,
  // })
  // refreshTokenExpiresAt!: Date;

  @Column({ name: ACCOUNT.TABLE_FIELDS.SCOPE, nullable: true })
  scope!: string;

  @ManyToOne(() => Usuario, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: ACCOUNT.TABLE_FIELDS.ID_USUARIO })
  usuario!: Usuario;

  constructor(data: Partial<Account> = {}) {
    super();
    Object.assign(this, data);
  }
}
