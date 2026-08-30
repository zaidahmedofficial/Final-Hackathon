"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ComplaintCard } from "@/components/custom/complaint-card"
import { LoadingSkeleton } from "@/components/custom/loading-skeleton"
import { EmptyState } from "@/components/custom/empty-state"
import { mockComplaints } from "@/lib/mockData"
import type { Complaint, User } from "@/types"

export default function MyComplaintsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [feedbackMap, setFeedbackMap] = useState<Record<string, { rating: number; comment: string }>>({})

  useEffect(() => {
    const stored = localStorage.getItem("shehri_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }

    const storedComplaints = localStorage.getItem("shehri_complaints")
    const allComplaints = storedComplaints ? JSON.parse(storedComplaints) : mockComplaints

    setTimeout(() => {
      const userComplaints = allComplaints.filter(
        (c: Complaint) => c.createdBy === (user?.name || user?.email)
      )
      setComplaints(userComplaints)
      setLoading(false)
    }, 600)
  }, [user])

  const handleStarClick = (complaintId: string, rating: number) => {
    setFeedbackMap((prev) => ({
      ...prev,
      [complaintId]: { ...prev[complaintId], rating },
    }))
  }

  const handleCommentChange = (complaintId: string, comment: string) => {
    setFeedbackMap((prev) => ({
      ...prev,
      [complaintId]: { ...prev[complaintId], comment },
    }))
  }

  const handleFeedbackSubmit = (complaintId: string) => {
    const feedback = feedbackMap[complaintId]
    if (!feedback || !feedback.rating) return

    setComplaints((prev) =>
      prev.map((c) =>
        c._id === complaintId
          ? { ...c, feedbackPending: false, feedbackRating: feedback.rating }
          : c
      )
    )

    const storedComplaints = localStorage.getItem("shehri_complaints")
    if (storedComplaints) {
      const all = JSON.parse(storedComplaints)
      const updated = all.map((c: Complaint) =>
        c._id === complaintId
          ? { ...c, feedbackPending: false, feedbackRating: feedback.rating }
          : c
      )
      localStorage.setItem("shehri_complaints", JSON.stringify(updated))
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">My Complaints</h1>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Complaints</h1>

      {complaints.length === 0 ? (
        <EmptyState
          title="No complaints yet"
          description="You haven't filed any complaints. Report your first civic issue now!"
          action={
            <Link href="/complaints/new">
              <Button>Report a Complaint</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint._id}>
              <ComplaintCard complaint={complaint} showStatusStepper />

              {complaint.status === "Resolved" && complaint.feedbackPending && (
                <Card className="mt-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Rate this resolution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(complaint._id, star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= (feedbackMap[complaint._id]?.rating || 0)
                                ? "fill-pending text-pending"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Add a comment (optional)"
                      className="w-full min-h-[80px] rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mb-3"
                      value={feedbackMap[complaint._id]?.comment || ""}
                      onChange={(e) => handleCommentChange(complaint._id, e.target.value)}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleFeedbackSubmit(complaint._id)}
                      disabled={!feedbackMap[complaint._id]?.rating}
                    >
                      Submit Feedback
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
