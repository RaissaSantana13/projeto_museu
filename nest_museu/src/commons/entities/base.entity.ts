import { Exclude } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
