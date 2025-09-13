import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { ErrorTypeResponse } from '@/types/api'

export function createErrorTypeColumns(
  handleEditErrorType: (errorType: ErrorTypeResponse) => void,
  handleDeleteErrorType: (id: number) => void
): ColumnDef<ErrorTypeResponse>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => h(Checkbox, {
        'modelValue': table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all',
      }),
      cell: ({ row }) => h(Checkbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | "indeterminate") => row.toggleSelected(!!value),
        'ariaLabel': 'Select row',
      }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'error_code',
      header: 'Error Code',
      cell: ({ row }) => {
        const errorCode = row.getValue('error_code') as string
        return h('span', {
          class: 'font-semibold text-gray-900 text-left w-64 truncate block',
          title: errorCode
        }, errorCode || 'N/A')
      },
      enableSorting: false,
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
      cell: ({ row }) => {
        const description = row.getValue('description') as string
        return h('span', { 
          class: 'text-gray-700 text-left'
        }, description || 'N/A')
      },
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: 'Tanggal Dibuat',
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at') as string)
        return h('span', { class: 'text-gray-700 text-left' }, date.toLocaleDateString('id-ID'))
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: '',
      enableHiding: false,
      cell: ({ row }) => {
        const errorType = row.original

        return h('div', { class: 'flex gap-2 justify-end' }, [
          h(Button, {
            size: 'sm',
            variant: 'outline',
            class: 'rounded-full px-4 py-1 font-semibold',
            onClick: () => handleEditErrorType(errorType)
          }, () => [
            h(Pencil, { class: 'w-4 h-4 mr-1' }),
            'Edit'
          ]),
          h(Button, {
            size: 'sm',
            variant: 'destructive',
            class: 'rounded-full px-4 py-1 font-semibold',
            onClick: () => handleDeleteErrorType(errorType.id)
          }, () => [
            h(Trash2, { class: 'w-4 h-4 mr-1' }),
            'Hapus'
          ])
        ])
      },
      enableSorting: false,
    },
  ]
}
