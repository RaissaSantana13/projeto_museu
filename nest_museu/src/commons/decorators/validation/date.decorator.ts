import { Type } from 'class-transformer';
import { article } from '../../helpers/article.helper';
import { getEntityName } from '../../helpers/get-entity-name.helper';
import { FieldOptions } from '../../type/field-options.type';
import { FIELD_LABEL_KEY } from './field.metadata';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  MaxDate,
  MinDate,
} from 'class-validator';

export function DateField(options: FieldOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const fieldName = propertyKey as string;
    const label = options.label ?? fieldName;
    const gender = options.gender ?? 'f'; // Geralmente 'a data'
    const entity = getEntityName(target);
    const art = article(gender);

    Reflect.defineMetadata(FIELD_LABEL_KEY, label, target, propertyKey);

    // 1. Converte a string recebida (ex: "2026-04-01") para objeto Date do JS
    Type(() => Date)(target, propertyKey);

    // 2. Validação de data válida
    IsDate({
      message: `${art} ${label} do ${entity} deve ser uma data válida`,
    })(target, propertyKey);

    // 3. Obrigatório
    if (options.required) {
      IsNotEmpty({
        message: `${art} ${label} do ${entity} deve ser informada`,
      })(target, propertyKey);
    } else {
      IsOptional()(target, propertyKey);
    }

    // 4. Data Mínima
    if (options.minDate) {
      MinDate(options.minDate, {
        message: `${art} ${label} do ${entity} não pode ser anterior a ${options.minDate.toLocaleDateString()}`,
      })(target, propertyKey);
    }

    // 5. Data Máxima
    if (options.maxDate) {
      MaxDate(options.maxDate, {
        message: `${art} ${label} do ${entity} não pode ser posterior a ${options.maxDate.toLocaleDateString()}`,
      })(target, propertyKey);
    }
  };
}
