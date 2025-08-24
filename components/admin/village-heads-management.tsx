"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import { AdminAPI } from "@/lib/admin-api"
import { ImageUpload } from "./image-upload"
import { getSupabaseStorageUrl } from "@/lib/supabase-helpers"

interface VillageHead {
  id: string
  name: string
  photo_url?: string
  start_year: number
  end_year?: number
  period: string
  achievements?: string
}

export function VillageHeadsManagement() {
  const [heads, setHeads] = useState<VillageHead[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHead, setEditingHead] = useState<VillageHead | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    photo_url: "",
    start_year: new Date().getFullYear(),
    end_year: "",
    period: "",
    achievements: "",
  })

  useEffect(() => {
    fetchHeads()
  }, [])

  const fetchHeads = async () => {
    try {
      const data = await AdminAPI.getVillageHeads()
      setHeads(data)
    } catch (error) {
      console.error("Error fetching heads:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        end_year: formData.end_year ? Number.parseInt(formData.end_year) : null,
      }

      if (editingHead) {
        await AdminAPI.updateVillageHead(editingHead.id, submitData)
      } else {
        await AdminAPI.createVillageHead(submitData)
      }
      await fetchHeads()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving head:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        await AdminAPI.deleteVillageHead(id)
        await fetchHeads()
      } catch (error) {
        console.error("Error deleting head:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      photo_url: "",
      start_year: new Date().getFullYear(),
      end_year: "",
      period: "",
      achievements: "",
    })
    setEditingHead(null)
  }

  const openEditDialog = (head: VillageHead) => {
    setEditingHead(head)
    setFormData({
      name: head.name,
      photo_url: head.photo_url || "",
      start_year: head.start_year,
      end_year: head.end_year?.toString() || "",
      period: head.period,
      achievements: head.achievements || "",
    })
    setIsDialogOpen(true)
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Sejarah Kepala Desa</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kepala Desa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingHead ? "Edit Kepala Desa" : "Tambah Kepala Desa Baru"}</DialogTitle>
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
                <Label>Foto</Label>
                <ImageUpload
                  onImageUploaded={(url) => setFormData({ ...formData, photo_url: url })}
                  currentImage={formData.photo_url}
                />
              </div>
              <div>
                <Label htmlFor="start_year">Tahun Mulai</Label>
                <Input
                  id="start_year"
                  type="number"
                  value={formData.start_year}
                  onChange={(e) => setFormData({ ...formData, start_year: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end_year">Tahun Selesai (Opsional)</Label>
                <Input
                  id="end_year"
                  type="number"
                  value={formData.end_year}
                  onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="period">Periode</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="Contoh: 2019-2025"
                  required
                />
              </div>
              <div>
                <Label htmlFor="achievements">Pencapaian (Opsional)</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingHead ? "Update" : "Tambah"} Kepala Desa
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {heads.map((head) => (
          <Card key={head.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={head.photo_url ? getSupabaseStorageUrl(head.photo_url) : undefined}
                    alt={head.name}
                  />
                  <AvatarFallback className="text-lg">
                    {head.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{head.name}</h3>
                    <Badge variant="outline" className="text-sm">
                      {head.period}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {head.start_year}
                      {head.end_year && head.end_year !== head.start_year && ` - ${head.end_year}`}
                    </span>
                  </div>
                  {head.achievements && <p className="text-gray-700 mb-4">{head.achievements}</p>}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(head)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(head.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
