import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext() as any
    const db = await getDb(env)
    const users = db.collection('users')

    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return Response.json({ success: false, error: 'Name, email and password are required' }, { status: 400 })
    }

    const existing = await users.findOne({ email })
    if (existing) {
      return Response.json({ success: false, error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role: role || 'citizen',
      createdAt: new Date().toISOString()
    })

    const token = jwt.sign(
      { userId: result.insertedId.toString(), role: role || 'citizen' },
      env.JWT_SECRET || process.env.JWT_SECRET || 'change_this_to_32_char_random_string',
      { expiresIn: '7d' }
    )

    return Response.json({
      success: true,
      data: {
        token,
        user: { _id: result.insertedId.toString(), name, email, role: role || 'citizen' }
      }
    })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
