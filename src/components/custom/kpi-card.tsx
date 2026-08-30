import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Bell } from "lucide-react"

interface KpiCardProps {
  title: string
  value: number
  color: string
}

export function KpiCard({ title, value, color }: KpiCardProps) {
  const bgColor =
    color === "#0F2C61"
      ? "bg-primary/10"
      : color === "#F59E0B"
        ? "bg-pending/10"
        : color === "#3B82F6"
          ? "bg-in-progress/10"
          : "bg-resolved/10"

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold" style={{ color }}>
              {value}
            </p>
          </div>
          <div className={cn("p-2 rounded-lg", bgColor)}>
            <Bell className="h-5 w-5" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
