'use client';

import {
  ColumnDef,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { SectionReveal } from '../motion/section-reveal';
import { DataTablePagination } from './pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  selectedIds?: Record<string, boolean>;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onParamsChange?: (
    pageIndex: number,
    pageSize: number,
    field?: string,
    order?: 'ASC' | 'DESC',
  ) => void;
  field?: string;
  order?: string;
  onSelectionChange?: OnChangeFn<RowSelectionState>;
  children?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  selectedIds,
  pageCount,
  pageIndex,
  pageSize,
  onParamsChange,
  field,
  order,
  onSelectionChange,
  children,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(
    field ? [{ id: field, desc: order === 'DESC' }] : [],
  );
  const [internalPagination, setInternalPagination] = React.useState({
    pageIndex: pageIndex ?? 0,
    pageSize: pageSize ?? 5,
  });
  //const [rowSelection, setRowSelection] = React.useState({});
  const [internalSelection, setInternalSelection] =
    React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState<string>('');

  React.useEffect(() => {
    setInternalPagination({
      pageIndex: pageIndex ?? 0,
      pageSize: pageSize ?? 5,
    });
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    state: {
      pagination: internalPagination,
      sorting,
      rowSelection: selectedIds !== undefined ? selectedIds : internalSelection,
      globalFilter,
    },
    manualPagination: true,
    manualSorting: true,
    pageCount: pageCount,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const nextState =
        typeof updater === 'function' ? updater(internalPagination) : updater;
      setInternalPagination(nextState);
      const currentSort = sorting[0];
      onParamsChange?.(
        nextState.pageIndex,
        nextState.pageSize,
        currentSort?.id,
        currentSort?.desc ? 'DESC' : 'ASC',
      );
      if (onParamsChange) {
        onParamsChange(nextState.pageIndex, nextState.pageSize);
      }
    },
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(nextSorting);
      const sort = nextSorting[0];
      onParamsChange?.(
        0,
        internalPagination.pageSize,
        sort?.id,
        sort?.desc ? 'DESC' : 'ASC',
      );
    },
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: onSelectionChange ?? setInternalSelection,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = String(row.getValue(columnId)).toLowerCase();
      return value.includes(filterValue.toLowerCase());
    },
    getRowId: (row: any) => row.id || row._id,
  });

  return (
    <SectionReveal>
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Pesquisa"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">{children}</div>
      </div>
      <div className="grid gap-4 md:hidden">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <Card key={row.id}>
              <CardContent className="space-y-3 p-4">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id}>
                    <p className="text-xs text-muted-foreground">
                      {typeof cell.column.columnDef.header === 'string'
                        ? cell.column.columnDef.header
                        : cell.column.id}
                    </p>
                    <div className="font-medium">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            Sem Registros ....
          </p>
        )}
      </div>
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto overflow-hidden rounded-md border">
          <Table className="min-w-[800px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getCoreRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sem Registros ....
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <DataTablePagination table={table} />
      </div>
    </SectionReveal>
  );
}
