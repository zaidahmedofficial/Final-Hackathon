import { cn } from "@/lib/utils"
import type { StatusStep } from "@/types"

const steps = [
  { key: 0, label: "Pending", color: "bg-pending" },
  { key: 1, label: "In Progress", color: "bg-in-progress" },
  { key: 2, label: "Resolved", color: "bg-resolved" },
]

interface StatusStepperProps {
  status: "Pending" | "In Progress" | "Resolved"
}

export function StatusStepper({ status }: StatusStepperProps) {
  const statusToStep: Record<string, number> = {
    Pending: 0,
    "In Progress": 1,
    Resolved: 2,
  }
  const activeStep = statusToStep[status] ?? 0

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, idx) => {
        const isActive = idx <= activeStep
        const isCurrent = idx === activeStep
        return (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  isActive ? step.color : "bg-muted"
                )}
              />
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-1",
                    isActive ? "bg-muted-foreground/30" : "bg-muted"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "mt-1.5 text-xs font-medium",
                isCurrent ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
