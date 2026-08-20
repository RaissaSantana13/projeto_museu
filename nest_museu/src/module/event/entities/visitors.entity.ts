import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { EventBooking } from './eventbooking.entity';

@Entity('visitors')
export class Visitor extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_visitor' })
  idVisitor!: number;

  @Column({ name: 'firstname', type: 'varchar', length: 255 })
  firstName!: string;

  @Column({ name: 'lastname', type: 'varchar', length: 255 })
  lastName!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 14, unique: true, nullable: true })
  cpf?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @OneToMany(() => EventBooking, (booking: EventBooking) => booking.visitor)
  bookings!: EventBooking[];

  constructor(data: Partial<Visitor> = {}) {
    super();
    Object.assign(this, data);
  }
}
