import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-critical text-white",
        outline: "text-foreground",
        pending: "border-transparent bg-pending/10 text-pending",
        "in-progress": "border-transparent bg-in-progress/10 text-in-progress",
        resolved: "border-transparent bg-resolved/10 text-resolved",
        low: "border-transparent bg-low/10 text-low",
        medium: "border-transparent bg-medium/10 text-low",
        high: "border-transparent bg-high/10 text-high",
        critical: "border-transparent bg-critical/10 text-critical",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
