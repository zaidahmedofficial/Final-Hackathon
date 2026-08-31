"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/custom/status-badge"
import { PriorityBadge } from "@/components/custom/priority-badge"
import { EmptyState } from "@/components/custom/empty-state"
import type { Complaint } from "@/types"
import { toast } from "sonner"

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
]

export default function OfficerReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [status, setStatus] = useState<string>("")
  const [remark, setRemark] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/complaints/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setComplaint(json.data)
          setStatus(json.data.status)
          setRemark(json.data.officerRemark || "")
        }
      })
  }, [id])

  const handleUpdate = async () => {
    setError("")
    if (!status) {
      setError("Please select a status")
      return
    }
    if (status === "Resolved" && !remark.trim()) {
      setError("Please add a remark before marking as resolved")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, officerRemark: remark })
      })
      const json = await res.json()
      if (json.success) {
        setComplaint(json.data)
        toast.success("Complaint updated successfully")
        setTimeout(() => {
          window.location.href = "/officer/dashboard"
        }, 1000)
      } else {
        setError(json.error || 'Update failed')
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto">
        <EmptyState
          title="Complaint not found"
          description="The complaint you are looking for does not exist or has been removed."
          action={
            <Link href="/officer/dashboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  const daysOpen = Math.floor(
    (Date.now() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/officer/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Review Complaint</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complaint ID: {complaint._id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{complaint.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-sm">Filed by {complaint.createdBy}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(complaint.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground">
                  {daysOpen} day{daysOpen !== 1 ? "s" : ""} open
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
                <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-0.5 text-xs font-medium">
                  {complaint.category}
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-0.5 text-xs font-medium">
                  {complaint.area}
                </span>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-semibold mb-2">Evidence</h3>
                <div className="h-48 w-full rounded-lg border border-dashed border-border bg-muted/50 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No image attached</span>
                </div>
              </div>

              {complaint.officerRemark && (
                <div className="pt-2">
                  <h3 className="text-sm font-semibold mb-2">Previous Officer Remark</h3>
                  <div className="rounded-md bg-muted/50 border border-border p-3">
                    <p className="text-sm text-muted-foreground">{complaint.officerRemark}</p>
                  </div>
                </div>
              )}

              {complaint.feedbackPending && (
                <div className="pt-2">
                  <h3 className="text-sm font-semibold mb-2">Citizen Feedback</h3>
                  <div className="rounded-md bg-muted/50 border border-border p-3">
                    <p className="text-sm text-muted-foreground">
                      Feedback pending from citizen
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Update Status</CardTitle>
                <CardDescription>Change the status and add remarks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Status"
                  options={statusOptions}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Textarea
                  label="Officer Remark"
                  placeholder="Add your remarks here..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  error={error}
                />
                <Button
                  className="w-full"
                  onClick={handleUpdate}
                  loading={loading}
                >
                  Update Complaint
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
