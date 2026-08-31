"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Upload } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Complaint, User } from "@/types"

const categoryOptions = [
  { value: "", label: "Select category" },
  { value: "Road", label: "Road" },
  { value: "Garbage", label: "Garbage" },
  { value: "Water", label: "Water" },
  { value: "Electricity", label: "Electricity" },
  { value: "Other", label: "Other" },
]

const areaOptions = [
  { value: "", label: "Select area" },
  { value: "Gulshan-e-Iqbal", label: "Gulshan-e-Iqbal" },
  { value: "Clifton", label: "Clifton" },
  { value: "Saddar", label: "Saddar" },
  { value: "Lyari", label: "Lyari" },
  { value: "Korangi", label: "Korangi" },
  { value: "Nazimabad", label: "Nazimabad" },
]

export default function NewComplaintPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [area, setArea] = useState("")
  const [loading, setLoading] = useState(false)
  const [duplicateComplaint, setDuplicateComplaint] = useState<Complaint | null>(null)
  const [errors, setErrors] = useState<{ title?: string; category?: string; description?: string; area?: string }>({})

  useEffect(() => {
    const stored = localStorage.getItem("shehri_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const checkDuplicate = async (cat: string, ar: string) => {
    if (!cat || !ar) {
      setDuplicateComplaint(null)
      return
    }
    try {
      const res = await fetch(`/api/complaints?category=${encodeURIComponent(cat)}&area=${encodeURIComponent(ar)}&status=Pending,In Progress`)
      const json = await res.json()
      if (json.success && json.data.length > 0) {
        setDuplicateComplaint(json.data[0])
      } else {
        setDuplicateComplaint(null)
      }
    } catch {
      setDuplicateComplaint(null)
    }
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    checkDuplicate(value, area)
  }

  const handleAreaChange = (value: string) => {
    setArea(value)
    checkDuplicate(category, value)
  }

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!category) newErrors.category = "Category is required"
    if (!description.trim()) newErrors.description = "Description is required"
    if (!area) newErrors.area = "Area is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (!user) return

    setLoading(true)

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          area,
          createdBy: user.name || user.email,
          role: user.role
        })
      })
      const json = await res.json()
      if (!json.success) {
        if (json.error === 'Duplicate') {
          setDuplicateComplaint(json.data)
        } else {
          alert(json.error || 'Failed to submit complaint')
        }
        setLoading(false)
        return
      }
      window.location.href = "/complaints/mine"
    } catch {
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Report a Complaint</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Title"
              placeholder="Brief summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                options={categoryOptions}
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                error={errors.category}
              />
              <Select
                label="Area"
                options={areaOptions}
                value={area}
                onChange={(e) => handleAreaChange(e.target.value)}
                error={errors.area}
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
            />

            <div>
              <label className="text-sm font-medium mb-1.5 block">Photo (optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-sm">Drag & drop photos here or click to browse</span>
              </div>
            </div>

            {duplicateComplaint && (
              <Card className="bg-pending/5 border-pending/20">
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-1">Similar complaint already exists</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    A similar issue has been reported in {duplicateComplaint.area}. Consider upvoting it instead.
                  </p>
                  <Link href={`/complaints/${duplicateComplaint._id}`}>
                    <span className="text-sm text-primary font-medium hover:underline">
                      View existing complaint
                    </span>
                  </Link>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/dashboard">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading}>
                Submit Complaint
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
