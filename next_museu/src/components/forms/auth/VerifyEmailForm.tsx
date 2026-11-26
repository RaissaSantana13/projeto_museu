'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { verifayEmailAction } from '../../../actions/auth/verify-email-auth-actions';
import {
  getVerifyEmailSchema,
  VerifyEmailCreate,
  VerifyEmailResponse,
} from '../../../schemas/verify-email-schema';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { useResources } from '../../../service/providers/resource-providers';
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
  const [state, action] = React.useActionState(
    verifayEmailAction,
    initialState,
  );
  const dict = useDictionary();
  const router = useRouter();
  const form = useForm<VerifyEmailCreate>({
    resolver: zodResolver(getVerifyEmailSchema(dict)),
    defaultValues: {
      email: '',
    },
  });

  const { status, mensagem, erro, errors } = state;
  const { resources, loading } = useResources();
  const urlLogin = React.useMemo(() => {
    if (loading) return '';
    const resource = resources.find(
      (r) =>
        r.name.toLowerCase() === 'credentials' &&
        r.endpoint.includes('confirm-email') &&
        r.method.includes('POST'),
    );

    return resource?.endpoint || '';
  }, [resources, loading]);

  React.useEffect(() => {
    if (status === 0) return;

    if (status >= 400) {
      toast.error('Erro', { description: erro || mensagem });
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof VerifyEmailCreate, {
            type: 'server',
            message: messages?.[0],
          });
        });
      }
    } else {
      toast.success('Sucesso!', { description: mensagem });
    }
  }, [status, mensagem, errors, erro, form]);

  React.useEffect(() => {
    if (state.status === 200 || state.status === 201) {
      toast.success('Login realizado com sucesso!');
      router.push('/login');
      router.refresh();
    } else if (state.erro || state.mensagem) {
      toast.error(state.erro || state.mensagem);
    }
  }, [state, router]);

  const onSubmit = form.handleSubmit((data: VerifyEmailCreate) => {
    if (!urlLogin) {
      return toast.error('Configuração de API não encontrada');
    }
    React.startTransition(() => {
      action({ email: data.email, url: urlLogin });
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
        <Button type="submit" aria-label={dict.auth.resend}>
          {dict.auth.resend}
        </Button>

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
