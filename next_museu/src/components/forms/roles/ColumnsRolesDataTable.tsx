'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, ShieldUser, Trash } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { RolesResponse } from '../../../schemas/roles-schemas';
import { ApiResponse, PageResponse } from '../../../type/api';
import { DictionaryType } from '../../../type/type';

export const getRolesColumns = (
  result: ApiResponse<PageResponse<RolesResponse>>,
  dict: DictionaryType,
): ColumnDef<RolesResponse>[] => {
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
          aria-label={dict.roles.management.select_all}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={dict.roles.management.select_row}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'nomeRoles',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.roles.form.label.nameRole}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-center font-bold">
          {dict.roles.management.action_list}
        </div>
      ),
      cell: ({ row }) => {
        const roles = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            {/* Visualizar */}
            {canView && (
              <Button
                variant="outline"
                size="icon"
                asChild
                title="Visualizar"
                aria-label={dict.roles.management.action_consult}
              >
                <Link href={`/dashboard/roles/${roles.idRoles}/consultar`}>
                  <Eye className="h-4 w-4 text-blue-800" />
                </Link>
              </Button>
            )}

            {/* Editar */}
            {canUpdate && (
              <Button
                variant="outline"
                size="icon"
                asChild
                title={dict.roles.form.delete_title}
                aria-label={dict.roles.management.action_edit}
              >
                <Link href={`/dashboard/roles/${roles.idRoles}/editar`}>
                  <Edit className="h-4 w-4 text-[#3A2F25]" />
                </Link>
              </Button>
            )}

            {/* Excluir */}
            {canDelete && (
              <Button
                variant="outline"
                size="icon"
                asChild
                title={dict.roles.form.edit_title}
                aria-label={dict.roles.management.action_delete}
              >
                <Link href={`/dashboard/roles/${roles.idRoles}/excluir`}>
                  <Trash className="h-4 w-4 text-red-800" />
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              asChild
              title={dict.roles.form.delete_title}
              aria-label={dict.roles.management.action_delete}
            >
              <Link href={`/dashboard/permissions/${roles.idRoles}/manager`}>
                <ShieldUser className="h-4 w-4 text-purple-950" />
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
};
