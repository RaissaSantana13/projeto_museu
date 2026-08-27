import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PRINT } from '../constants/print.constants';

@Entity(PRINT.ENTITY)
export class Print {
  @PrimaryGeneratedColumn({ name: PRINT.TABLE_FIELDS.ID_PRINT })
  idPrint!: number;

  @Column({
    name: PRINT.TABLE_FIELDS.TITLE,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title!: string;

  @Column({
    name: PRINT.TABLE_FIELDS.DESCRIPTION,
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    name: PRINT.TABLE_FIELDS.URL_PRINT,
    type: 'text',
    nullable: true,
  })
  urlPrint?: string;

  constructor(data: Partial<Print> = {}) {
    Object.assign(this, data);
  }
}
