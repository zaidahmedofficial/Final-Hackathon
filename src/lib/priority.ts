export function calculatePriority(upvotes: number, createdAt: string): "Low" | "Medium" | "High" | "Critical" {
  const now = new Date()
  const created = new Date(createdAt)
  const daysSinceCreated = Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)))

  const score = upvotes * 2 + daysSinceCreated

  if (score >= 60) return "Critical"
  if (score >= 35) return "High"
  if (score >= 15) return "Medium"
  return "Low"
}
