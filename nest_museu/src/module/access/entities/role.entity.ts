import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { ROLES } from '../constants/roles.constants';
import { Permissions } from './permissions.entity';

@Entity(ROLES.ENTITY)
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn({ name: ROLES.TABLE_FIELDS.ID_ROLE })
  idRoles!: number;

  @Column({
    name: ROLES.TABLE_FIELDS.NOME_ROLE,
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  nomeRoles!: string;

  @OneToMany(() => Permissions, (permission: Permissions) => permission.role, {
    cascade: true,
  })
  permissions!: Permissions[];

  @ManyToMany(() => Usuario, (usuario) => usuario.role)
  usuario!: Usuario[];

  constructor(data: Partial<Roles> = {}) {
    super();
    Object.assign(this, data);
  }
}
