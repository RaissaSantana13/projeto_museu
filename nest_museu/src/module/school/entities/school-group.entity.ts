import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { School } from './school.entity';
import { SchoolRepresentative } from './school-representative.entity';
import { StudentsInGroup } from './students-in-group.entity';

@Entity('school_groups')
export class SchoolGroup extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_group' })
  idGroup!: number;

  @Column({ name: 'group_name', length: 150 })
  groupName!: string;

  @Column({ name: 'total_students', type: 'int', default: 0 })
  totalStudents!: number;

  @ManyToOne(() => School, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_school' })
  school!: School;

  @ManyToOne(() => SchoolRepresentative, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'id_representative' })
  representative?: SchoolRepresentative;

  @OneToMany(() => StudentsInGroup, (sig) => sig.group)
  studentAssociations!: StudentsInGroup[];

  constructor(data: Partial<SchoolGroup> = {}) {
    super();
    Object.assign(this, data);
  }
}