import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { Pencil, Trash2, KeyRound } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { UserResponse } from "@/types/api";

export function createUserColumns(
  handleEditUser: (user: UserResponse) => void,
  handleDeleteUser: (user: UserResponse) => void,
  handleResetPassword: (user: UserResponse) => void,
  getAllUserRoles?: (userId: string) => string[],
  options?: {
    showProjectAssignment?: boolean;
    getProjectAssignments?: (userId: string, userRoles: string[]) => string[];
  }
): ColumnDef<UserResponse>[] {
  return [
    {
      id: "select",
      header: ({ table }) =>
        h(Checkbox, {
          modelValue: table.getIsAllPageRowsSelected(),
          "onUpdate:modelValue": (value: boolean | "indeterminate") =>
            table.toggleAllPageRowsSelected(!!value),
          ariaLabel: "Select all",
        }),
      cell: ({ row }) =>
        h(Checkbox, {
          modelValue: row.getIsSelected(),
          "onUpdate:modelValue": (value: boolean | "indeterminate") =>
            row.toggleSelected(!!value),
          ariaLabel: "Select row",
        }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "full_name",
      header: "Nama",
      cell: ({ row }) => {
        const name = row.getValue("full_name") as string;
        return h(
          "span",
          {
            class: "font-semibold text-gray-900 text-left",
          },
          name || "N/A"
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const username = row.getValue("username") as string;
        return h(
          "span",
          { class: "text-gray-700 text-left" },
          username || "N/A"
        );
      },
      enableSorting: false,
    },
    // Email column removed - not available in available-users endpoint
    {
      accessorKey: "institusi",
      header: "Institusi",
      cell: ({ row }) => {
        const institusi = (row.getValue("institusi") as string) || (row.original.institution as string);
        return h(
          "span",
          { class: "text-gray-700 text-left" },
          institusi || "-"
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "roles",
      header: "Roles (Project)",
      cell: ({ row }) => {
        const user = row.original;
        
        // Show Kepala Riset badge if user is kepala riset
        if (user.is_kepala_riset) {
          return h(
            Badge,
            {
              variant: "purple",
              class: "font-semibold",
            },
            () => "Kepala Riset"
          );
        }

        // Get aggregated roles from all projects if function is available
        let roles = (row.getValue("roles") as string[]) || [];
        if (getAllUserRoles && roles.length === 0) {
          roles = getAllUserRoles(user.id);
        }

        if (!roles.length) {
          return h(
            "span",
            { class: "text-gray-400 text-sm italic" },
            "Belum ada role"
          );
        }

        // Sort roles for consistent display: Admin, Annotator, Reviewer
        const sortedRoles = [...roles].sort((a, b) => {
          const order = { Admin: 1, Annotator: 2, Reviewer: 3 };
          return (order[a as keyof typeof order] || 99) - (order[b as keyof typeof order] || 99);
        });

        return h(
          "div",
          { class: "flex flex-wrap gap-1" },
          sortedRoles.map((role) =>
            h(
              Badge,
              {
                key: role,
                variant: role === "Admin" ? "blue" : role === "Annotator" ? "green" : "yellow",
                class: "font-semibold",
              },
              () => role
            )
          )
        );
      },
      enableSorting: false,
    },
    // Conditionally include Project Assignment column only for Kepala Riset
    ...(options?.showProjectAssignment && options?.getProjectAssignments ? [{
      id: 'project_assignment',
      header: 'Project Assignment',
      cell: ({ row }: { row: any }) => {
        const user = row.original
        
        // Show project assignment for Admin, Annotator, and Reviewer users
        if (!user.roles.some((role: string) => ['Admin', 'Annotator', 'Reviewer'].includes(role))) {
          return h('span', { class: 'text-gray-400 text-sm' }, '-')
        }

        const projectNames = options.getProjectAssignments!(user.id, user.roles)
        
        if (!projectNames || projectNames.length === 0) {
          return h('span', { class: 'text-gray-500 text-sm italic' }, 'Belum ditugaskan')
        }

        // If only one project, show as single badge
        if (projectNames.length === 1) {
          return h(Badge, {
            variant: 'outline',
            class: 'text-xs'
          }, () => projectNames[0])
        }

        // If multiple projects, show as multiple badges
        return h('div', { class: 'flex flex-wrap gap-1' }, 
          projectNames.map((projectName: string) =>
            h(Badge, {
              key: projectName,
              variant: 'outline',
              class: 'text-xs'
            }, () => projectName)
          )
        )
      },
      enableSorting: false,
    }] : []),
    // Tanggal Bergabung column removed - not available in available-users endpoint
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return h("div", { class: "flex gap-2 justify-end" }, [
          h(
            Button,
            {
              size: "sm",
              variant: "outline",
              class: "px-4 py-1 font-semibold",
              onClick: () => handleEditUser(user),
            },
            () => [h(Pencil, { class: "w-4 h-4 mr-1" }), "Edit"]
          ),
          h(
            Button,
            {
              size: "sm",
              variant: "secondary",
              class: "px-4 py-1 font-semibold",
              onClick: () => handleResetPassword(user),
            },
            () => [h(KeyRound, { class: "w-4 h-4 mr-1" }), "Reset Password"]
          ),
          h(
            Button,
            {
              size: "sm",
              variant: "destructive",
              class: "px-4 py-1 font-semibold",
              onClick: () => handleDeleteUser(user),
            },
            () => [h(Trash2, { class: "w-4 h-4 mr-1" }), "Hapus"]
          ),
        ]);
      },
      enableSorting: false,
    },
  ];
}
