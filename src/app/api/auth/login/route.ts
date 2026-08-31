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

    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ success: false, error: 'Email and password are required' }, { status: 400 })
    }

    const user = await users.findOne({ email })
    if (!user) {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      env.JWT_SECRET || process.env.JWT_SECRET || 'change_this_to_32_char_random_string',
      { expiresIn: '7d' }
    )

    return Response.json({
      success: true,
      data: {
        token,
        user: { _id: user._id.toString(), name: user.name, email: user.email, role: user.role }
      }
    })
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 })
  }
}
