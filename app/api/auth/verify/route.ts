import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie')
  const token = cookie?.split('firebase-token=')[1]?.split(';')[0]
  
  if (token && token.length > 0) {
    return NextResponse.json({ authenticated: true })
  }
  
  return NextResponse.json({ authenticated: false })
}