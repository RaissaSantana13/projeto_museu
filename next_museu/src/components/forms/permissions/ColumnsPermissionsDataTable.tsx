'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, Trash } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { PermissionsResponse } from '../../../schemas/permissions-schemas';
import { ApiResponse, PageResponse } from '../../../type/api';
import { DictionaryType } from '../../../type/type';

export const getPermissionsColumns = (
  result: ApiResponse<PageResponse<PermissionsResponse>>,
  dict: DictionaryType,
): ColumnDef<PermissionsResponse>[] => {
  const canView = !!result._links?.self || !!result._links?.list;
  const canUpdate = !!result._links?.update;
  const canDelete = !!result._links?.delete;

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="selecionar tudo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="selecionar a linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'role.nomeRoles',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.permissions.form.label.roleId}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.role?.nomeRoles}</div>,
    },
    {
      accessorKey: 'resource.nomeResources',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.permissions.form.label.resourceId}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.resource?.nomeResources}</div>,
    },
    {
      accessorKey: 'action',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.permissions.form.label.action}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'possession',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.permissions.form.label.possession}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-center font-bold">Ações</div>,
      cell: ({ row }) => {
        const permissions = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            {/* Visualizar */}
            {canView && (
              <Button variant="outline" size="icon" asChild title="Visualizar">
                <Link
                  href={`/dashboard/permissions/${permissions.idPermissions}/consultar`}
                >
                  <Eye className="h-4 w-4 text-blue-800" />
                </Link>
              </Button>
            )}

            {/* Editar */}
            {canUpdate && (
              <Button variant="outline" size="icon" asChild title="Editar">
                <Link
                  href={`/dashboard/permissions/${permissions.idPermissions}/editar`}
                >
                  <Edit className="h-4 w-4 text-[#3A2F25]" />
                </Link>
              </Button>
            )}

            {/* Excluir */}
            {canDelete && (
              <Button variant="outline" size="icon" asChild title="Excluir">
                <Link
                  href={`/dashboard/permissions/${permissions.idPermissions}/excluir`}
                >
                  <Trash className="h-4 w-4 text-red-800" />
                </Link>
              </Button>
            )}
          </div>
        );
      },
    },
  ];
};
