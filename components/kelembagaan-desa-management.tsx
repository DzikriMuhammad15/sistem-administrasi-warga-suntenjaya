"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Save, X, Trash2, Briefcase } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Kelembagaan {
  id: number
  jabatan: string
  jumlah_menjabat: number
}

export function KelembagaanDesaManagement() {
  const [items, setItems] = useState<Kelembagaan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    jabatan: "",
    jumlah_menjabat: 0,
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("web_content_kelembagaan_desa")
      .select("*")
      .order("jabatan", { ascending: true })

    if (error) {
      console.error("Error loading data:", error)
      setMessage({ type: "error", text: "Gagal memuat data kelembagaan desa" })
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from("web_content_kelembagaan_desa")
          .update(formData)
          .eq("id", editingId)
        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil diperbarui" })
      } else {
        const { error } = await supabase
          .from("web_content_kelembagaan_desa")
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

  const handleEdit = (item: Kelembagaan) => {
    setFormData({
      jabatan: item.jabatan,
      jumlah_menjabat: item.jumlah_menjabat,
    })
    setEditingId(item.id)
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus data ini?")) return
    try {
      const { error } = await supabase
        .from("web_content_kelembagaan_desa")
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
    setFormData({ jabatan: "", jumlah_menjabat: 0 })
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Kelembagaan Desa</h2>
          <p className="text-gray-600">Kelola data jabatan dan jumlah pejabat di kelembagaan desa</p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingId}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Jabatan
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
            <CardTitle>{editingId ? "Edit Jabatan" : "Tambah Jabatan Baru"}</CardTitle>
            <CardDescription>
              {editingId ? "Ubah data jabatan kelembagaan desa" : "Tambahkan jabatan baru ke kelembagaan desa"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jabatan">Jabatan</Label>
              <Input
                id="jabatan"
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                placeholder="Contoh: Ketua RT, Sekretaris Desa"
              />
            </div>

            <div>
              <Label htmlFor="jumlah_menjabat">Jumlah Menjabat</Label>
              <Input
                id="jumlah_menjabat"
                type="number"
                value={formData.jumlah_menjabat}
                onChange={(e) => setFormData({ ...formData, jumlah_menjabat: Number(e.target.value) })}
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
              <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold">{item.jabatan}</h3>
              </div>
              <p className="text-sm">👥 Jumlah Menjabat: {item.jumlah_menjabat}</p>
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
