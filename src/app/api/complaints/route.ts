import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb, getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const runtime = 'nodejs'

function calculatePriority(upvotes: number, createdAt: string): 'Low' | 'Medium' | 'High' | 'Critical' {
  const now = Date.now()
  const created = new Date(createdAt).getTime()
  const daysSinceCreated = Math.max(1, Math.floor((now - created) / (1000 * 60 * 60 * 24)))
  const score = upvotes * 2 + daysSinceCreated

  if (score >= 60) return 'Critical'
  if (score >= 35) return 'High'
  if (score >= 15) return 'Medium'
  return 'Low'
}

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext() as any
    const db = await getDb(env)
    const complaints = getCollection(db, 'complaints')

    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const status = url.searchParams.get('status')
    const area = url.searchParams.get('area')
    const priority = url.searchParams.get('priority')
    const search = url.searchParams.get('search')
    const sort = url.searchParams.get('sort') || 'newest'

    const query: any = {}
    if (category) query.category = category
    if (status) query.status = status
    if (area) query.area = area
    if (priority) query.priority = priority

    let results = await complaints.find(query).toArray()

    if (search) {
      const q = search.toLowerCase()
      results = results.filter((c: any) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q)
      )
    }

    if (sort === 'most-upvoted') {
      results.sort((a: any, b: any) => b.upvotes - a.upvotes)
    } else {
      results.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return Response.json({ success: true, data: results })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext() as any
    const db = await getDb(env)
    const complaints = getCollection(db, 'complaints')

    const { title, description, category, area, createdBy, role } = await request.json()

    if (!title || !description || !category || !area) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await complaints.findOne({
      category,
      area,
      status: { $in: ['Pending', 'In Progress'] }
    })

    if (existing) {
      return Response.json({ success: false, error: 'Duplicate', data: existing }, { status: 409 })
    }

    const now = new Date().toISOString()
    const result = await complaints.insertOne({
      title,
      description,
      category,
      area,
      status: 'Pending',
      priority: 'Medium',
      upvotes: 0,
      createdAt: now,
      createdBy: createdBy || 'Anonymous',
      role: role || 'citizen',
      officerRemark: '',
      feedbackPending: false,
      feedbackRating: 0
    })

    return Response.json({
      success: true,
      data: {
        _id: result.insertedId.toString(),
        title,
        description,
        category,
        area,
        status: 'Pending',
        priority: 'Medium',
        upvotes: 0,
        createdAt: now,
        createdBy: createdBy || 'Anonymous',
        role: role || 'citizen',
        officerRemark: '',
        feedbackPending: false,
        feedbackRating: 0
      }
    })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
