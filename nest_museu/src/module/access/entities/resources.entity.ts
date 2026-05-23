import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { RESOURCES } from '../constants/resources.constants';
import { Permissions } from './permissions.entity';

@Entity(RESOURCES.ENTITY)
export class Resources extends BaseEntity {
  @PrimaryGeneratedColumn({ name: RESOURCES.TABLE_FIELDS.ID_RESOURCES })
  idResources!: number;

  @Column({
    name: RESOURCES.TABLE_FIELDS.NOME_RESOURCES,
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  nomeResources!: string;

  @OneToMany(
    () => Permissions,
    (permission: Permissions) => permission.resource,
  )
  permissions!: Permissions[];

  constructor(data: Partial<Resources> = {}) {
    super();
    Object.assign(this, data);
  }
}
