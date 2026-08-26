import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ImgSpotlight } from './img_spotlight.entity';
//import { Work } from '../../work/entities/work.entity';

export enum ImageShape {
  SQUARE = 'square',
  RECTANGLE = 'rectangle',
}

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn({ name: 'id_img' })
  id_img!: number;

  @Column({ name: 'title', type: 'varchar', length: 255, nullable: false })
  title!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({
    name: 'form',
    type: 'enum',
    enum: ImageShape,
    enumName: 'shape', // Nome exato do enum criado no PostgreSQL
    nullable: true,
  })
  form?: ImageShape;

  @Column({ name: 'is_cover', type: 'boolean', nullable: true })
  is_cover?: boolean;

  @Column({ name: 'is_front', type: 'boolean', nullable: true })
  is_front?: boolean;

  @Column({ name: 'url_img', type: 'text', nullable: true })
  url_img?: string;

  // Relacionamento com img_spotlight
  @OneToMany(() => ImgSpotlight, (spotlight) => spotlight.image)
  spotlights?: ImgSpotlight[];

  // Relacionamento com works (descomente quando criar a entidade Work)
  // @OneToMany(() => Work, (work) => work.image)
  // works?: Work[];

  constructor(partial: Partial<Image> = {}) {
    Object.assign(this, partial);
  }
}
