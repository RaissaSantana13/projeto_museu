'use client';

import { atualizarPermissionsMatrizAction } from '@/actions/permissions/atualizar-matriz-permissions-actions';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Box,
  Calendar,
  Camera,
  Check,
  Contact2Icon,
  Loader2,
  Lock,
  LockIcon,
  Save,
  ShieldCheck,
  ShieldUser,
  User,
  X,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import {
  PermissionsMatrizCreate,
  PermissionsResponse
} from '../../../schemas/permissions-schemas';
import { ResourcesMatrizResponse } from '../../../schemas/resources-schemas';
import { useDictionary } from '../../../service/providers/i18n-providers';
import { useResources } from '../../../service/providers/resource-providers';
import { ApiResponse } from '../../../type/api';
import { Button } from '../../ui/button';

const initialState: ApiResponse<PermissionsResponse> = {
  status: 0,
  mensagem: '',
  erro: null,
  dados: undefined,
  errors: undefined,
};

interface PermissionMatrixFormProps {
  resources: ResourcesMatrizResponse[];
}

export default function PermissionMatrixForm({
  resources,
}: PermissionMatrixFormProps) {
  const dict = useDictionary();
  const { getEndpoint } = useResources();
  const nav = dict.navigation;

  //Mapped {/api/v1/permissions/sync/:roleId, POST}

  const baseEndpoint = getEndpoint('permissions');
  const urlSync = baseEndpoint ? `${baseEndpoint}/sync` : undefined;

  const iconResources = [
    { id: 'dashboard', label: nav.dashboards, icon: ShieldCheck },
    { id: 'usuario', label: nav.usuario.usuario, icon: User },
    { id: 'contato', label: nav.contato.contato, icon: Contact2Icon },
    { id: 'evento', label: nav.eventos, icon: Calendar },
    { id: 'roles', label: nav.roles.roles, icon: ShieldUser },
    { id: 'permissions', label: nav.permissions.permissions, icon: LockIcon },
    { id: 'resources', label: nav.resources.resources, icon: Box },
    { id: 'fotos', label: 'Fotos', icon: Camera },
  ];

  const actions = [
    { id: 'read', label: dict.permissions.management.enums.action.read },
    { id: 'create', label: dict.permissions.management.enums.action.create },
    { id: 'update', label: dict.permissions.management.enums.action.update },
    { id: 'delete', label: dict.permissions.management.enums.action.delete },
  ];

  const [state, action, isPending] = React.useActionState(
    atualizarPermissionsMatrizAction,
    initialState,
  );

  const infoRole = {
    nome: resources[0]?.nomeRole || 'N/A',
    id: resources[0]?.roleId,
  };

  const [matrix, setMatrix] = React.useState<
    Record<number, Record<string, boolean>>
  >(() => {
    const initialState: Record<number, Record<string, boolean>> = {};

    resources.forEach((res: any) => {
      initialState[res.idResources] = {
        create: res.acoesAtivas.includes('create'),
        read: res.acoesAtivas.includes('read'),
        update: res.acoesAtivas.includes('update'),
        delete: res.acoesAtivas.includes('delete'),
      };
    });

    return initialState;
  });

  React.useEffect(() => {
    if (state.status === 200 || state.status === 201) {
      toast.success(state.mensagem);
    } else if (state.erro) {
      toast.error(state.mensagem);
    }
  }, [state]);

  const getResourceConfig = (nomeBanco: string) => {
    const normalized = nomeBanco
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    return iconResources.find(
      (item) =>
        normalized.startsWith(item.id) || item.id.startsWith(normalized),
    );
  };

  const handleSave = async () => {
    const permissionsMatrizCreate: PermissionsMatrizCreate[] = [];
    for (const [resId, actionsObj] of Object.entries(matrix)) {
      for (const [actionName, isSelected] of Object.entries(actionsObj)) {
        if (isSelected) {
          permissionsMatrizCreate.push({
            roleId: infoRole.id,
            resourceId: Number(resId),
            action: actionName,
            possession: 'any',
          });
        }
      }
    }

    const url = urlSync;

    if (!url) {
      return toast.error(dict.app.endpoint.api_resources);
    }
    React.startTransition(() => {
      action({
        roleId: infoRole.id,
        permissionsMatrizCreate,
        url,
      });
    });
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {dict.permissions.management.matrix_permissions}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20"
          >
            Perfil: {infoRole.nome}
          </Badge>
          <Button
            onClick={handleSave}
            disabled={isPending }
            size="sm"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[300px]">
              {dict.permissions.management.resources} /{' '}
              {dict.permissions.management.module}
            </TableHead>
            {actions.map((action) => (
              <TableHead key={action.id} className="text-center">
                {action.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => {
            const config = getResourceConfig(resource.nomeResources);
            const Icon = config?.icon || Box; // Fallback para Box
            const label = config?.label || resource.nomeResources; // Fallback para o nome do banco

            return (
              <TableRow
                key={resource.idResources}
                className="hover:bg-accent/5"
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span>{label}</span>
                  </div>
                </TableCell>

                {actions.map((action) => (
                  <TableCell
                    key={`${resource.idResources}-${action.id}`}
                    className="text-center"
                  >
                    <div className="flex justify-center">
                      <Checkbox
                        checked={
                          matrix[resource.idResources]?.[action.id] || false
                        }
                        onCheckedChange={(checked) => {
                          setMatrix((prev) => ({
                            ...prev,
                            [resource.idResources]: {
                              ...prev[resource.idResources],
                              [action.id]: !!checked,
                            },
                          }));
                        }}
                        //disabled={infoRole.nome === 'Administrador'}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="p-4 bg-muted/20 border-t text-xs text-muted-foreground flex justify-between">
        <span>{dict.permissions.management.message_permissions}</span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-[#3A2F25]" />{' '}
            {dict.permissions.management.matrix_allowed}
          </div>
          <div className="flex items-center gap-1">
            <X className="h-3 w-3 text-red-500" />{' '}
            {dict.permissions.management.matrix_denied}
          </div>
        </div>
      </div>
    </div>
  );
}
