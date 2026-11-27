'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import React from 'react';
import { toast } from 'sonner';
import { verifayEmailAction } from '../../../actions/auth/verify-email-auth-actions';
import {
  getVerifyEmailSchema,
  VerifyEmailCreate,
  VerifyEmailResponse,
} from '../../../schemas/verify-email-schema';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { ApiResponse } from '../../../type/api';
import { Field, FieldError, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';

const initialState: ApiResponse<VerifyEmailResponse> = {
  status: 0,
  mensagem: '',
  erro: null,
  dados: undefined,
  errors: undefined,
};

export function VerifyEmailForm() {
  const [state, action, pending] = React.useActionState(
    verifayEmailAction,
    initialState,
  );
  const dict = useDictionary();
  const form = useForm<VerifyEmailCreate>({
    resolver: zodResolver(getVerifyEmailSchema(dict)),
    defaultValues: {
      email: '',
    },
  });

  React.useEffect(() => {
    if (!state.mensagem || state.status === 0) return;
    if (state.status >= 400) {
      toast.error(state.mensagem);
    } else {
      toast.success(state.mensagem);
    }
  }, [state]);

  const onSubmit = form.handleSubmit((data: VerifyEmailCreate) => {
    React.startTransition(() => {
      action({ email: data.email });
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-4">
        {/* INPUT CORRETO */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{dict.auth.verifyEmail.email}</FieldLabel>
              <Input
                {...field}
                placeholder={dict.auth.verifyEmail.placeholderEmail}
                autoComplete="off"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* BOTÃO SUBMIT */}
        <Button type="submit" disabled={pending}>{dict.auth.resend}</Button>

        {/* SKIP */}
        <Link
          href="/login"
          className={cn(buttonVariants({ variant: 'ghost' }))}
          aria-label={dict.auth.skipForNow}
        >
          {dict.auth.skipForNow}
        </Link>
      </form>
    </Form>
  );
}

/* toast({
        title: 'Verifique seu e-mail',
        description: 'Enviamos um novo link de verificação.', */
