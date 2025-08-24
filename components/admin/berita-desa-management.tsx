"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Save, X, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { ImageUpload } from "./image-upload"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BeritaDesa {
  id: number
  judul: string
  link_foto: string
  kategori: string
  tanggal: string
  deskripsi_singkat: string
  isi: string
}

export function BeritaDesaManagement() {
  const [items, setItems] = useState<BeritaDesa[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    judul: "",
    link_foto: "",
    tanggal: "",
    kategori: "",
    deskripsi_singkat: "",
    isi: "",
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("web_content_berita_desa")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      console.error("Error loading data:", error)
      setMessage({ type: "error", text: "Gagal memuat data berita desa" })
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from("web_content_berita_desa")
          .update(formData)
          .eq("id", editingId)
        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil diperbarui" })
      } else {
        const { error } = await supabase
          .from("web_content_berita_desa")
          .insert(formData)
        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil ditambahkan" })
      }
      setEditingId(null)
      setIsCreating(false)
      resetForm()
      loadItems()
    } catch (error) {
      console.error("Error saving data:", error)
      setMessage({ type: "error", text: "Gagal menyimpan data" })
    }
  }

  const handleEdit = (item: BeritaDesa) => {
    setFormData({
      judul: item.judul,
      link_foto: item.link_foto,
      tanggal: item.tanggal,
      kategori: item.kategori,
      deskripsi_singkat: item.deskripsi_singkat,
      isi: item.isi,
    })
    setEditingId(item.id)
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus data ini?")) return
    try {
      const { error } = await supabase
        .from("web_content_berita_desa")
        .delete()
        .eq("id", id)
      if (error) throw error
      setMessage({ type: "success", text: "Data berhasil dihapus" })
      loadItems()
    } catch (error) {
      console.error("Error deleting data:", error)
      setMessage({ type: "error", text: "Gagal menghapus data" })
    }
  }

  const resetForm = () => {
    setFormData({ judul: "", link_foto: "", tanggal: "", kategori: "", deskripsi_singkat: "", isi: "" })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Berita Desa</h2>
          <p className="text-gray-600">Kelola berita dan informasi desa</p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingId}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Berita
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Berita" : "Tambah Berita Baru"}</CardTitle>
            <CardDescription>
              {editingId ? "Ubah data berita desa" : "Tambahkan berita baru untuk desa"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="judul">Judul</Label>
              <Input
                id="judul"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Contoh: Peresmian Jalan Baru"
              />
            </div>

            <div>
              <Label>Foto</Label>
              <ImageUpload
                value={formData.link_foto}
                onChange={(path) => {
                  const { data } = supabase
                    .storage
                    .from("desa_suntenjaya_bucket")
                    .getPublicUrl(path)

                  setFormData({ ...formData, link_foto: data.publicUrl })
                }}
                onRemove={() => setFormData({ ...formData, link_foto: "" })}
              />
            </div>

            <div>
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <Select
                value={formData.kategori}
                onValueChange={(value) => setFormData({ ...formData, kategori: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pembangunan">Pembangunan</SelectItem>
                  <SelectItem value="Sosial">Sosial</SelectItem>
                  <SelectItem value="Budaya">Budaya</SelectItem>
                  <SelectItem value="Pertanian">Pertanian</SelectItem>
                  <SelectItem value="Kesehatan">Kesehatan</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi_singkat}
                onChange={(e) => setFormData({ ...formData, deskripsi_singkat: e.target.value })}
                placeholder="Tuliskan ringkasan singkat berita"
              />
            </div>

            <div>
              <Label htmlFor="isi">Isi Berita</Label>
              <Textarea
                id="isi"
                value={formData.isi}
                onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                placeholder="Tuliskan isi lengkap berita"
                rows={6}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> {editingId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-2">
              {item.link_foto && (
                <Image
                  src={item.link_foto}
                  alt={item.judul}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <h3 className="text-lg font-semibold">{item.judul}</h3>
              <p className="text-gray-600 text-sm">{item.tanggal}</p>
              <p className="text-gray-700">{item.deskripsi_singkat}</p>
              <p className="text-xs text-gray-500 italic">Kategori: {item.kategori}</p>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  disabled={isCreating || !!editingId}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={isCreating || !!editingId}
                >
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
