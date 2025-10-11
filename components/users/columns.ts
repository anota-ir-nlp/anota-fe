import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Pencil, Trash2, KeyRound } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { UserResponse } from '@/types/api'

export function createUserColumns(
  handleEditUser: (user: UserResponse) => void,
  handleDeleteUser: (user: UserResponse) => void,
  handleResetPassword: (user: UserResponse) => void,
  getAdminProjectAssignment?: (userId: string) => string | null
): ColumnDef<UserResponse>[] {
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
      accessorKey: 'full_name',
      header: 'Nama',
      cell: ({ row }) => {
        const name = row.getValue('full_name') as string
        return h('span', {
          class: 'font-semibold text-gray-900 text-left'
        }, name || 'N/A')
      },
      enableSorting: false,
    },
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => {
        const username = row.getValue('username') as string
        return h('span', { class: 'text-gray-700 text-left' }, username || 'N/A')
      },
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.getValue('email') as string
        return h('span', { class: 'text-gray-700 text-left' }, email || 'N/A')
      },
      enableSorting: false,
    },
    {
      accessorKey: 'institution',
      header: 'Institusi',
      cell: ({ row }) => {
        const institution = row.getValue('institution') as string
        return h('span', { class: 'text-gray-700 text-left' }, institution || '-')
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
      id: 'project_assignment',
      header: 'Project Assignment',
      cell: ({ row }) => {
        const user = row.original
        
        // Only show project assignment for Admin users
        if (!user.roles.includes('Admin')) {
          return h('span', { class: 'text-gray-400 text-sm' }, '-')
        }

        if (!getAdminProjectAssignment) {
          return h('span', { class: 'text-gray-400 text-sm' }, '-')
        }

        const projectName = getAdminProjectAssignment(user.id)
        
        if (!projectName) {
          return h('span', { class: 'text-gray-500 text-sm italic' }, 'Belum ditugaskan')
        }

        return h(Badge, {
          variant: 'outline',
          class: 'text-xs'
        }, () => projectName)
      },
      enableSorting: false,
    },
    {
      accessorKey: 'date_joined',
      header: 'Tanggal Bergabung',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date_joined') as string)
        return h('span', { class: 'text-gray-700 text-left' }, date.toLocaleDateString('id-ID'))
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
            variant: 'secondary',
            class: 'rounded-full px-4 py-1 font-semibold',
            onClick: () => handleResetPassword(user)
          }, () => [
            h(KeyRound, { class: 'w-4 h-4 mr-1' }),
            'Reset Password'
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
