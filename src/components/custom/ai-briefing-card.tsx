import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Bot } from "lucide-react"

interface AiBriefingCardProps {
  title?: string
  children: React.ReactNode
}

export function AiBriefingCard({ title = "Morning Briefing", children }: AiBriefingCardProps) {
  return (
    <Card className="border-in-progress/20 bg-in-progress/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-md bg-in-progress/10">
            <Bot className="h-4 w-4 text-in-progress" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
      </CardContent>
    </Card>
  )
}
