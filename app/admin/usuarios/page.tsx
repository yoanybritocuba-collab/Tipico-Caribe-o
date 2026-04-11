'use client'

import { useState, useEffect } from 'react'
import { Users, Shield, Eye, EyeOff, Edit2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Usuario {
  id: string
  email: string
  nombre: string
  rol: 'admin' | 'editor' | 'ver'
  activo: boolean
  createdAt: string
  lastLogin: string
}

const STORAGE_KEY = 'tipico-admin-usuarios'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    rol: 'editor' as 'admin' | 'editor' | 'ver',
    activo: true,
  })

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setUsuarios(JSON.parse(stored))
    } else {
      const usuariosEjemplo: Usuario[] = [
        {
          id: '1',
          email: 'admin@tipicocaribeno.com',
          nombre: 'Administrador',
          rol: 'admin',
          activo: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'editor@tipicocaribeno.com',
          nombre: 'Editor',
          rol: 'editor',
          activo: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
      ]
      setUsuarios(usuariosEjemplo)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosEjemplo))
    }
  }

  const saveUsuarios = (newUsuarios: Usuario[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsuarios))
    setUsuarios(newUsuarios)
  }

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario)
    setFormData({
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      activo: usuario.activo,
    })
  }

  const handleUpdate = () => {
    if (editingUsuario) {
      const updated = usuarios.map(u =>
        u.id === editingUsuario.id
          ? { ...u, ...formData }
          : u
      )
      saveUsuarios(updated)
      toast.success('Usuario actualizado')
      setEditingUsuario(null)
    }
  }

  const toggleActive = (id: string) => {
    const updated = usuarios.map(u =>
      u.id === id ? { ...u, activo: !u.activo } : u
    )
    saveUsuarios(updated)
  }

  const getRolBadge = (rol: string) => {
    switch (rol) {
      case 'admin':
        return <Badge className="bg-red-500">Administrador</Badge>
      case 'editor':
        return <Badge className="bg-blue-500">Editor</Badge>
      default:
        return <Badge variant="outline">Solo vista</Badge>
    }
  }

  const getRolIcon = (rol: string) => {
    switch (rol) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />
      case 'editor':
        return <Edit2 className="h-4 w-4 text-blue-500" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Gestiona los usuarios del panel de administración</p>
      </div>

      <div className="grid gap-4">
        {usuarios.map((usuario) => (
          <Card key={usuario.id} className={!usuario.activo ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{usuario.nombre}</h3>
                      {getRolBadge(usuario.rol)}
                    </div>
                    <p className="text-sm text-muted-foreground">{usuario.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Último acceso: {new Date(usuario.lastLogin).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(usuario)}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleActive(usuario.id)}>
                    {usuario.activo ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de edición */}
      <Dialog open={!!editingUsuario} onOpenChange={() => setEditingUsuario(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {editingUsuario && (
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Rol</Label>
                <Select
                  value={formData.rol}
                  onValueChange={(value: any) => setFormData({ ...formData, rol: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="ver">Solo vista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Activo</Label>
                <Switch
                  checked={formData.activo}
                  onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                />
              </div>
              <Button onClick={handleUpdate} className="w-full">
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}