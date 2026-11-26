'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { ButtonLoading } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SeparatorWithText } from '@/components/ui/separator';

import { useRouter } from 'next/navigation';
import React, { startTransition, useActionState } from 'react';
import { toast } from 'sonner';
import { registerAuthAction } from '../../../actions/auth/register-auth-actions';
import {
  getRegisterSchema,
  RegisterCreate,
  RegisterResponse,
} from '../../../schemas/register-schemas';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { useResources } from '../../../service/providers/resource-providers';
import { ApiResponse } from '../../../type/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Field, FieldError, FieldLabel } from '../../ui/field';
import { OAuthLinks } from './oauth-links';

const initialState: ApiResponse<RegisterResponse> = {
  status: 0,
  mensagem: '',
  erro: null,
  dados: undefined,
  errors: undefined,
};

export function RegisterForm() {
  const [state, action, isPending] = useActionState(
    registerAuthAction,
    initialState,
  );
  const dict = useDictionary();
  const router = useRouter();
  const [showRegistrationSuccess, setShowRegistrationSuccess] =
    React.useState(false);
  const form = useForm<RegisterCreate>({
    resolver: zodResolver(getRegisterSchema(dict)),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { status, mensagem, erro, errors } = state;
  const { resources, loading } = useResources();
  const urlRegister = React.useMemo(() => {
    if (loading) return '';
    const resource = resources.find(
      (r) =>
        r.name.toLowerCase() === 'credentials' &&
        r.method.includes('POST') &&
        r.endpoint.includes('confirm-email'),
    );

    return resource?.endpoint || '';
  }, [resources, loading]);

  React.useEffect(() => {
    if (status === 0) return;

    if (status >= 400) {
      toast.error(mensagem);
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof RegisterCreate, {
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
      setShowRegistrationSuccess(true);
    } else if (state.erro || state.mensagem) {
      toast.error(state.erro || state.mensagem);
    }
  }, [state, router]);

  const handleContinue = () => {
    setShowRegistrationSuccess(false);
    router.push('/');
    router.refresh();
  };

  const onSubmit = form.handleSubmit((data: RegisterCreate) => {
    if (!urlRegister) {
      return toast.error('Configuração de API não encontrada');
    }
    startTransition(() => {
      action({
        registerRequest: data,
        url: urlRegister,
      });
    });
  });

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{dict.auth.register.firstName}</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder={dict.auth.register.placeholderFirstName}
                  autoComplete="off"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{dict.auth.register.lastName}</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder={dict.auth.register.placeholderLastName}
                  autoComplete="off"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <div className="sm:col-span-2">
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.auth.register.username}</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder={dict.auth.register.placeholderUserName}
                    autoComplete="off"
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.auth.register.email}</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder={dict.auth.register.placeholderEmail}
                    autoComplete="off"
                  />
                  {fieldState.invalid && fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{dict.auth.register.password}</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  type="password"
                  placeholder={dict.auth.register.placeholderPassword}
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{dict.auth.register.confirmPassword}</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  type="password"
                  placeholder={dict.auth.register.placeholderConfirmPassword}
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        <ButtonLoading
          isLoading={isPending}
          disabled={isPending}
          aria-label={dict.auth.access}
        >
          {dict.auth.access}
        </ButtonLoading>
        <div className="-mt-4 text-center text-sm">
          {dict.auth.alreadyHaveAccount}{' '}
          <Link
            href="/login"
            className="underline"
            aria-label={dict.auth.signIn}
          >
            {dict.auth.signIn}
          </Link>
        </div>
        <SeparatorWithText>{dict.auth.orContinueWith}</SeparatorWithText>
        <OAuthLinks />
      </form>

      <AlertDialog
        open={showRegistrationSuccess}
        onOpenChange={setShowRegistrationSuccess}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="mx-auto text-green-600">
              <CheckCircle2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Cadastro realizado!</AlertDialogTitle>
            <AlertDialogDescription>
              Sua conta foi criada com sucesso. Bem-vindo ao museu!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleContinue} className="w-full">
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
