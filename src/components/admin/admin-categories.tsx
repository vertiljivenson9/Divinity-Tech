'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Pencil, Trash2, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export function AdminCategories() {
  const { setView } = useAppStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '' })

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch {
      toast.error('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
          description: form.description
        })
      })

      if (res.ok) {
        toast.success(editingId ? 'Categoría actualizada' : 'Categoría creada')
        setForm({ name: '', slug: '', description: '' })
        setEditingId(null)
        fetchCategories()
      } else {
        toast.error('Error al guardar categoría')
      }
    } catch {
      toast.error('Error al guardar categoría')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Categoría eliminada')
        fetchCategories()
      }
    } catch {
      toast.error('Error al eliminar')
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setView('admin-dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Gestionar Categorías</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Categoría' : 'Nueva Categoría'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto-generado"
                />
              </div>
              <div>
                <Label>Descripción</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={() => {
                    setEditingId(null)
                    setForm({ name: '', slug: '', description: '' })
                  }}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorías ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay categorías</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
