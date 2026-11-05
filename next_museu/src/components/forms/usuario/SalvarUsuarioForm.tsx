"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useActionState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { RolesResponse } from "@/schemas/roles-schemas";
import { z } from "zod";
import { salvarUsuarioAction } from "../../../actions/usuario/salvar-usuario-actions";
import {
  getUsuarioCreateFormSchema,
  UsuarioCreate,
  UsuarioCreateForm,
  UsuarioResponse,
} from "../../../schemas/usuario-schemas";
import { useDictionary } from "../../../service/providers/i18n-providers";
import { useResources } from "../../../service/providers/resource-providers";
import { ApiResponse } from "../../../type/api";
import { UploadAvatar } from "../../shared/crop/upload-avatar";
import { Field, FieldError, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { FormContainer } from "../form-layout";
import { getRoleColumns } from "../roles/columnsRoles";
import { UniversalPicker } from "./UniversalPicket";

const initialState: ApiResponse<UsuarioResponse> = {
  status: 0,
  mensagem: "",
  erro: null,
  dados: undefined,
  errors: undefined,
};

interface SalvarUsuarioRolesFormProps {
  roles: RolesResponse[];
}

export default function SalvarUsuarioForm({
  roles,
}: SalvarUsuarioRolesFormProps) {
  const [serverState, action, isPending] = useActionState(
    salvarUsuarioAction,
    initialState,
  );

  const dict = useDictionary();
  const roleColumns = getRoleColumns(dict);
  const { getEndpoint } = useResources();
  const urlCreate = getEndpoint("usuario");

  const createSchema = getUsuarioCreateFormSchema(dict);
  const form = useForm<
    z.input<typeof createSchema>,
    unknown,
    UsuarioCreateForm
  >({
    resolver: zodResolver(createSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      imagePath: "",
      password: "",
      confirmPassword: "",
      roleIds: [],
    },
  });

  const { status, mensagem, erro, errors } = serverState;

  React.useEffect(() => {
    if (status === 0 || (!mensagem && !erro)) return;

    if (status >= 400) {
      toast.error("Erro", { description: erro || mensagem });
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          form.setError(field as keyof UsuarioCreate, {
            type: "server",
            message: messages?.[0],
          });
        });
      }
    } else {
      toast.success("Sucesso!", { description: mensagem });
    }
  }, [status, mensagem, errors, erro, form]);

  function onSubmit(data: UsuarioCreateForm) {
    if (!urlCreate) {
      return toast.error(dict.app.endpoint.api_resources);
    }

    React.startTransition(async () => {
      action({
        usuarioCreate: data,
        url: urlCreate,
      });
    });
  }

  React.useEffect(() => {
    form.register("imagePath");
  }, [form]);

  const rolesPickerData = roles.map((role) => ({
    ...role,
    id: role.idRoles,
  }));

  return (
    <FormContainer
      title={dict.usuario.form.create_title}
      description={dict.usuario.form.create_description}
      state={serverState}
      isPending={isPending}
      formId="form-usuario"
      onSubmit={form.handleSubmit(onSubmit)}
      action={dict.usuario.form.action}
      confirm={dict.usuario.form.confirm}
      href="/dashboard/usuario"
      cancel={dict.usuario.form.cancel}
      ariaLabelCon={dict.usuario.management.action_new}
      ariaLabelCancel={dict.usuario.management.action_cancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
        <div className="md:col-span-8 space-y-6">
          {/* GRID INTERNA DE 3 COLUNAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primeiro Nome */}
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.usuario.form.label.firstName}:</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder={dict.usuario.form.label.placeHolderFirstName}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Último Nome */}
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.usuario.form.label.lastName}:</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder={dict.usuario.form.label.placeHolderLastName}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Username */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.usuario.form.label.name}:</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder={dict.usuario.form.label.placeHolderName}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Email - md:col-span-3 faz ele ocupar a linha toda se desejar, ou deixe 1 p/ manter 3 por linha */}
            <div className="md:col-span-1">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{dict.usuario.form.label.email}:</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      value={field.value ?? ""}
                      placeholder={dict.usuario.form.label.placeHolderEmail}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Senha */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{dict.usuario.form.label.password}:</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    value={field.value ?? ""}
                    placeholder="******"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Confirmar Senha */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    {dict.usuario.form.label.confirmPassword}:
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    value={field.value ?? ""}
                    placeholder="******"
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Role Picker - Ocupando as 3 colunas para ter espaço para a tabela/badges */}
            <div className="md:col-span-3 pt-4">
              <Controller
                name="roleIds"
                control={form.control}
                render={({ field, fieldState }) => {
                  const selectedIds = field.value?.map(String) || [];
                  const handleSelectionChange = (ids: string[]) =>
                    field.onChange(ids.map(Number));
                  const selectedRolesNames = roles
                    .filter((r) => field.value?.includes(r.idRoles))
                    .map((r) => r.nomeRoles);

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Atribuir Roles:</FieldLabel>
                      <div className="flex flex-col gap-3">
                        <UniversalPicker
                          title="Selecionar Roles"
                          data={rolesPickerData}
                          columns={roleColumns}
                          selectedIds={selectedIds}
                          onSelectionChange={handleSelectionChange}
                        />
                        <div className="flex flex-wrap gap-2">
                          {selectedRolesNames.length > 0 ? (
                            selectedRolesNames.map((name) => (
                              <span
                                key={name}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20"
                              >
                                {name}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Nenhuma role selecionada.
                            </span>
                          )}
                        </div>
                      </div>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </div>
        </div>

        {/* Coluna do Avatar */}
        <div className="md:col-span-4 flex flex-col items-center justify-start pt-8">
          <UploadAvatar
            type="usuarios"
            onChange={(url) => form.setValue("imagePath", url ?? "")}
          />
        </div>
      </div>
    </FormContainer>
  );
}
