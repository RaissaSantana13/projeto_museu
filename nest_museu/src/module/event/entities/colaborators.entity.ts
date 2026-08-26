import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('colaborators')
export class Colaborator extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_colaborator' })
  idColaborator!: number;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl?: string;
  /*
  @ManyToMany(() => Event, (event: Event) => event.colaborators)
  events!: Event[];
  */
}
