import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default:
          'animated-gradient-btn-greenblue text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0',
        destructive:
          'btn-gradient-danger text-white shadow-lg hover:shadow-xl focus-visible:ring-red-500/20',
        outline:
          'border-2 bg-white/90 border-gray-300 text-gray-700 shadow-xs hover:bg-white hover:border-blue-500 hover:text-blue-600 backdrop-filter backdrop-blur-sm transition-all duration-200',
        secondary:
          'btn-gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-200',
        ghost:
          'hover:bg-gray-100 hover:text-gray-900 text-gray-700 transition-all duration-200',
        link: 'text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 transition-colors',
        gradient:
          'animated-gradient-btn-pinkblue text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0',
        success:
          'btn-gradient-success text-white shadow-lg hover:shadow-xl transition-all duration-200',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        xl: 'h-12 rounded-full px-10 py-4 text-lg font-bold',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
