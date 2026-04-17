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
  apiKey: "AIzaSyAl_IO_Y-xWCK333pnXQmGiaJ3IuIrdJEk",
  authDomain: "tipico-caribeno.firebaseapp.com",
  projectId: "tipico-caribeno",
  storageBucket: "tipico-caribeno.firebasestorage.app",
  messagingSenderId: "349147555780",
  appId: "1:349147555780:web:35372f753cb66d50cca691"
}

// Inicializar Firebase solo si no existe
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
      toast.success('Bienvenido al panel de administración')
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
          <CardTitle className="text-center text-2xl font-bold text-gold">
            Tipico Caribeño
          </CardTitle>
          <p className="text-center text-sm text-gray-400">Panel de Administración</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-gray-300">Correo electrónico</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-gray-900 border-gray-700 text-white"
                placeholder="admin@tipicocaribeno.com"
                required
              />
            </div>
            <div>
              <Label className="text-gray-300">Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-gray-900 border-gray-700 text-white"
                placeholder="••••••••"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gold text-black hover:bg-gold-dark font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}