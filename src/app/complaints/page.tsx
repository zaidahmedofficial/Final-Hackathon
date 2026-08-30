"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FilterBar, type FilterOptions } from "@/components/custom/filter-bar"
import { ComplaintCard } from "@/components/custom/complaint-card"
import { EmptyState } from "@/components/custom/empty-state"
import { mockComplaints } from "@/lib/mockData"
import type { Complaint } from "@/types"

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filters, setFilters] = useState<FilterOptions>({})

  useEffect(() => {
    const stored = localStorage.getItem("shehri_complaints")
    const allComplaints = stored ? JSON.parse(stored) : mockComplaints
    setComplaints(allComplaints)
  }, [])

  const filteredComplaints = useMemo(() => {
    let result = [...complaints]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q)
      )
    }

    if (filters.category) {
      result = result.filter((c) => c.category === filters.category)
    }

    if (filters.status) {
      result = result.filter((c) => c.status === filters.status)
    }

    if (filters.area) {
      result = result.filter((c) => c.area === filters.area)
    }

    if (filters.priority) {
      result = result.filter((c) => c.priority === filters.priority)
    }

    if (filters.sort === "most-upvoted") {
      result.sort((a, b) => b.upvotes - a.upvotes)
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [complaints, filters])

  const handleDownloadCsv = () => {
    const headers = ["Title", "Category", "Area", "Status", "Priority", "Upvotes", "Date"]
    const rows = filteredComplaints.map((c) => [
      c.title,
      c.category,
      c.area,
      c.status,
      c.priority,
      c.upvotes,
      new Date(c.createdAt).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "complaints.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Browse Complaints</h1>
        <p className="text-sm text-muted-foreground">
          Explore civic issues reported by citizens across Karachi
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <FilterBar filters={filters} onFilterChange={setFilters} onDownloadCsv={handleDownloadCsv} />
        </CardContent>
      </Card>

      {filteredComplaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  )
}
