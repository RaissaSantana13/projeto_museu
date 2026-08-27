import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DOCUMENT } from '../constants/document.constants';
import { BaseEntity } from '../../../commons/entities/base.entity';
import { Print } from '../../print/entities/print.entity';

@Entity(DOCUMENT.ENTITY)
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn({ name: DOCUMENT.TABLE_FIELDS.ID_DOC })
  idDoc!: number;

  @Column({
    name: DOCUMENT.TABLE_FIELDS.TITLE,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title!: string;

  @Column({
    name: DOCUMENT.TABLE_FIELDS.ORIGIN,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  origin!: string;

  @Column({
    name: DOCUMENT.TABLE_FIELDS.CREATION_YEAR,
    type: 'int',
    nullable: true,
  })
  creationYear?: number;

  @Column({
    name: DOCUMENT.TABLE_FIELDS.DESCRIPTION,
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    name: DOCUMENT.TABLE_FIELDS.DIMENSIONS,
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  dimensions?: string;

  @Column({
    name: DOCUMENT.TABLE_FIELDS.TYPE,
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  type?: string;

  @Column({
    name: DOCUMENT.TABLE_FIELDS.CATEGORY,
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  category?: string;

  @Column({
    name: DOCUMENT.TABLE_FIELDS.LOCATION,
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  location?: string;

  @ManyToOne(() => Print, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: DOCUMENT.TABLE_FIELDS.ID_PRINT })
  print?: Print;

  @Column({
    name: DOCUMENT.TABLE_FIELDS.STATUS,
    type: 'varchar',
    length: 50,
    default: DOCUMENT.STATUS_DEFAULT,
  })
  status!: string;

  constructor(data: Partial<Document> = {}) {
    super();
    Object.assign(this, data);
  }
}
