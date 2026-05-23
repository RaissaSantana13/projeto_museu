// src/common/base.service.ts
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseService<
  T extends ObjectLiteral,
> extends TypeOrmCrudService<T> {
  constructor(repo: Repository<T>) {
    super(repo);
  }
}
