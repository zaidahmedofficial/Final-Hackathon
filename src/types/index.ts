export interface Complaint {
  _id: string
  title: string
  description: string
  category: "Road" | "Garbage" | "Water" | "Electricity" | "Other"
  area:
    | "Gulshan-e-Iqbal"
    | "Clifton"
    | "Saddar"
    | "Lyari"
    | "Korangi"
    | "Nazimabad"
  status: "Pending" | "In Progress" | "Resolved"
  priority: "Low" | "Medium" | "High" | "Critical"
  upvotes: number
  createdAt: string
  createdBy: string
  imageUrl?: string
  officerRemark?: string
  feedbackRating?: number
  feedbackPending?: boolean
}

export interface User {
  _id: string
  name: string
  email: string
  role: "citizen" | "officer"
}

export type StatusStep = 0 | 1 | 2
