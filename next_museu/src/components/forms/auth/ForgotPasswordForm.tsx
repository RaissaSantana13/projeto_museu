'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { ButtonLoading } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React, { startTransition } from 'react';
import { toast } from 'sonner';
import { forgotPasswordAction } from '../../../actions/auth/forgot-password-auth-action';
import {
  type ForgotPasswordForm,
  ForgotPasswordResponse,
  getForgotPasswordSchema,
} from '../../../schemas/forgot-passward-schema';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { useResources } from '../../../service/providers/resource-providers';
import { ApiResponse } from '../../../type/api';
import { Field, FieldError, FieldGroup, FieldLabel } from '../../ui/field';

const initialState: ApiResponse<ForgotPasswordResponse> = {
  status: 0,
  mensagem: '',
  erro: null,
  dados: undefined,
  errors: undefined,
};
export function ForgotPasswordForm() {
  const [state, action, isPending] = React.useActionState(
    forgotPasswordAction,
    initialState,
  );
  const dict = useDictionary();
  const router = useRouter();
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(getForgotPasswordSchema(dict)),
    defaultValues: {
      email: '',
    },
  });

  const { status, mensagem, erro, errors } = state;
  const { resources, loading } = useResources();
  const urlPassword = React.useMemo(() => {
    if (loading) return '';
    const resource = resources.find(
      (r) =>
        r.name.toLowerCase() === 'credentials' &&
        r.method.includes('POST') &&
        r.endpoint.includes('forgot-password'),
    );

    return resource?.endpoint || '';
  }, [resources, loading]);

  React.useEffect(() => {
    if (status === 0) return;

    if (status >= 400) {
      toast.error(mensagem);
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof ForgotPasswordForm, {
            type: 'server',
            message: messages?.[0],
          });
        });
      }
    } else {
      toast.success(mensagem);
    }
  }, [status, mensagem, errors, erro, form]);

  React.useEffect(() => {
    if (state.status === 200 || state.status === 201) {
      toast.success(dict.auth.newPassword.updatePassword);
      router.push('/login');
      router.refresh();
    } else if (state.erro || state.mensagem) {
      toast.error(state.erro || state.mensagem);
    }
  }, [state, router]);

  const onSubmit = form.handleSubmit((data: ForgotPasswordForm) => {
    if (!urlPassword) {
      return toast.error(dict.app.endpoint.api_resources);
    }
    startTransition(() => {
      action({
        email: data.email,
        url: urlPassword,
      });
    });
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{dict.auth.forgotPassword.email}</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder={dict.auth.forgotPassword.email}
                  autoComplete="off"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <ButtonLoading isLoading={isPending} disabled={isPending} aria-label={dict.auth.sendInstruction}>
        {dict.auth.sendInstruction}
      </ButtonLoading>
      <Link href="/login" className="-mt-4 text-center text-sm underline" aria-label={dict.auth.backToSignIn}>
        {dict.auth.backToSignIn}
      </Link>
    </form>
  );
}
