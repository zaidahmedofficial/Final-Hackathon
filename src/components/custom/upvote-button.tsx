"use client"

import { useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UpvoteButtonProps {
  upvotes: number
  complaintId: string
  size?: "sm" | "md"
}

export function UpvoteButton({ upvotes, complaintId, size = "md" }: UpvoteButtonProps) {
  const [count, setCount] = useState(upvotes)
  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpvote = () => {
    if (hasUpvoted || loading) return
    setLoading(true)
    setTimeout(() => {
      setCount((c) => c + 1)
      setHasUpvoted(true)
      setLoading(false)
      const storageKey = `upvoted_${complaintId}`
      localStorage.setItem(storageKey, "true")
    }, 300)
  }

  const isSmall = size === "sm"

  return (
    <Button
      variant={hasUpvoted ? "default" : "outline"}
      size="sm"
      onClick={handleUpvote}
      disabled={hasUpvoted}
      loading={loading}
      className={cn(
        "gap-1.5",
        isSmall && "h-8 px-2 text-xs",
        hasUpvoted && "bg-primary text-primary-foreground"
      )}
    >
      <ArrowUp className={cn("h-4 w-4", isSmall && "h-3 w-3")} />
      <span className={cn(isSmall ? "text-xs" : "text-sm", "font-medium")}>
        {count}
      </span>
    </Button>
  )
}
