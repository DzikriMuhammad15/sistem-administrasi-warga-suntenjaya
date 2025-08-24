"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Save, X, Edit } from "lucide-react"

interface KepalaDesa {
  id: number
  nama: string
  tahun_jabat_awal: number
  tahun_jabat_akhir: number
  keterangan: string
}

export function KepalaDesaManagement() {
  const [data, setData] = useState<KepalaDesa[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nama: "",
    tahun_jabat_awal: 0,
    tahun_jabat_akhir: 0,
    keterangan: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("web_content_kepala_desa")
      .select("*")
      .order("tahun_jabat_awal", { ascending: true })

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
          .from("web_content_kepala_desa")
          .update(formData)
          .eq("id", editingId)
        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil diperbarui" })
      } else {
        // INSERT
        const { error } = await supabase.from("web_content_kepala_desa").insert([formData])
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

  const handleEdit = (item: KepalaDesa) => {
    setFormData({
      nama: item.nama,
      tahun_jabat_awal: item.tahun_jabat_awal,
      tahun_jabat_akhir: item.tahun_jabat_akhir,
      keterangan: item.keterangan,
    })
    setEditingId(item.id)
    setIsCreating(true) // buka form
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah yakin ingin menghapus data ini?")) return
    try {
      const { error } = await supabase.from("web_content_kepala_desa").delete().eq("id", id)
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
      nama: "",
      tahun_jabat_awal: 0,
      tahun_jabat_akhir: 0,
      keterangan: "",
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
        <h2 className="text-2xl font-bold">Manajemen Kepala Desa</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Kepala Desa
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
            <CardTitle>{editingId ? "Edit Kepala Desa" : "Tambah Kepala Desa"}</CardTitle>
            <CardDescription>
              {editingId ? "Perbarui data kepala desa" : "Isi data kepala desa baru"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="awal">Tahun Jabat Awal</Label>
                <Input
                  id="awal"
                  type="number"
                  value={formData.tahun_jabat_awal}
                  onChange={(e) =>
                    setFormData({ ...formData, tahun_jabat_awal: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="akhir">Tahun Jabat Akhir</Label>
                <Input
                  id="akhir"
                  type="number"
                  value={formData.tahun_jabat_akhir}
                  onChange={(e) =>
                    setFormData({ ...formData, tahun_jabat_akhir: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ket">Keterangan</Label>
              <Textarea
                id="ket"
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
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
                  <h3 className="text-lg font-semibold">{item.nama}</h3>
                  <p className="text-sm text-gray-600">
                    {item.tahun_jabat_awal} - {item.tahun_jabat_akhir}
                  </p>
                  <p className="text-sm mt-2">{item.keterangan}</p>
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
