"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FilterBar, type FilterOptions } from "@/components/custom/filter-bar"
import { ComplaintCard } from "@/components/custom/complaint-card"
import { EmptyState } from "@/components/custom/empty-state"
import type { Complaint } from "@/types"

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filters, setFilters] = useState<FilterOptions>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.status) params.set('status', filters.status)
    if (filters.area) params.set('area', filters.area)
    if (filters.priority) params.set('priority', filters.priority)
    if (filters.search) params.set('search', filters.search)
    if (filters.sort) params.set('sort', filters.sort)

    fetch(`/api/complaints?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setComplaints(json.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [filters])

  const handleDownloadCsv = () => {
    const headers = ["Title", "Category", "Area", "Status", "Priority", "Upvotes", "Date"]
    const rows = complaints.map((c) => [
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

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  )
}
