import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { School } from './school.entity';

@Entity('school_representatives')
export class SchoolRepresentative extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_representative' })
  idRepresentative!: number;

  @Column({ length: 150 })
  name!: string;

  @Column({ length: 100, nullable: true })
  role!: string; // Ex: Diretor, Coordenador

  @Column({ length: 100, nullable: true })
  email!: string;

  @Column({ length: 20, nullable: true })
  phone!: string;

  // Muitos representantes pertencem a uma escola
  @ManyToOne(() => School, (school) => school.representatives, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_school' })
  school!: School;

  constructor(data: Partial<SchoolRepresentative> = {}) {
    super();
    Object.assign(this, data);
  }
}
