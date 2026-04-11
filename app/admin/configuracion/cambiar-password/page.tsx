'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Save, ArrowLeft, Shield, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

export default function CambiarPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  })
  const [formData, setFormData] = useState({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirmar: ''
  })
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasUpperCase: false,
    hasSpecialChar: false
  })

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    })
  }

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, passwordNueva: value })
    checkPasswordStrength(value)
  }

  const isPasswordStrong = () => {
    return passwordStrength.hasMinLength && 
           passwordStrength.hasNumber && 
           passwordStrength.hasUpperCase && 
           passwordStrength.hasSpecialChar
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.passwordActual || !formData.passwordNueva || !formData.passwordConfirmar) {
      toast.error('Todos los campos son obligatorios')
      return
    }

    if (formData.passwordNueva !== formData.passwordConfirmar) {
      toast.error('Las contraseñas nuevas no coinciden')
      return
    }

    if (!isPasswordStrong()) {
      toast.error('La contraseña no es lo suficientemente segura')
      return
    }

    setIsLoading(true)
    toast.loading('Cambiando contraseña...', { id: 'changing' })

    try {
      const response = await fetch('/api/cambiar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passwordActual: formData.passwordActual,
          passwordNueva: formData.passwordNueva
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Contraseña cambiada correctamente', { id: 'changing' })
        setFormData({
          passwordActual: '',
          passwordNueva: '',
          passwordConfirmar: ''
        })
        setTimeout(() => {
          router.push('/admin/configuracion')
        }, 1500)
      } else {
        toast.error(data.error || 'Error al cambiar la contraseña', { id: 'changing' })
      }
    } catch (error) {
      toast.error('Error al cambiar la contraseña', { id: 'changing' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
          Cambiar Contraseña
        </h1>
      </div>

      <Card className="border border-gray-800 bg-gray-950/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Shield className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-white">Cambiar contraseña de administrador</CardTitle>
              <CardDescription className="text-gray-400">
                Actualiza tu contraseña de acceso al panel de administración
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Contraseña actual</Label>
              <div className="relative">
                <Input
                  type={showPassword.actual ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña actual"
                  value={formData.passwordActual}
                  onChange={(e) => setFormData({ ...formData, passwordActual: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-gray-900 border-gray-700 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, actual: !showPassword.actual })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword.actual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Contraseña nueva</Label>
              <div className="relative">
                <Input
                  type={showPassword.nueva ? 'text' : 'password'}
                  placeholder="Nueva contraseña (mínimo 6 caracteres)"
                  value={formData.passwordNueva}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-gray-900 border-gray-700 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, nueva: !showPassword.nueva })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword.nueva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {formData.passwordNueva && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-400">Requisitos:</p>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasMinLength ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-500" />
                    )}
                    <span className={`text-xs ${passwordStrength.hasMinLength ? 'text-green-400' : 'text-gray-500'}`}>
                      Mínimo 6 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasNumber ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-500" />
                    )}
                    <span className={`text-xs ${passwordStrength.hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                      Al menos un número
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasUpperCase ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-500" />
                    )}
                    <span className={`text-xs ${passwordStrength.hasUpperCase ? 'text-green-400' : 'text-gray-500'}`}>
                      Al menos una mayúscula
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordStrength.hasSpecialChar ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-gray-500" />
                    )}
                    <span className={`text-xs ${passwordStrength.hasSpecialChar ? 'text-green-400' : 'text-gray-500'}`}>
                      Al menos un carácter especial
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Confirmar contraseña nueva</Label>
              <div className="relative">
                <Input
                  type={showPassword.confirmar ? 'text' : 'password'}
                  placeholder="Confirma tu nueva contraseña"
                  value={formData.passwordConfirmar}
                  onChange={(e) => setFormData({ ...formData, passwordConfirmar: e.target.value })}
                  required
                  disabled={isLoading}
                  className="bg-gray-900 border-gray-700 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, confirmar: !showPassword.confirmar })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword.confirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.passwordConfirmar && formData.passwordNueva !== formData.passwordConfirmar && (
                <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600" 
              disabled={isLoading || !isPasswordStrong() || formData.passwordNueva !== formData.passwordConfirmar}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Guardando...' : 'Cambiar contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}