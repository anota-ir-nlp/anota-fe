import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import { Badge } from "~/components/ui/badge";
import type { DocumentResponse, DocumentStatus } from "~/types/api";

export function createDocumentColumns(
  selectedDocumentId: string | null,
  onDocumentSelect: (documentId: string) => void
): ColumnDef<DocumentResponse>[] {
  return [
    {
      id: "select",
      header: "Pilih",
      cell: ({ row }) => {
        const document = row.original;
        const isSelected = selectedDocumentId === document.id.toString();
        
        return h(
          "input",
          {
            type: "radio",
            name: "document-selection",
            checked: isSelected,
            onChange: () => onDocumentSelect(document.id.toString()),
            class: "w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          }
        );
      },
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as DocumentStatus;
        
        const statusConfig = {
          belum_dianotasi: { label: "Belum Dianotasi", variant: "gray" as const },
          sedang_dianotasi: { label: "Sedang Dianotasi", variant: "blue" as const },
          sudah_dianotasi: { label: "Sudah Dianotasi", variant: "green" as const },
          belum_direview: { label: "Belum Direview", variant: "orange" as const },
          sedang_direview: { label: "Sedang Direview", variant: "purple" as const },
          sudah_direview: { label: "Sudah Direview", variant: "emerald" as const },
        };
        
        const config = statusConfig[status] || { label: status, variant: "gray" as const };
        
        return h(
          Badge,
          {
            variant: config.variant,
          },
          () => config.label
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Dibuat",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return new Date(date).toLocaleDateString("id-ID");
      },
      enableSorting: false,
    },
  ];
}