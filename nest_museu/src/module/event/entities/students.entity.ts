import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity('students')
export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  idStudent!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  email?: string; // Útil para enviar o certificado digital

  @Column({ default: false })
  attended!: boolean; // Marcado pelo funcionário no dia do evento
  /*
  @ManyToOne(() => EventBooking, (booking: EventBooking) => booking.students)
  booking!: EventBooking;
  */
}
