import jwt from 'jsonwebtoken'

export function verifyToken(req: Request, env: any) {
  const auth = req.headers.get('authorization')
  if (!auth) return null
  try {
    const token = auth.replace('Bearer ', '')
    return jwt.verify(token, env.JWT_SECRET || process.env.JWT_SECRET) as any
  } catch {
    return null
  }
}
