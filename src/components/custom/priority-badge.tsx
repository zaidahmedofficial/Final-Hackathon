import { Badge } from "@/components/ui/badge"

interface PriorityBadgeProps {
  priority: "Low" | "Medium" | "High" | "Critical"
}

const priorityConfig = {
  Low: { variant: "low" as const, dotColor: "bg-low" },
  Medium: { variant: "medium" as const, dotColor: "bg-medium" },
  High: { variant: "high" as const, dotColor: "bg-high" },
  Critical: { variant: "critical" as const, dotColor: "bg-critical" },
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  return (
    <Badge variant={config.variant} className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${config.dotColor}`} />
      {priority}
    </Badge>
  )
}
