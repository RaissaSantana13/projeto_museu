import { Matches } from 'class-validator';

export function Password() {
  return function (target: any, propertyKey: string) {
    const field = propertyKey;

    Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/, {
      message:
        `A ${field} deve conter pelo menos uma letra maiúscula, ` +
        `uma letra minúscula, um número e um caractere especial.`,
    })(target, propertyKey);
  };
}
