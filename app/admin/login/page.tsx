'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { initializeApp, getApps } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyBtZzm_wnE_lyi3F8qr8iCQdQA4TSEyozU",
  authDomain: "gaby-club.firebaseapp.com",
  projectId: "gaby-club",
  storageBucket: "gaby-club.firebasestorage.app",
  messagingSenderId: "1088486906554",
  appId: "1:1088486906554:web:7a30202f2a92c0010d8083"
}

// Inicializar Firebase si no existe
if (!getApps().length) {
  initializeApp(firebaseConfig)
}
const auth = getAuth()

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      localStorage.setItem('firebase-token', token)
      toast.success('Bienvenido')
      router.push('/admin/dashboard')
    } catch (error: any) {
      console.error('Error:', error)
      toast.error('Credenciales incorrectas')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-950">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}