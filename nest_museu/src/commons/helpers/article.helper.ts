import { Gender } from '../type/field-options.type';

export function article(gender: Gender = 'm'): string {
  return gender === 'f' ? 'A' : 'O';
}
