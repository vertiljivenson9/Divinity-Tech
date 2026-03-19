'use client'

import { useState } from 'react'
import { useSession } from '@/context/session-context'
import { useAppStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { LogIn, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export function LoginView() {
  const { setView } = useAppStore()
  const { signIn } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await signIn(formData.email, formData.password)

      if (success) {
        toast.success('Inicio de sesión exitoso')
        setView('home')
      } else {
        toast.error('Credenciales incorrectas')
      }
    } catch (error) {
      toast.error('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <Button variant="ghost" onClick={() => setView('home')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al inicio
      </Button>

      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </form>

          <Separator className="my-6" />

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Button variant="link" className="p-0" onClick={() => setView('register')}>
              Regístrate aquí
            </Button>
          </p>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center mb-2">Credenciales de prueba:</p>
            <div className="text-xs space-y-1 text-center">
              <p><strong>Admin:</strong> admin@divinityskytools.com / admin123</p>
              <p><strong>Usuario:</strong> user@divinityskytools.com / user123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
