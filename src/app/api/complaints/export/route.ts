import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb, getCollection } from '@/lib/mongodb'

export const runtime = 'nodejs'

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

    const headers = ['_id', 'title', 'category', 'area', 'status', 'priority', 'upvotes', 'createdAt', 'createdBy']
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const rows = results.map((c: any) => headers.map(h => escape(c[h])).join(','))
    const csv = [headers.join(','), ...rows].join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=complaints.csv'
      }
    })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
