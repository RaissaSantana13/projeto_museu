import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { PERMISSIONS } from '../constants/permissions.constants';
import { Action } from '../enum/action.enum';
import { Possession } from '../enum/possession.enum';
import { Resources } from './resources.entity';
import { Roles } from './role.entity';

@Entity(PERMISSIONS.ENTITY)
export class Permissions extends BaseEntity {
  @PrimaryGeneratedColumn({ name: PERMISSIONS.TABLE_FIELDS.ID_PERMISSIONS })
  idPermissions!: number;

  @Column({ name: 'role_id' })
  roleId!: number;

  @ManyToOne(() => Roles, (roles) => roles.permissions)
  @JoinColumn({ name: 'role_id' })
  role!: Roles;

  @Column({ name: 'recurso_id' })
  resourceId!: number;

  @ManyToOne(() => Resources, (resources) => resources.permissions)
  @JoinColumn({ name: 'recurso_id' })
  resource!: Resources;

  @Column({
    name: PERMISSIONS.TABLE_FIELDS.ACTION,
    type: 'varchar',
    length: 20,
    enum: Action, // Validação em nível de código
  })
  action: string = Action.READ;

  @Column({
    name: PERMISSIONS.TABLE_FIELDS.POSSESSION,
    type: 'varchar',
    length: 10,
    default: Possession.ANY,
  })
  possession: string = Possession.ANY;

  constructor(data: Partial<Permissions> = {}) {
    super();
    Object.assign(this, data);
  }
}
