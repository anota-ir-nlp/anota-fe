import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { UserResponse } from '@/types/api'

export function createUserColumns(
  handleEditUser: (user: UserResponse) => void,
  handleDeleteUser: (user: UserResponse) => void
): ColumnDef<UserResponse>[] {
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
      accessorKey: 'full_name',
      header: 'Nama',
      cell: ({ row }) => {
        const name = row.getValue('full_name') as string
        return h('span', {
          class: 'font-semibold text-white text-left'
        }, name || 'N/A')
      },
      enableSorting: false,
    },
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => {
        const username = row.getValue('username') as string
        return h('span', { class: 'text-white text-left' }, username || 'N/A')
      },
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.getValue('email') as string
        return h('span', { class: 'text-white text-left' }, email || 'N/A')
      },
      enableSorting: false,
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = (row.getValue('roles') as string[]) || []

        if (!roles.length) {
          return h('span', { class: 'text-gray-400 text-sm' }, 'Tidak ada role')
        }

        return h('div', { class: 'flex flex-wrap gap-1' },
          roles.map(role =>
            h(Badge, {
              key: role,
              variant: 'blue',
              class: 'font-semibold'
            }, () => role)
          )
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'date_joined',
      header: 'Tanggal Bergabung',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date_joined') as string)
        return h('span', { class: 'text-white text-left' }, date.toLocaleDateString('id-ID'))
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: '',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

        return h('div', { class: 'flex gap-2 justify-end' }, [
          h(Button, {
            size: 'sm',
            variant: 'outline',
            class: 'rounded-full px-4 py-1 font-semibold',
            onClick: () => handleEditUser(user)
          }, () => [
            h(Pencil, { class: 'w-4 h-4 mr-1' }),
            'Edit'
          ]),
          h(Button, {
            size: 'sm',
            variant: 'destructive',
            class: 'rounded-full px-4 py-1 font-semibold',
            onClick: () => handleDeleteUser(user)
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
