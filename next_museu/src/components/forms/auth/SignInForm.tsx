'use client';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createDemoSession, getDemoRole } from '../../../lib/demo-auth';
import {
  getLoginSchema,
  LoginRequest,
} from '../../../schemas/sigin-schemas';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { ButtonLoading } from '../../ui/button';
import { Field, FieldError, FieldGroup } from '../../ui/field';
import { SeparatorWithText } from '../../ui/separator';
import { OAuthLinks } from './oauth-links';

export function SignInForm() {
  const dict = useDictionary();
  const router = useRouter();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(getLoginSchema(dict)),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    const role = getDemoRole(data.email, data.password);
    if (!role) {
      toast.error('E-mail ou senha inválidos.');
      return;
    }

    createDemoSession(role, data.email);
    toast.success('Login efetuado com sucesso.');
    router.push(role === 'admin' ? '/dashboard' : '/museu');
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-6 w-full">
      <div className="grid w-full gap-2 text-left">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                {/* <FieldLabel>{dict.auth.login.email}:</FieldLabel> */}
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder={dict.auth.login.email}
                  autoComplete="off"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center">
                  {/* <FieldLabel>{dict.auth.login.password}:</FieldLabel> */}
                  <Link
                    href="/forgot-password"
                    className="ms-auto inline-block text-sm underline"
                  >
                    {dict.auth.login.forgotPassword}
                  </Link>
                </div>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  type="password"
                  placeholder={dict.auth.login.placeholderSenha} // Opcional: adicionar ao JSON
                  autoComplete="current-password"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <ButtonLoading isLoading={false} aria-label={dict.auth.signIn}>
        {dict.auth.signIn}
      </ButtonLoading>
      <div className="-mt-4 text-center text-sm">
        {dict.auth.dontHaveAccount}{' '}
        <Link
          href="/register"
          className="underline"
          aria-label={dict.auth.signUp}
        >
          {dict.auth.signUp}
        </Link>
      </div>
      <SeparatorWithText>{dict.auth.orContinueWith}</SeparatorWithText>
      <OAuthLinks />
    </form>
  );
}
