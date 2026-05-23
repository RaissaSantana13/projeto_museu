import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { SESSION } from '../constants/session.constants';

export class DeviceInfo {
  @Column({ nullable: true })
  browser?: string;

  @Column({ nullable: true })
  os?: string;

  @Column({ nullable: true })
  platform?: string;
}

@Entity(SESSION.ENTITY)
export class Session {
  @PrimaryColumn('uuid', {
    name: SESSION.TABLE_FIELDS.ID_SESSION,
  })
  @Generated('uuid')
  idSession!: string;

  @Column({ name: SESSION.TABLE_FIELDS.ID_USUARIO })
  idUsuario!: number;

  @Column({ name: SESSION.TABLE_FIELDS.TOKEN, unique: true, type: 'text' })
  token!: string;

  @Column({
    name: SESSION.TABLE_FIELDS.EXPIRES_AT,
    type: 'timestamp',
    nullable: false,
  })
  expiresAt!: Date;

  @Column({
    name: SESSION.TABLE_FIELDS.IP_ADDRESS,
    nullable: true,
    length: 45,
    type: 'varchar',
  })
  ipAddress?: string | null;

  @Column({
    name: SESSION.TABLE_FIELDS.USER_AGENT,
    nullable: true,
    type: 'text',
  })
  userAgent?: string | null;

  @ManyToOne(() => Usuario, (usuario) => usuario.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: SESSION.TABLE_FIELDS.ID_USUARIO })
  usuario!: Usuario;

  @Column({ type: 'jsonb', nullable: true })
  device?: DeviceInfo;

  @Column({ name: 'device_name', nullable: true })
  deviceName?: string;

  @Column({ name: 'is_valid', default: true })
  isValid!: boolean;

  //data do último acesso.
  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt?: Date;

  constructor(data: Partial<Session> = {}) {
    Object.assign(this, data);
  }
}
