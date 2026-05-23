export type Gender = 'm' | 'f';

export interface FieldOptions {
  required?: boolean;
  min?: number;
  max?: number;
  label?: string;
  gender?: Gender;
  email?: boolean;
  regex?: RegExp;
  minDate?: Date;
  maxDate?: Date;
  integer?: boolean;
  positive?: boolean;
}
