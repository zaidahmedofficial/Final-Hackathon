import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { PriorityBadge } from "./priority-badge"
import { StatusBadge } from "./status-badge"
import { StatusStepper } from "./status-stepper"
import { UpvoteButton } from "./upvote-button"
import type { Complaint } from "@/types"

interface ComplaintCardProps {
  complaint: Complaint
  showStatusStepper?: boolean
}

export function ComplaintCard({ complaint, showStatusStepper = false }: ComplaintCardProps) {
  return (
    <Link href={`/complaints/${complaint._id}`} className="block">
      <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
        <div className="relative h-48 bg-muted flex items-center justify-center">
          {complaint.imageUrl ? (
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <svg className="h-12 w-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">No Image</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <PriorityBadge priority={complaint.priority} />
          </div>
          <div className="absolute top-3 right-3">
            <UpvoteButton upvotes={complaint.upvotes} complaintId={complaint._id} size="sm" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {complaint.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground">{complaint.area}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true })}
            </span>
          </div>
          <StatusBadge status={complaint.status} />
          {showStatusStepper && (
            <div className="mt-3 pt-3 border-t border-border">
              <StatusStepper status={complaint.status} />
            </div>
          )}
          {complaint.officerRemark && (
            <div className="mt-3 p-2 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Officer:</span> {complaint.officerRemark}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
