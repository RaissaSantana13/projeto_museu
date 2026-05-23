import { addMinutes, format, parse } from 'date-fns';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { EVENT } from '../constants/event.constants';

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
    name: EVENT.TABLE_FIELDS.START_TIME,
    type: 'time',
    default: '09:00:00',
  })
  startTime!: string;
  @Column({
    name: EVENT.TABLE_FIELDS.DURATION_MINUTES,
    type: 'integer',
    default: 60,
  })
  durationMinutes!: number;
  @Column({
    name: EVENT.TABLE_FIELDS.END_DATE,
    type: 'timestamptz',
    default: () => 'CURRENT_DATE',
  })
  end_date!: Date;
  @Column({ name: EVENT.TABLE_FIELDS.ALLDAY })
  allDay!: boolean;
  @Column({ name: EVENT.TABLE_FIELDS.LOCATION, length: 100 })
  location!: string;
  @Column({ name: EVENT.TABLE_FIELDS.COLOR, length: 30 })
  color!: string;
  @Column({ name: 'max_capacity', type: 'integer', nullable: true })
  maxCapacity!: number;

  // @ManyToMany(() => Sponsor, (sponsor: Sponsor) => sponsor.events)
  // @JoinTable({ name: 'event_sponsors_relation' })
  // sponsors!: Sponsor[];

  // @OneToMany(() => EventBooking, (booking: EventBooking) => booking.event)
  // bookings!: EventBooking[];

  @BeforeInsert()
  @BeforeUpdate()
  calculateDates() {
    const base = new Date(this.start_date);

    const onlyDate = format(base, 'yyyy-MM-dd');

    const fullStartDate = parse(
      `${onlyDate} ${this.startTime}`,
      'yyyy-MM-dd HH:mm:ss',
      new Date(),
    );

    this.start_date = fullStartDate;

    this.end_date = addMinutes(fullStartDate, this.durationMinutes || 60);
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
