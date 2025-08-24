"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Save, X, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface TingkatPendidikan {
  id: number
  tingkat_pendidikan: string
  jumlah: number
}

export function TingkatPendidikanManagement() {
  const [items, setItems] = useState<TingkatPendidikan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    tingkat_pendidikan: "",
    jumlah: 0,
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("web_content_tingkat_pendidikan")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      console.error("Error loading data:", error)
      setMessage({ type: "error", text: "Gagal memuat data tingkat pendidikan" })
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from("web_content_tingkat_pendidikan")
          .update(formData)
          .eq("id", editingId)

        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil diperbarui" })
      } else {
        const { error } = await supabase
          .from("web_content_tingkat_pendidikan")
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

  const handleEdit = (item: TingkatPendidikan) => {
    setFormData({
      tingkat_pendidikan: item.tingkat_pendidikan,
      jumlah: item.jumlah,
    })
    setEditingId(item.id)
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus data ini?")) return
    try {
      const { error } = await supabase
        .from("web_content_tingkat_pendidikan")
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
      tingkat_pendidikan: "",
      jumlah: 0,
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Tingkat Pendidikan</h2>
          <p className="text-gray-600">Kelola data jumlah penduduk berdasarkan tingkat pendidikan</p>
        </div>
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
                ? "Ubah data tingkat pendidikan"
                : "Tambahkan data baru untuk tingkat pendidikan"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tingkat_pendidikan">Tingkat Pendidikan</Label>
              <Input
                id="tingkat_pendidikan"
                value={formData.tingkat_pendidikan}
                onChange={(e) => setFormData({ ...formData, tingkat_pendidikan: e.target.value })}
                placeholder="Contoh: SD, SMP, SMA, S1"
              />
            </div>
            <div>
              <Label htmlFor="jumlah">Jumlah</Label>
              <Input
                id="jumlah"
                type="number"
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: Number(e.target.value) })}
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
                  <h3 className="text-lg font-semibold">{item.tingkat_pendidikan}</h3>
                  <p className="text-gray-700">Jumlah: {item.jumlah}</p>
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
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
