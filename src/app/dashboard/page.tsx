"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, FileText, Search } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Complaint, User } from "@/types"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("shehri_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }

    fetch('/api/complaints?limit=5&sort=newest')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setRecentComplaints(json.data.slice(0, 5))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const userComplaintCount = recentComplaints.filter(
    (c) => c.createdBy === user?.name || c.createdBy === user?.email
  ).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Welcome back, {user?.name || "Citizen"}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href="/complaints/new">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base">Report Complaint</h3>
                <p className="text-sm text-muted-foreground">Submit a new civic issue</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/complaints/mine">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-in-progress/10">
                <FileText className="h-6 w-6 text-in-progress" />
              </div>
              <div>
                <h3 className="font-bold text-base">My Complaints</h3>
                <p className="text-sm text-muted-foreground">{userComplaintCount} complaints filed</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/complaints">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-resolved/10">
                <Search className="h-6 w-6 text-resolved" />
              </div>
              <div>
                <h3 className="font-bold text-base">Browse Complaints</h3>
                <p className="text-sm text-muted-foreground">View all civic issues</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">Loading...</CardContent>
          </Card>
        ) : recentComplaints.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No recent complaints. Be the first to report an issue!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentComplaints.map((complaint) => (
              <Link key={complaint._id} href={`/complaints/${complaint._id}`}>
                <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{complaint.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {complaint.area} • {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          complaint.status === "Pending"
                            ? "bg-pending/10 text-pending"
                            : complaint.status === "In Progress"
                            ? "bg-in-progress/10 text-in-progress"
                            : "bg-resolved/10 text-resolved"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
