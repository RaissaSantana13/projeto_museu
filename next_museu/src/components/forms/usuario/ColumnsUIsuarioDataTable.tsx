'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, Trash } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { UsuarioResponse } from '../../../schemas/usuario-schemas';
import { ApiResponse, PageResponse } from '../../../type/api';
import { DictionaryType } from '../../../type/type';

export const getUsuarioColumns = (
  result: ApiResponse<PageResponse<UsuarioResponse>>,
  dict: DictionaryType,
): ColumnDef<UsuarioResponse>[] => {
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
          aria-label={dict.contact.management.select_all}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={dict.contact.management.select_row}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.usuario.form.label.name}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.usuario.form.label.email}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Status',
      cell: ({ row }) => {
        const ativo = row.getValue('active');
        return (
          <Badge variant={ativo ? 'default' : 'destructive'}>
            {ativo ? 'Ativo' : 'Inativo'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-center font-bold">
          {dict.usuario.management.action_list}
        </div>
      ),
      cell: ({ row }) => {
        const usuario = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            {/* Visualizar */}
            {canView && (
              <Button
                variant="outline"
                size="icon"
                asChild
                title={dict.usuario.form.consult_title}
                aria-label={dict.usuario.management.action_consult}
              >
                <Link
                  href={`/dashboard/usuario/${usuario.idUsuario}/consultar`}
                >
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
                title={dict.usuario.form.edit_title}
                aria-label={dict.usuario.management.action_edit}
              >
                <Link href={`/dashboard/usuario/${usuario.idUsuario}/editar`}>
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
                title={dict.usuario.form.delete_title}
                aria-label={dict.usuario.management.action_delete}
              >
                <Link href={`/dashboard/usuario/${usuario.idUsuario}/excluir`}>
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
