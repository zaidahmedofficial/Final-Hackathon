"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, FilterX, Download } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterOptions {
  category?: string
  status?: string
  area?: string
  priority?: string
  sort?: "newest" | "most-upvoted"
  search?: string
}

interface FilterBarProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  onDownloadCsv?: () => void
}

const categoryOptions = [
  { value: "", label: "All Categories" },
  { value: "Road", label: "Road" },
  { value: "Garbage", label: "Garbage" },
  { value: "Water", label: "Water" },
  { value: "Electricity", label: "Electricity" },
  { value: "Other", label: "Other" },
]

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
]

const areaOptions = [
  { value: "", label: "All Areas" },
  { value: "Gulshan-e-Iqbal", label: "Gulshan-e-Iqbal" },
  { value: "Clifton", label: "Clifton" },
  { value: "Saddar", label: "Saddar" },
  { value: "Lyari", label: "Lyari" },
  { value: "Korangi", label: "Korangi" },
  { value: "Nazimabad", label: "Nazimabad" },
]

const priorityOptions = [
  { value: "", label: "All Priorities" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
  { value: "Critical", label: "Critical" },
]

export function FilterBar({ filters, onFilterChange, onDownloadCsv }: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "")

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    onFilterChange({ ...filters, search: value })
  }

  const handleClear = () => {
    setSearchInput("")
    onFilterChange({})
  }

  const hasFilters =
    filters.category || filters.status || filters.area || filters.priority || filters.sort || filters.search

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search complaints..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            options={categoryOptions}
            value={filters.category || ""}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined })}
          />
          <Select
            options={statusOptions}
            value={filters.status || ""}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
          />
          <Select
            options={areaOptions}
            value={filters.area || ""}
            onChange={(e) => onFilterChange({ ...filters, area: e.target.value || undefined })}
          />
          <Select
            options={priorityOptions}
            value={filters.priority || ""}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value || undefined })}
          />
          <Select
            options={[
              { value: "newest", label: "Newest" },
              { value: "most-upvoted", label: "Most Upvoted" },
            ]}
            value={filters.sort || "newest"}
            onChange={(e) => onFilterChange({ ...filters, sort: e.target.value as "newest" | "most-upvoted" })}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="gap-1.5">
              <FilterX className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
        {onDownloadCsv && (
          <Button variant="outline" size="sm" onClick={onDownloadCsv} className="gap-1.5">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        )}
      </div>
    </div>
  )
}
