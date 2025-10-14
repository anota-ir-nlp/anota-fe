import { cva, type VariantProps } from "class-variance-authority";

export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600/15 text-blue-600 border-blue-500/30",
        secondary:
          "bg-slate-600/15 text-slate-600 border-slate-500/30",
        destructive:
          "bg-red-600/15 text-red-600 border-red-500/30",
        outline:
          "text-slate-900 border-slate-200 [a&]:hover:bg-slate-50 [a&]:hover:text-slate-900",
        blue: "bg-blue-600/15 text-blue-600 border-blue-500/30",
        green: "bg-green-600/15 text-green-600 border-green-500/30",
        purple: "bg-purple-600/15 text-purple-600 border-purple-500/30",
        yellow: "bg-yellow-600/15 text-yellow-600 border-yellow-500/30",
        gray: "bg-gray-600/15 text-gray-600 border-gray-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;
