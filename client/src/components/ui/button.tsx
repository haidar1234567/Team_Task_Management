import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-500 shadow-button-primary border border-blue-500",
        outline: "border border-white/10 bg-transparent hover:bg-white/5 text-foreground shadow-sm",
        ghost: "hover:bg-white/5 text-foreground",
        soft: "bg-white/[0.04] text-foreground border border-white/5 hover:bg-white/[0.08] shadow-sm",
        danger: "bg-red-600 text-white hover:bg-red-500 shadow-button-primary border border-red-500",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

type MotionButtonProps = HTMLMotionProps<"button"> & ButtonProps & { asChild?: boolean };

const Button = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <motion.button
        whileTap={{ scale: props.disabled ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span className="flex items-center gap-2">{props.children}</span>
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
