"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PriorityBadge } from "@/components/custom/priority-badge"
import { StatusBadge } from "@/components/custom/status-badge"
import { StatusStepper } from "@/components/custom/status-stepper"
import { UpvoteButton } from "@/components/custom/upvote-button"
import type { Complaint } from "@/types"

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/complaints/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setComplaint(json.data)
        } else {
          setNotFound(true)
        }
      })
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Complaint Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The complaint you are looking for does not exist or has been removed.
        </p>
        <Link href="/complaints">
          <Button>Browse Complaints</Button>
        </Link>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    )
  }

  const timeline = [
    { label: "Submitted", date: complaint.createdAt, done: true },
    {
      label: "Under Review",
      date: complaint.officerRemark ? complaint.createdAt : undefined,
      done: complaint.status !== "Pending",
    },
    {
      label: "In Progress",
      date: complaint.status === "In Progress" || complaint.status === "Resolved" ? complaint.createdAt : undefined,
      done: complaint.status === "In Progress" || complaint.status === "Resolved",
    },
    {
      label: "Resolved",
      date: complaint.status === "Resolved" ? complaint.createdAt : undefined,
      done: complaint.status === "Resolved",
    },
  ].filter((item) => item.date !== undefined)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link
          href="/complaints"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to complaints
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-muted h-64 sm:h-80 flex items-center justify-center mb-6">
        <div className="flex flex-col items-center text-muted-foreground">
          <svg className="h-12 w-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">No Image Available</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>

          <h1 className="text-xl font-bold mb-2">{complaint.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span>{complaint.area}</span>
            <span>•</span>
            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span className="capitalize">{complaint.category}</span>
          </div>

          <p className="text-sm leading-relaxed whitespace-pre-wrap">{complaint.description}</p>

          <div className="mt-6 pt-4 border-t border-border">
            <UpvoteButton upvotes={complaint.upvotes} complaintId={complaint._id} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      item.done ? "bg-primary" : "bg-muted"
                    }`}
                  />
                  {idx < timeline.length - 1 && (
                    <div className={`w-0.5 h-8 ${item.done ? "bg-primary/30" : "bg-muted"}`} />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${item.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {item.label}
                  </p>
                  {item.date && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <StatusStepper status={complaint.status} />
          </div>
        </CardContent>
      </Card>

      {complaint.officerRemark && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Officer Remark</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{complaint.officerRemark}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
