import { z } from 'zod';
import { DictionaryType } from '../type/type';

export const getLoginSchema = (dict: DictionaryType) => {
  const { validation } = dict.auth;
  return z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .check(z.email({ message: validation.invalidEmail })),
    password: z
      .string()
      .min(6, {
        message: validation.invalidMinPassword,
      })
      .max(250, {
        message: validation.invalidMaxPassword,
      }),
    // .regex(/(?=.*[a-zA-Z])/, {
    //   message: validation.invalidCharacterPassword,
    // })
    // .regex(/(?=.*[0-9])/, {
    //   message: validation.invalidNumberDigit,
    // }),
  });
};

export type LoginRequest = z.infer<ReturnType<typeof getLoginSchema>>;

export const LoginResponseSchema = z.object({
  idUsuario: z.number().int().positive().optional(),
  email: z.string(),
  username: z.string(),
  roles: z.array(z.string()).default([]),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
