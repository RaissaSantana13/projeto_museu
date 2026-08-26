import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { Roles } from '../../access/entities/role.entity';
import { Account } from '../../auth/entities/account.entity';
import { Credentials } from '../../auth/entities/credentials.entity';
import { Session } from '../../auth/entities/session.entity';
import { USUARIO } from '../constants/usuario.constants';

@Entity(USUARIO.ENTITY || 'user')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: USUARIO.TABLE_FIELDS?.ID_USUARIO || 'id_user',
  })
  idUsuario!: number;

  @Column({ name: USUARIO.TABLE_FIELDS?.FIRSTNAME || 'firstname', length: 150 })
  firstName!: string;

  @Column({ name: USUARIO.TABLE_FIELDS?.LASTNAME || 'lastname', length: 150 })
  lastName!: string;

  @Column({
    name: USUARIO.TABLE_FIELDS?.USERNAME || 'username',
    length: 150,
    unique: true,
  })
  username!: string;

  @Column({ name: 'phone', length: 20, nullable: true })
  phone?: string;

  @Column({ name: USUARIO.TABLE_FIELDS?.ACTIVE || 'active', default: false })
  active: boolean = false;

  @Column({
    name: USUARIO.TABLE_FIELDS?.IMAGE_PATH || 'image_path',
    length: 255,
    nullable: true,
  })
  imagePath?: string;

  @Column({
    name: USUARIO.TABLE_FIELDS?.EMAIL_VERIFIED || 'emailverified',
    default: false,
    nullable: true,
  })
  emailVerified?: boolean;

  @Column({
    name: 'istwofactorauthenticationenabled',
    default: false,
    nullable: true,
  })
  isTwoFactorAuthenticationEnabled?: boolean;

  @Column({
    name: 'currenthashedrefreshtoken',
    length: 255,
    nullable: true,
  })
  currentHashedRefreshToken?: string;

  @Column({ name: 'mfa_code', type: 'text', nullable: true })
  mfaCode?: string;

  @Column({ name: 'mfa_expires_at', type: 'timestamp', nullable: true })
  mfaExpiresAt?: Date;

  // --- Relacionamentos ---

  @OneToMany(() => Session, (session) => session.usuario)
  sessions?: Session[];

  @OneToMany(() => Account, (account) => account.usuario)
  accounts?: Account[];

  @OneToOne(() => Credentials, (cred: Credentials) => cred.usuario)
  credentials?: Credentials;

  @ManyToMany(() => Roles, (roles) => roles.usuario, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'id_user', referencedColumnName: 'idUsuario' },
    inverseJoinColumn: { name: 'id_role', referencedColumnName: 'idRoles' },
  })
  role?: Roles[];

  constructor(data: Partial<Usuario> = {}) {
    super();
    Object.assign(this, data);
  }
}
