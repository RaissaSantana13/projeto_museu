import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { SchoolRepresentative } from './schoolrepresentaives.entity';

@Entity('schools')
export class School extends BaseEntity {
  @PrimaryGeneratedColumn()
  idSchool!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  cnpj?: string;

  @OneToMany(
    () => SchoolRepresentative,
    (rep: SchoolRepresentative) => rep.school,
  )
  representatives!: SchoolRepresentative[];
}
