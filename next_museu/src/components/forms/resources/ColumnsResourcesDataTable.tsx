'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, Trash } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { ResourcesResponse } from '../../../schemas/resources-schemas';
import { ApiResponse, PageResponse } from '../../../type/api';
import { DictionaryType } from '../../../type/type';

export const getResourcesColumns = (
  result: ApiResponse<PageResponse<ResourcesResponse>>,
  dict: DictionaryType,
): ColumnDef<ResourcesResponse>[] => {
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
          aria-label={dict.resources.management.select_all}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={dict.resources.management.select_row}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'nomeResources',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.resources.form.label.nameResources}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: 'actions',
      header: () => (
        <div className="text-center font-bold">
          {dict.resources.management.action_list}
        </div>
      ),
      cell: ({ row }) => {
        const resources = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            {/* Visualizar */}
            {canView && (
              <Button
                variant="outline"
                size="icon"
                asChild
                title="Visualizar"
                aria-label={dict.resources.management.action_consult}
              >
                <Link
                  href={`/dashboard/resources/${resources.idResources}/consultar`}
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
                title={dict.resources.form.delete_title}
                aria-label={dict.resources.management.action_edit}
              >
                <Link
                  href={`/dashboard/resources/${resources.idResources}/editar`}
                >
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
                title={dict.resources.form.edit_title}
                aria-label={dict.resources.management.action_delete}
              >
                <Link
                  href={`/dashboard/resources/${resources.idResources}/excluir`}
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
