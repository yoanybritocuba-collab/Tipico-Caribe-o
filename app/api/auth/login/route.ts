import { NextResponse } from 'next/server'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const token = await userCredential.user.getIdToken()
    
    const response = NextResponse.json({ success: true, email: userCredential.user.email })
    response.cookies.set('firebase-token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    })
    
    return response
  } catch (error: any) {
    console.error('Login error:', error.code, error.message)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code 
    }, { status: 401 })
  }
}