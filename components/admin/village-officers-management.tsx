"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import { AdminAPI } from "@/lib/admin-api"
import { ImageUpload } from "./image-upload"
import { getSupabaseStorageUrl } from "@/lib/supabase-helpers"

interface VillageOfficer {
  id: string
  name: string
  position: string
  photo_url?: string
  start_date: string
  end_date?: string
  description?: string
}

export function VillageOfficersManagement() {
  const [officers, setOfficers] = useState<VillageOfficer[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOfficer, setEditingOfficer] = useState<VillageOfficer | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    photo_url: "",
    start_date: "",
    end_date: "",
    description: "",
  })

  useEffect(() => {
    fetchOfficers()
  }, [])

  const fetchOfficers = async () => {
    try {
      const data = await AdminAPI.getVillageOfficers()
      setOfficers(data)
    } catch (error) {
      console.error("Error fetching officers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingOfficer) {
        await AdminAPI.updateVillageOfficer(editingOfficer.id, formData)
      } else {
        await AdminAPI.createVillageOfficer(formData)
      }
      await fetchOfficers()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving officer:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await AdminAPI.deleteVillageOfficer(id)
        await fetchOfficers()
      } catch (error) {
        console.error("Error deleting officer:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      photo_url: "",
      start_date: "",
      end_date: "",
      description: "",
    })
    setEditingOfficer(null)
  }

  const openEditDialog = (officer: VillageOfficer) => {
    setEditingOfficer(officer)
    setFormData({
      name: officer.name,
      position: officer.position,
      photo_url: officer.photo_url || "",
      start_date: officer.start_date,
      end_date: officer.end_date || "",
      description: officer.description || "",
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Pemerintahan Desa</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pejabat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingOfficer ? "Edit Pejabat" : "Tambah Pejabat Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Jabatan</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Foto</Label>
                <ImageUpload
                  onImageUploaded={(url) => setFormData({ ...formData, photo_url: url })}
                  currentImage={formData.photo_url}
                />
              </div>
              <div>
                <Label htmlFor="start_date">Tanggal Mulai</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_date">Tanggal Selesai (Opsional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingOfficer ? "Update" : "Tambah"} Pejabat
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {officers.map((officer) => (
          <Card key={officer.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={officer.photo_url ? getSupabaseStorageUrl(officer.photo_url) : undefined}
                    alt={officer.name}
                  />
                  <AvatarFallback>
                    {officer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{officer.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {officer.position}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(officer.start_date).getFullYear()}
                    {officer.end_date && ` - ${new Date(officer.end_date).getFullYear()}`}
                  </span>
                </div>
                {officer.description && <p className="text-gray-700">{officer.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(officer)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(officer.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
