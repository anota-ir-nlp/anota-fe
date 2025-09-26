import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { Trash2, Download, RotateCcw } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DocumentResponse, DocumentStatus } from "@/types/api";

export function createColumns(
  getUserName: (userId: string) => string,
  handleDeleteDocument: (documentId: string) => void,
  handleExportDocument: (
    document: DocumentResponse,
    format: "parallel" | "m2"
  ) => void,
  handleReopenDocument: (document: DocumentResponse) => void
): ColumnDef<DocumentResponse>[] {
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
      accessorKey: "title",
      header: "Judul",
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return h(
          "span",
          {
            class: "font-semibold text-gray-900 truncate block max-w-96",
            title: title,
          },
          title || "N/A"
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "assigned_to",
      header: "Assigned To",
      cell: ({ row }) => {
        const assignedTo = (row.getValue("assigned_to") as string[]) || [];

        if (!assignedTo.length) {
          return h(
            "span",
            { class: "text-gray-400 text-sm" },
            "Belum ada assignment"
          );
        }

        return h(
          "div",
          { class: "flex flex-wrap gap-1" },
          assignedTo.map((userName) =>
            h(
              Badge,
              {
                key: userName,
                variant: "blue",
              },
              () => userName
            )
          )
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as DocumentStatus;

        const statusLabels: Record<DocumentStatus, string> = {
          belum_dianotasi: "Belum Dianotasi",
          sedang_dianotasi: "Sedang Dianotasi",
          sudah_dianotasi: "Sudah Dianotasi",
          belum_direview: "Belum Direview",
          sedang_direview: "Sedang Direview",
          sudah_direview: "Sudah Direview",
        };

        const statusVariants: Record<
          DocumentStatus,
          "default" | "secondary" | "destructive" | "outline"
        > = {
          belum_dianotasi: "destructive",
          sedang_dianotasi: "secondary",
          sudah_dianotasi: "default",
          belum_direview: "destructive",
          sedang_direview: "secondary",
          sudah_direview: "default",
        };

        return h(
          Badge,
          {
            variant: statusVariants[status] || "destructive",
            class: "text-xs",
          },
          () => statusLabels[status] || status
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Dibuat",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at") as string);
        return h(
          "span",
          { class: "text-gray-700" },
          date.toLocaleDateString("id-ID")
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const document = row.original;

        return h("div", { class: "flex gap-2 justify-end" }, [
          h(DropdownMenu, {}, () => [
            h(DropdownMenuTrigger, { asChild: true }, () =>
              h(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  class: "rounded-full px-4 py-1 font-semibold",
                },
                () => [h(Download, { class: "w-4 h-4 mr-1" }), "Export"]
              )
            ),
            h(DropdownMenuContent, { align: "end" }, () => [
              h(
                DropdownMenuItem,
                {
                  onClick: () => handleExportDocument(document, "parallel"),
                },
                () => "Export Parallel TSV"
              ),
              h(
                DropdownMenuItem,
                {
                  onClick: () => handleExportDocument(document, "m2"),
                },
                () => "Export M2 Format"
              ),
            ]),
          ]),
          h(
            Button,
            {
              size: "sm",
              variant: "outline",
              class: "rounded-full px-4 py-1 font-semibold",
              onClick: () => handleReopenDocument(document),
            },
            () => [h(RotateCcw, { class: "w-4 h-4 mr-1" }), "Reopen"]
          ),
          h(
            Button,
            {
              size: "sm",
              variant: "destructive",
              class: "rounded-full px-4 py-1 font-semibold",
              onClick: () => handleDeleteDocument(document.id.toString()),
            },
            () => [h(Trash2, { class: "w-4 h-4 mr-1" }), "Hapus"]
          ),
        ]);
      },
      enableSorting: false,
    },
  ];
}
