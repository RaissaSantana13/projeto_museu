import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Student } from './student.entity';
import { SchoolGroup } from './school-group.entity';

@Entity('students_in_group')
export class StudentsInGroup {
  @PrimaryColumn({ name: 'id_student' })
  idStudent!: number;

  @PrimaryColumn({ name: 'id_group' })
  idGroup!: number;

  @ManyToOne(() => Student, (student) => student.groupAssociations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_student' })
  student!: Student;

  @ManyToOne(() => SchoolGroup, (group) => group.studentAssociations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_group' })
  group!: SchoolGroup;

  constructor(data: Partial<StudentsInGroup> = {}) {
    Object.assign(this, data);
  }
}