import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "Pending" | "In Progress" | "Resolved"
}

const statusConfig = {
  Pending: { variant: "pending" as const, label: "Pending" },
  "In Progress": { variant: "in-progress" as const, label: "In Progress" },
  Resolved: { variant: "resolved" as const, label: "Resolved" },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant}>{config.label}</Badge>
  )
}
