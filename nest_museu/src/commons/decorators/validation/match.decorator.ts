import {
  IsNotEmpty,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { article } from '../../helpers/article.helper';
import { getEntityName } from '../../helpers/get-entity-name.helper';
import { FieldOptions } from '../../type/field-options.type';
import { FIELD_LABEL_KEY } from './field.metadata';

// 1. A lógica de comparação (Constraint)
@ValidatorConstraint({ name: 'MatchField' })
export class MatchFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Os campos não conferem';
  }
}

// 2. O Decorador Principal
export function MatchField(
  relatedProperty: string,
  options: FieldOptions,
): PropertyDecorator {
  return (target, propertyKey) => {
    const fieldName = propertyKey as string;
    const label = options.label ?? fieldName;
    const gender = options.gender ?? 'm';
    const entity = getEntityName(target);
    const art = article(gender);

    // Define metadados (se você usar para gerar formulários no front)
    Reflect.defineMetadata(FIELD_LABEL_KEY, label, target, propertyKey);

    // Validação de Tipo e Obrigatriedade (reaproveitando sua lógica)
    IsString({ message: `${art} ${label} deve ser um texto` })(
      target,
      propertyKey,
    );

    if (options.required) {
      IsNotEmpty({ message: `${art} ${label} deve ser informada` })(
        target,
        propertyKey,
      );
    }

    // A Validação de Match Customizada
    registerDecorator({
      name: 'matchField',
      target: target.constructor,
      propertyName: fieldName,
      constraints: [relatedProperty],
      options: {
        // Mensagem de erro dinâmica seguindo seu padrão
        message: `${art} ${label} não confere com o campo anterior`,
      },
      validator: MatchFieldConstraint,
    });
  };
}
