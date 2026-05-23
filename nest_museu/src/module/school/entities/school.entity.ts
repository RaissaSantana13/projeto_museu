import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { SCHOOL } from '../constants/school.constantes';
import { SchoolRepresentative } from './school-representative.entity';

@Entity(SCHOOL.ENTITY)
export class School extends BaseEntity {
  @PrimaryGeneratedColumn({ name: SCHOOL.TABLE_FIELDS.ID_SCHOOL })
  idSchool!: number;

  @Column({
    name: SCHOOL.TABLE_FIELDS.NAME,
    length: 150,
  })
  name!: string;

  @Column({
    name: SCHOOL.TABLE_FIELDS.CNPJ,
    unique: true,
    length: 18,
    nullable: true,
  })
  cnpj?: string;

  // Relações
  @OneToMany(
    () => SchoolRepresentative,
    (rep: SchoolRepresentative) => rep.school,
    { cascade: true },
  )
  representatives!: SchoolRepresentative[];

  constructor(data: Partial<School> = {}) {
    super();
    Object.assign(this, data);
  }
}
