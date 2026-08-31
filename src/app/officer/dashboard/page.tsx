"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { AiBriefingCard } from "@/components/custom/ai-briefing-card"
import { KpiCard } from "@/components/custom/kpi-card"
import { FilterBar, type FilterOptions } from "@/components/custom/filter-bar"
import { DataTable } from "@/components/custom/table"
import { StatusBadge } from "@/components/custom/status-badge"
import { PriorityBadge } from "@/components/custom/priority-badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Complaint } from "@/types"

const categoryColors: Record<string, string> = {
  Road: "#0F2C61",
  Garbage: "#F59E0B",
  Water: "#3B82F6",
  Electricity: "#10B981",
  Other: "#6B7280",
}

export default function OfficerDashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    sort: "newest",
  })

  useEffect(() => {
    fetch('/api/complaints?limit=1000')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setComplaints(json.data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredComplaints = useMemo(() => {
    let result = [...complaints]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.createdBy && c.createdBy.toLowerCase().includes(q)) ||
          c._id.toLowerCase().includes(q)
      )
    }
    if (filters.category) result = result.filter((c) => c.category === filters.category)
    if (filters.status) result = result.filter((c) => c.status === filters.status)
    if (filters.area) result = result.filter((c) => c.area === filters.area)
    if (filters.priority) result = result.filter((c) => c.priority === filters.priority)

    if (filters.sort === "most-upvoted") {
      result.sort((a, b) => b.upvotes - a.upvotes)
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [complaints, filters])

  const pendingCount = complaints.filter((c) => c.status === "Pending").length
  const inProgressCount = complaints.filter((c) => c.status === "In Progress").length
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length

  const categoryDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1
    })
    return counts
  }, [complaints])
  const maxCategoryCount = Math.max(...Object.values(categoryDistribution), 1)

  const columns = [
    {
      key: "_id",
      header: "ID",
      sortable: true,
      className: "w-16",
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (row: Complaint) => (
        <Link
          href={`/officer/complaints/${row._id}`}
          className="text-primary hover:underline font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {row.title}
        </Link>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row: Complaint) => row.category,
    },
    {
      key: "area",
      header: "Area",
      render: (row: Complaint) => row.area,
    },
    {
      key: "priority",
      header: "Priority",
      render: (row: Complaint) => <PriorityBadge priority={row.priority} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row: Complaint) => <StatusBadge status={row.status} />,
    },
    {
      key: "upvotes",
      header: "Upvotes",
      sortable: true,
      className: "w-20 text-center",
    },
    {
      key: "daysOpen",
      header: "Days Open",
      sortable: true,
      className: "w-28",
      render: (row: Complaint) => {
        const days = Math.floor(
          (Date.now() - new Date(row.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        )
        return (
          <span className={days > 7 ? "text-critical font-medium" : ""}>
            {days}
          </span>
        )
      },
    },
    {
      key: "action",
      header: "Action",
      render: (row: Complaint) => (
        <Link href={`/officer/complaints/${row._id}`}>
          <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
            View
          </Button>
        </Link>
      ),
      className: "w-24 text-center",
    },
  ]

  const handleDownloadCsv = () => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.status) params.set('status', filters.status)
    if (filters.area) params.set('area', filters.area)
    if (filters.priority) params.set('priority', filters.priority)
    if (filters.search) params.set('search', filters.search)
    window.open(`/api/complaints/export?${params.toString()}`, '_blank')
    toast.success("CSV download started")
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Officer Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Officer Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and review civic complaints across Karachi
        </p>
      </div>

      <AiBriefingCard title="Morning Briefing">
        Today: 12 new complaints filed. 3 are Critical - all Road issues in Gulshan-e-Iqbal.
        5 complaints overdue by &gt;3 days. Water complaints in Lyari surged this week.
        7 complaints resolved yesterday.
      </AiBriefingCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total" value={complaints.length} color="#0F2C61" />
        <KpiCard title="Pending" value={pendingCount} color="#F59E0B" />
        <KpiCard title="In Progress" value={inProgressCount} color="#3B82F6" />
        <KpiCard title="Resolved" value={resolvedCount} color="#10B981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            onDownloadCsv={handleDownloadCsv}
          />
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {Object.entries(categoryDistribution).map(([category, count]) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{category}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(count / maxCategoryCount) * 100}%`,
                      backgroundColor: categoryColors[category] || "#6B7280",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <DataTable
          data={filteredComplaints}
          columns={columns}
          getRowId={(row) => row._id}
          emptyMessage="No complaints match your filters"
          onRowClick={(row) => {
            window.location.href = `/officer/complaints/${row._id}`
          }}
        />
      </div>
    </div>
  )
}
