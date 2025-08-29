import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { DocumentResponse } from '@/types/api'

export function createColumns(
  getUserName: (userId: string) => string,
  handleDeleteDocument: (documentId: string) => void
): ColumnDef<DocumentResponse>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => h(Checkbox, {
        'modelValue': table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all',
        'class': 'w-5 h-5 bg-white/10 backdrop-blur-sm border-2 border-white/60 hover:border-white transition-colors data-[state=checked]:bg-white/80 data-[state=checked]:border-white data-[state=checked]:backdrop-blur-sm shadow-lg'
      }),
      cell: ({ row }) => h(Checkbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | "indeterminate") => row.toggleSelected(!!value),
        'ariaLabel': 'Select row',
        'class': 'w-5 h-5 bg-white/10 backdrop-blur-sm border-2 border-white/60 hover:border-white transition-colors data-[state=checked]:bg-white/80 data-[state=checked]:border-white data-[state=checked]:backdrop-blur-sm shadow-lg'
      }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: 'Judul',
      cell: ({ row }) => {
        const title = row.getValue('title') as string
        return h('span', {
          class: 'font-semibold text-white truncate block max-w-96',
          title: title
        }, title || 'N/A')
      },
      enableSorting: false,
    },
    {
      accessorKey: 'assigned_to',
      header: 'Assigned To',
      cell: ({ row }) => {
        const assignedTo = (row.getValue('assigned_to') as number[]) || []

        if (!assignedTo.length) {
          return h('span', { class: 'text-gray-400 text-sm' }, 'Belum ada assignment')
        }

        return h('div', { class: 'flex flex-wrap gap-1' },
          assignedTo.map(userId =>
            h(Badge, {
              key: userId,
              variant: 'blue'
            }, () => getUserName(userId.toString()))
          )
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: 'Tanggal Dibuat',
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at') as string)
        return h('span', { class: 'text-white' }, date.toLocaleDateString('id-ID'))
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: '',
      enableHiding: false,
      cell: ({ row }) => {
        const document = row.original

        return h('div', { class: 'flex gap-2 justify-end' }, [
          h(Button, {
            size: 'sm',
            variant: 'destructive',
            class: 'rounded-full px-4 py-1 font-semibold',
            onClick: () => handleDeleteDocument(document.id.toString())
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
