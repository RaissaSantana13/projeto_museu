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
    <form onSubmit={onSubmit} className="grid w-full gap-6">
      <div className="grid w-full gap-4 text-left">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-2">
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder={dict.auth.login.email}
                  autoComplete="off"
                  className="h-11"
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
              <Field data-invalid={fieldState.invalid} className="space-y-2">
                <Input
                  {...field}
                  value={field.value ?? ''}
                  type="password"
                  placeholder={dict.auth.login.placeholderSenha}
                  autoComplete="current-password"
                  className="h-11"
                />
                <div className="flex items-center justify-start">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {dict.auth.login.forgotPassword}
                  </Link>
                </div>
                {fieldState.invalid && fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <ButtonLoading isLoading={false} aria-label={dict.auth.signIn} className="mt-0 h-11">
        {dict.auth.signIn}
      </ButtonLoading>
      <div className="text-center text-sm">
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
