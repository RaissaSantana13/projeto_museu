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

@Entity(AUTH.ENTITY || 'credentials')
export class Credentials extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: AUTH.TABLE_FIELDS?.ID_LOGIN || 'id_credentials',
  })
  idCredentials!: number;

  @Column({
    name: AUTH.TABLE_FIELDS?.ID_USUARIO || 'id_user',
    type: 'integer',
    unique: true,
  })
  idUser!: number;

  @Column({
    name: AUTH.TABLE_FIELDS?.EMAIL || 'email',
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email!: string;

  @Column({
    name: AUTH.TABLE_FIELDS?.PASSWORD || 'password',
    type: 'varchar',
    length: 255,
  })
  password!: string;

  // Chave estrangeira que conecta ao Usuario
  @OneToOne(() => Usuario, (user) => user.credentials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_user', referencedColumnName: 'idUsuario' })
  usuario!: Usuario;

  constructor(data: Partial<Credentials> = {}) {
    super();
    Object.assign(this, data);
  }
}
