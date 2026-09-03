import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { EVENT } from '../constants/event.constants';
import { Colaborator } from './colaborators.entity';
//import { EventSpotlight } from './event-spotlight.entity';
//import { EventBooking } from './eventbooking.entity';
@Entity(EVENT.ENTITY)
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn({ name: EVENT.TABLE_FIELDS.ID_EVENT })
  idEvent!: number;

  @Column({ name: EVENT.TABLE_FIELDS.TITLE, type: 'text' })
  title!: string;

  @Column({ name: EVENT.TABLE_FIELDS.DESCRIPTION, type: 'text' })
  description!: string;

  @Column({
    name: EVENT.TABLE_FIELDS.START_DATE,
    type: 'timestamptz',
    default: () => 'CURRENT_DATE',
  })
  start_date!: Date;

  @Column({
    name: EVENT.TABLE_FIELDS.END_DATE,
    type: 'timestamptz',
    default: () => 'CURRENT_DATE',
  })
  end_date!: Date;

  @Column({ name: EVENT.TABLE_FIELDS.LOCATION, length: 100 })
  location!: string;

  @Column({ name: 'max_capacity', type: 'integer', nullable: true })
  maxCapacity!: number;

  @Column({ name: EVENT.TABLE_FIELDS.COLOR, length: 30 })
  color!: string;
  /*
  @ManyToMany(
    () => Colaborator,
    (colaborator: Colaborator) => colaborator.events,
  )*/
  @JoinTable({
    name: 'event_colaborator_relation',
    joinColumn: {
      name: 'id_event',
      referencedColumnName: 'idEvent',
    },
    inverseJoinColumn: {
      name: 'id_colaborator',
      referencedColumnName: 'idColaborator',
    },
  })
  colaborators!: Colaborator[];

  // @OneToMany(() => EventBooking, (booking: EventBooking) => booking.event)
  // bookings!: EventBooking[];

  //@OneToMany(() => EventSpotlight, (spotlight) => spotlight.event)
  //event_spotlights!: EventSpotlight[];

  //@OneToMany(() => EventBooking, (booking) => booking.event)
  //event_bookings!: EventBooking[];
  @BeforeInsert()
  @BeforeUpdate()
  calculateDates() {
    // ATENÇÃO: FOI COMENTADO POIS OS CAMPOS NÃO EXISTEM NO BANCO E FORAM REMOVIDOS DO CODIGO
    // TALVEZ ESSE MÉTODO NEM FAÇA MAIS SENTIDO EXSITIR.
    //
    // const base = new Date(this.start_date);
    // const onlyDate = format(base, 'yyyy-MM-dd');
    // const fullStartDate = parse(
    //   `${onlyDate}`,
    //   'yyyy-MM-dd HH:mm:ss',
    //   new Date(),
    // );
    // this.start_date = fullStartDate;
    // this.end_date = addMinutes(fullStartDate, this.durationMinutes || 60);
  }

  // getAvailableSlots(): number {
  //   if (!this.maxCapacity) return Infinity;
  //   const booked = this.bookings
  //     .filter((b) => b.status === 'confirmed')
  //     .reduce((sum, b) => sum + b.expectedStudentCount, 0);
  //   return this.maxCapacity - booked;
  // }

  constructor(data: Partial<Event> = {}) {
    super();
    Object.assign(this, data);
  }
}
