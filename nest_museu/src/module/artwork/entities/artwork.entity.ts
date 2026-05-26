import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ARTWORK } from '../constants/artwork.constants';
import { ArtworkStatusEnum } from '../../../commons/enum/artwork-status.enum';
import { ArtworkMedia } from '../../artwork-media/entities/artwork-media.entity';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity(ARTWORK.ENTITY)
export class Artwork extends BaseEntity {
  @PrimaryGeneratedColumn({ name: ARTWORK.TABLE_FIELDS.ID_ARTWORK })
  idArtwork!: number;

  @Column({
    name: ARTWORK.TABLE_FIELDS.TITLE,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title!: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.TYPE,
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  type!: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.ARTIST_NAME,
    type: 'varchar',
    length: 255,
    default: 'Autor Desconhecido',
    nullable: false,
  })
  artistName!: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.CREATION_YEAR,
    type: 'smallint',
    nullable: true,
  })
  creationYear?: number;

  @Column({
    name: ARTWORK.TABLE_FIELDS.DESCRIPTION,
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.TECHNIQUE,
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  technique?: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.HEIGHT,
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  height?: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.WIDTH,
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  width?: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.DEPTH,
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  depth?: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.DIMENSION_UNIT,
    type: 'varchar',
    length: 10,
    default: 'cm',
    nullable: false,
  })
  dimensionUnit!: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.ACQUISITION_DATE,
    type: 'date',
    nullable: true,
  })
  acquisitionDate?: Date;

  @Column({
    name: ARTWORK.TABLE_FIELDS.ACQUISITION_METHOD,
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  acquisitionMethod?: string;

  @Column({
    name: ARTWORK.TABLE_FIELDS.STATUS,
    type: 'enum',
    enum: ArtworkStatusEnum,
    default: ArtworkStatusEnum.EM_EXIBICAO,
    nullable: false,
  })
  status!: ArtworkStatusEnum;

  @Column({
    name: ARTWORK.TABLE_FIELDS.LOCATION,
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  location?: string;

  // Relações
  // Uma obra pode ter muitas mídias vinculas
  @OneToMany(() => ArtworkMedia, (media) => media.artwork, {
    // Salvar mídias junto a obra, se necessário
    cascade: true,
  })
  medias!: ArtworkMedia[];

  constructor(data: Partial<Artwork> = {}) {
    super();
    Object.assign(this, data);
  }
}
