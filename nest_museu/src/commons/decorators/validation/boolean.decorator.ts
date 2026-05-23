import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional } from 'class-validator';
import { article } from '../../helpers/article.helper';
import { getEntityName } from '../../helpers/get-entity-name.helper';
import { FieldOptions } from '../../type/field-options.type';
import { FIELD_LABEL_KEY } from './field.metadata';

export function BooleanField(options: FieldOptions): PropertyDecorator {
  return (target, propertyKey) => {
    const fieldName = propertyKey as string;
    const label = options.label ?? fieldName;
    const gender = options.gender ?? 'm'; // O campo, o status...
    const entity = getEntityName(target);
    const art = article(gender);

    Reflect.defineMetadata(FIELD_LABEL_KEY, label, target, propertyKey);

    // 1. Transformação para garantir que valores como 'true' ou 1 virem booleanos
    Transform(({ value }) => {
      if (value === 'true' || value === 1 || value === true) return true;
      if (value === 'false' || value === 0 || value === false) return false;
      return value;
    })(target, propertyKey);

    // 2. Validação de tipo Booleano
    IsBoolean({
      message: `${art} ${label} do ${entity} deve ser um valor booleano (verdadeiro ou falso)`,
    })(target, propertyKey);

    // 3. Em booleanos, o 'IsNotEmpty' pode ser traiçoeiro (pois false é considerado vazio por alguns validadores)
    // Usamos IsDefined se for obrigatório enviar true ou false.
    if (options.required) {
      IsDefined({
        message: `${art} ${label} do ${entity} deve ser informado`,
      })(target, propertyKey);
    } else {
      IsOptional()(target, propertyKey);
    }
  };
}
