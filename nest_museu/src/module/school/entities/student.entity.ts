import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { StudentsInGroup } from './students-in-group.entity';

@Entity('student')
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_student' })
  idStudent!: number;

  @Column({ name: 'full_name', length: 150 })
  fullName!: string;

  @Column({ name: 'phone', length: 20, nullable: true })
  phone?: string;

  @Column({ name: 'email', length: 100, nullable: true })
  email?: string;

  @Column({ name: 'identification', length: 50, nullable: true })
  identification?: string;

  @OneToMany(() => StudentsInGroup, (sig) => sig.student)
  groupAssociations!: StudentsInGroup[];

  constructor(data: Partial<Student> = {}) {
    super();
    Object.assign(this, data);
  }
}