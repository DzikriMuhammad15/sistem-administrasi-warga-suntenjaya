"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Save, X, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface SumberDayaKelembagaan {
  id: number
  nama_lembaga: string
  jumlah_anggota: number
  kategori_lembaga: string
}

export function SumberDayaKelembagaanManagement() {
  const [items, setItems] = useState<SumberDayaKelembagaan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    nama_lembaga: "",
    jumlah_anggota: 0,
    kategori_lembaga: "",
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("web_content_sumber_daya_kelembagaan")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      console.error("Error loading data:", error)
      setMessage({ type: "error", text: "Gagal memuat data sumber daya kelembagaan" })
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from("web_content_sumber_daya_kelembagaan")
          .update(formData)
          .eq("id", editingId)

        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil diperbarui" })
      } else {
        const { error } = await supabase
          .from("web_content_sumber_daya_kelembagaan")
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

  const handleEdit = (item: SumberDayaKelembagaan) => {
    setFormData({
      nama_lembaga: item.nama_lembaga,
      jumlah_anggota: item.jumlah_anggota,
      kategori_lembaga: item.kategori_lembaga,
    })
    setEditingId(item.id)
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus data ini?")) return
    try {
      const { error } = await supabase
        .from("web_content_sumber_daya_kelembagaan")
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
    setFormData({
      nama_lembaga: "",
      jumlah_anggota: 0,
      kategori_lembaga: "",
    })
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Sumber Daya Kelembagaan</h2>
          <p className="text-gray-600">Kelola data lembaga dan organisasi yang ada di wilayah</p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingId}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Data
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
            <CardTitle>{editingId ? "Edit Data" : "Tambah Data Baru"}</CardTitle>
            <CardDescription>
              {editingId
                ? "Ubah data lembaga yang ada"
                : "Tambahkan data baru untuk lembaga"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nama_lembaga">Nama Lembaga</Label>
              <Input
                id="nama_lembaga"
                value={formData.nama_lembaga}
                onChange={(e) => setFormData({ ...formData, nama_lembaga: e.target.value })}
                placeholder="Contoh: Karang Taruna, BUMDes, PKK"
              />
            </div>
            <div>
              <Label htmlFor="jumlah_anggota">Jumlah Anggota</Label>
              <Input
                id="jumlah_anggota"
                type="number"
                value={formData.jumlah_anggota}
                onChange={(e) => setFormData({ ...formData, jumlah_anggota: parseInt(e.target.value) || 0 })}
                placeholder="Contoh: 50"
              />
            </div>
            <div>
              <Label htmlFor="kategori_lembaga">Kategori Lembaga</Label>
              <Input
                id="kategori_lembaga"
                value={formData.kategori_lembaga}
                onChange={(e) => setFormData({ ...formData, kategori_lembaga: e.target.value })}
                placeholder="Contoh: Sosial, Ekonomi, Pendidikan"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                {editingId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.nama_lembaga}</h3>
                  <p className="text-gray-700">Jumlah Anggota: {item.jumlah_anggota}</p>
                  <p className="text-gray-700">Kategori: {item.kategori_lembaga}</p>
                </div>
                <div className="flex gap-2 ml-4">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
