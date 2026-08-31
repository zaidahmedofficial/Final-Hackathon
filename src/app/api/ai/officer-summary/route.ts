import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb, getCollection } from '@/lib/mongodb'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext() as any
    const db = await getDb(env)
    const complaints = getCollection(db, 'complaints')

    const all = await complaints.find({}).toArray()
    const total = all.length
    const pending = all.filter((c: any) => c.status === 'Pending').length
    const inProgress = all.filter((c: any) => c.status === 'In Progress').length
    const resolved = all.filter((c: any) => c.status === 'Resolved').length

    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    const newToday = all.filter((c: any) => now - new Date(c.createdAt).getTime() < oneDay).length
    const overdue = all.filter((c: any) => {
      const days = Math.floor((now - new Date(c.createdAt).getTime()) / oneDay)
      return days > 3 && c.status !== 'Resolved'
    }).length

    const categoryCount: Record<string, number> = {}
    const areaCount: Record<string, number> = {}
    all.forEach((c: any) => {
      categoryCount[c.category] = (categoryCount[c.category] || 0) + 1
      areaCount[c.area] = (areaCount[c.area] || 0) + 1
    })

    const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]
    const topArea = Object.entries(areaCount).sort((a, b) => b[1] - a[1])[0]

    const summary = `Today: ${newToday} new complaints filed. ${pending} are Pending, ${inProgress} In Progress, ${resolved} Resolved. ${overdue} complaints overdue by >3 days. Top category: ${topCategory?.[0] || 'N/A'} (${topCategory?.[1] || 0}). Top area: ${topArea?.[0] || 'N/A'} (${topArea?.[1] || 0}).`

    return Response.json({ success: true, data: { summary, total, pending, inProgress, resolved, newToday, overdue } })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
