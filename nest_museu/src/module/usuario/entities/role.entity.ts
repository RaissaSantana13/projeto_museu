import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn({ name: 'id_roles' })
  idRoles!: number;

  @Column({ name: 'nome_roles', type: 'varchar', length: 50, unique: true })
  nomeRoles!: string;

  // Relação N:N com Usuario
  @ManyToMany(() => Usuario, (usuario) => usuario.role)
  usuario?: Usuario[];

  // Relação 1:N com Permissions (conforme seu DDL)
  // @OneToMany(() => Permission, (permission) => permission.role)
  // permissions?: Permission[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date;

  constructor(data: Partial<Roles> = {}) {
    Object.assign(this, data);
  }
}
