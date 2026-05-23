import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { School } from './school.entity';

@Entity('school_representatives')
export class SchoolRepresentative extends BaseEntity {
  @PrimaryGeneratedColumn()
  idRepresentative!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @ManyToOne(() => School, (school) => school.representatives)
  school!: School;
}
