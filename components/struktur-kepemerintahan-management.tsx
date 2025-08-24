"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Save, X, Edit } from "lucide-react"

interface Struktur {
  id: number
  jabatan: string
  nama: string
}

export function StrukturKepemerintahanManagement() {
  const [data, setData] = useState<Struktur[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    jabatan: "",
    nama: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("web_content_struktur_kepemerintahan")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      console.error(error)
      setMessage({ type: "error", text: "Gagal memuat data" })
    } else {
      setData(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from("web_content_struktur_kepemerintahan")
          .update(formData)
          .eq("id", editingId)
        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil diperbarui" })
      } else {
        // INSERT
        const { error } = await supabase
          .from("web_content_struktur_kepemerintahan")
          .insert([formData])
        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil ditambahkan" })
      }

      setIsCreating(false)
      setEditingId(null)
      resetForm()
      loadData()
    } catch (error) {
      console.error(error)
      setMessage({ type: "error", text: "Gagal menyimpan data" })
    }
  }

  const handleEdit = (item: Struktur) => {
    setFormData({
      jabatan: item.jabatan,
      nama: item.nama,
    })
    setEditingId(item.id)
    setIsCreating(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah yakin ingin menghapus data ini?")) return
    try {
      const { error } = await supabase
        .from("web_content_struktur_kepemerintahan")
        .delete()
        .eq("id", id)
      if (error) throw error
      setMessage({ type: "success", text: "Data berhasil dihapus" })
      loadData()
    } catch (error) {
      console.error(error)
      setMessage({ type: "error", text: "Gagal menghapus data" })
    }
  }

  const resetForm = () => {
    setFormData({
      jabatan: "",
      nama: "",
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Struktur Kepemerintahan</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
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
            <CardTitle>{editingId ? "Edit Data" : "Tambah Data"}</CardTitle>
            <CardDescription>
              {editingId ? "Perbarui data struktur" : "Isi data baru"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jabatan">Jabatan</Label>
              <Input
                id="jabatan"
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> {editingId ? "Update" : "Simpan"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{item.jabatan}</h3>
                  <p className="text-sm mt-2">{item.nama}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    disabled={isCreating}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={isCreating}
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
