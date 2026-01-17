import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-orange-accent focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-warm-black text-warm-white hover:bg-warm-black/80',
        secondary:
          'border-transparent bg-warm-gray/10 text-warm-black hover:bg-warm-gray/20',
        destructive:
          'border-transparent bg-red-500 text-warm-white hover:bg-red-500/80',
        outline: 'text-warm-black border-warm-gray/30',
        success:
          'border-transparent bg-green-500/10 text-green-600',
        warning:
          'border-transparent bg-yellow-500/10 text-yellow-600',
        accent:
          'border-transparent bg-orange-accent/10 text-orange-accent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

