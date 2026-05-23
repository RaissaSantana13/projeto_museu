import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { AUTH } from '../constants/login.constants';

@Entity(AUTH.ENTITY)
export class Credentials extends BaseEntity {
  @PrimaryGeneratedColumn({ name: AUTH.TABLE_FIELDS.ID_LOGIN })
  idLogin!: number;

  @Column({ name: AUTH.TABLE_FIELDS.ID_USUARIO })
  idUsuario!: number;

  @Column({ name: AUTH.TABLE_FIELDS.EMAIL, unique: true })
  email!: string;

  @Column({ name: AUTH.TABLE_FIELDS.PASSWORD })
  password!: string;

  @OneToOne(() => Usuario, (user: Usuario) => user.credentials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: AUTH.TABLE_FIELDS.ID_USUARIO })
  usuario!: Usuario;

  constructor(data: Partial<Credentials> = {}) {
    super();
    Object.assign(this, data);
  }
}
