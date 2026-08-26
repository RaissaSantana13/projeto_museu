import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../../entities/image.entity';

@Entity('img_spotlight')
export class ImgSpotlight {
  @PrimaryGeneratedColumn({ name: 'id_img_spotlight' })
  id_img_spotlight!: number;

  @Column({ name: 'id_img', type: 'integer' })
  id_img!: number;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  start_date?: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  end_date?: Date;

  @ManyToOne(() => Image, (image) => image.spotlights, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_img' })
  image?: Image;

  constructor(partial?: Partial<ImgSpotlight>) {
    Object.assign(this, partial);
  }
}
