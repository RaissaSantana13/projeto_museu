import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ARTWORK_MEDIA } from '../constants/artwork-media.constants';
import { Artwork } from '../../artwork/entities/artwork.entity';
import { BaseEntity } from '../../../commons/entities/base.entity';

@Entity(ARTWORK_MEDIA.ENTITY)
export class ArtworkMedia extends BaseEntity {
  @PrimaryGeneratedColumn({ name: ARTWORK_MEDIA.TABLE_FIELDS.ID_MEDIA })
  idMedia!: number;

  @Column({
    name: ARTWORK_MEDIA.TABLE_FIELDS.ID_ARTWORK,
    type: 'int',
    nullable: true,
  })
  idArtwork!: number | null;

  @Column({
    name: ARTWORK_MEDIA.TABLE_FIELDS.MEDIA_TYPE,
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  mediaType!: string | null;

  @Column({ name: 'original_name', type: 'text', nullable: true })
  originalName!: string | null;

  @Column({ name: 'mime_type', type: 'varchar', length: 255, nullable: true })
  mimeType!: string | null;

  @Column({ name: 'size_bytes', type: 'bigint', nullable: true })
  sizeBytes!: string | null;

  @Column({
    name: ARTWORK_MEDIA.TABLE_FIELDS.URL,
    type: 'text',
    nullable: false,
  })
  url!: string;

  @Column({
    name: ARTWORK_MEDIA.TABLE_FIELDS.IS_MAIN,
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isMain!: boolean;

  // Relações
  // Muitas mídias pertencem a uma obra
  @ManyToOne(() => Artwork, (artwork) => artwork.medias, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: ARTWORK_MEDIA.TABLE_FIELDS.ID_ARTWORK })
  artwork!: Artwork | null;

  constructor(data: Partial<ArtworkMedia> = {}) {
    super();
    Object.assign(this, data);
  }
}
