import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { article } from '../../helpers/article.helper';
import { getEntityName } from '../../helpers/get-entity-name.helper';
import { FieldOptions } from '../../type/field-options.type';
import { FIELD_LABEL_KEY } from './field.metadata';

export function NumberField(options: FieldOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const fieldName = propertyKey as string;
    const label = options.label ?? fieldName;
    const gender = options.gender ?? 'm';
    const entity = getEntityName(target);

    const art = article(gender);

    Reflect.defineMetadata(FIELD_LABEL_KEY, label, target, propertyKey);

    Transform(({ value }) =>
      value !== undefined && value !== null ? Number(value) : value,
    )(target, propertyKey);

    IsNumber(
      {},
      {
        message: `${art} ${label} do ${entity} deve ser um número`,
      },
    )(target, propertyKey);
    if (options.required) {
      IsDefined({
        message: `${art} ${label} do ${entity} deve ser informado`,
      })(target, propertyKey);
    }
    if (options.min !== undefined) {
      Min(options.min, {
        message: `${art} ${label} do ${entity} deve ser no mínimo ${options.min}`,
      })(target, propertyKey);
    }
    if (options.max !== undefined) {
      Max(options.max, {
        message: `${art} ${label} do ${entity} deve ser no máximo ${options.max}`,
      })(target, propertyKey);
    }

    if (options.integer) {
      IsInt({
        message: `${art} ${label} do ${entity} deve ser um número inteiro`,
      })(target, propertyKey);
    }
    if (options.positive) {
      IsPositive({
        message: `${art} ${label} do ${entity} deve ser um número positivo`,
      })(target, propertyKey);
    }
  };
}
