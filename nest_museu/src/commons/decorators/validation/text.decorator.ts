import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { article } from '../../helpers/article.helper';
import { getEntityName } from '../../helpers/get-entity-name.helper';
import { FieldOptions } from '../../type/field-options.type';
import { FIELD_LABEL_KEY } from './field.metadata';

export function TextField(options: FieldOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const fieldName = propertyKey as string;
    const label = options.label ?? fieldName;
    const gender = options.gender ?? 'm';
    const entity = getEntityName(target);

    const art = article(gender);

    Reflect.defineMetadata(FIELD_LABEL_KEY, label, target, propertyKey);

    // Transform automático
    Transform(({ value }) =>
      typeof value === 'string' ? value.trim() : value,
    )(target, propertyKey);

    // Tipo
    IsString({
      message: `${art} ${label} do ${entity} deve ser um texto`,
    })(target, propertyKey);

    // Required
    if (options.required) {
      IsNotEmpty({
        message: `${art} ${label} do ${entity} deve ser informada`,
      })(target, propertyKey);
    }

    if (options.min) {
      MinLength(options.min, {
        message: `${art} ${label} do ${entity} deve conter no mínimo ${options.min} caracteres`,
      })(target, propertyKey);
    }

    if (options.max) {
      MaxLength(options.max, {
        message: `${art} ${label} do ${entity} deve conter no máximo ${options.max} caracteres`,
      })(target, propertyKey);
    }

    if (options?.email) {
      IsEmail(
        {},
        {
          message: `${art} ${label} do ${entity} não é um e-mail válido`,
        },
      )(target, propertyKey);
    }
    if (options?.regex) {
      Matches(options.regex, {
        message: `${art} ${label} do ${entity} não atende ao formato esperado`,
      })(target, propertyKey);
    }
  };
}
