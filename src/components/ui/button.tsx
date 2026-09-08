import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans transition-colors disabled:pointer-events-none disabled:opacity-35 select-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        solid: 'bg-ink text-paper hover:bg-ink/90',
        outline: 'border border-rule-strong text-ink hover:bg-paper-edge',
        ghost: 'text-ink-muted hover:text-ink hover:bg-paper-edge',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-sm',
        icon: 'size-11 rounded-full',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
)

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
