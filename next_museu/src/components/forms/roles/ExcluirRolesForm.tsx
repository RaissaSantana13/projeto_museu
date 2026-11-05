'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { startTransition, useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { excluirRolesAction } from '../../../actions/roles/excluir-roles-actions';
import {
  getRolesSchema,
  RolesDelete,
  RolesResponse,
  RolesUpdate,
} from '../../../schemas/roles-schemas';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { useResources } from '../../../service/providers/resource-providers';
import { ApiResponse } from '../../../type/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { FormContainer } from '../form-layout';

const initialState: ApiResponse<RolesResponse> = {
  status: 0,
  mensagem: '',
  erro: null,
  dados: undefined,
  errors: undefined,
};

type RolesResponseProps = RolesResponse;

export default function ExcluirRolesForm({
  idRoles,
  roles,
}: {
  idRoles: string;
  roles: RolesResponseProps;
}) {
  const [state, action, isPending] = useActionState(
    excluirRolesAction,
    initialState,
  );
  const dict = useDictionary();
  const form = useForm<RolesDelete>({
    resolver: zodResolver(getRolesSchema(dict)),
    defaultValues: {
      idRoles: roles.idRoles,
      nomeRoles: roles.nomeRoles,
    },
  });

  const { getEndpoint } = useResources();
  const urlDelete = React.useMemo(
    () => getEndpoint('roles', roles.idRoles ?? ''),
    [getEndpoint, roles.idRoles],
  );

  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingData, setPendingData] = React.useState<RolesDelete | null>(
    null,
  );

  const { status, mensagem, erro, errors } = state;

  React.useEffect(() => {
    if (status === 0 || (!mensagem && !erro)) return;

    if (status >= 400) {
      toast.error(erro || mensagem);
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof RolesUpdate, {
            type: 'server',
            message: messages?.[0],
          });
        });
      }
    } else {
      toast.success(mensagem);
    }
  }, [status, mensagem, errors, erro, form]);

  function onSubmit(rolesDelete: RolesDelete) {
    if (idRoles === undefined || idRoles === null) {
      return toast.error(dict.roles.management.id_not_found);
    }
    setPendingData(rolesDelete);
    setShowConfirmDialog(true);
  }

  function handleConfirm() {
    if (!urlDelete) return toast.error(dict.app.endpoint.api_resources);
    if (pendingData) {
      startTransition(() => {
        action({ id: Number(idRoles), url: urlDelete });
      });
    }
    setShowConfirmDialog(false);
  }

  return (
    <>
      <FormContainer
        title={dict.roles.form.delete_title}
        description={dict.roles.form.delete_description}
        state={state}
        isPending={isPending}
        formId="form-roles"
        onSubmit={form.handleSubmit(onSubmit)}
        action={dict.roles.form.action}
        confirm={dict.roles.form.confirm}
        href="/dashboard/roles"
        cancel={dict.roles.form.cancel}
        ariaLabelCon={dict.roles.management.action_delete}
        ariaLabelCancel={dict.roles.management.action_cancel}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8 space-y-6">
            <FieldGroup>
              {/* Nome */}
              <Controller
                name="nomeRoles"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{dict.roles.form.label.nameRole}:</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      autoComplete="off"
                      readOnly
                    />
                    {fieldState.invalid && fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </div>
      </FormContainer>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict.roles.form.confirm_title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dict.roles.form.confirm_description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingData(null)}>
              {dict.roles.form.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirm}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {dict.roles.form.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
