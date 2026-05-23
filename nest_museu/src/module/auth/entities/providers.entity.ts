import { BaseEntity } from '../../../commons/entities/base.entity';
import { v4 as uuidv4 } from 'uuid';

export class Account extends BaseEntity {
  idAccount!: string;
  idUsuario!: number;
}
