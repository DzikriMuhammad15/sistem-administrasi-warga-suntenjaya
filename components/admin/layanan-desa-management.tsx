"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Save, X, Trash2, ExternalLink } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface LayananDesa {
  id: number
  nama: string
  deskripsi: string
  link_submit: string
  link_response: string
}

export function LayananDesaManagement() {
  const [items, setItems] = useState<LayananDesa[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({ nama: "", deskripsi: "", link_submit: "", link_response: "" })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("web_content_layanan_desa")
      .select("*")
      .order("id", { ascending: true })

    if (error) {
      console.error("Error loading data:", error)
      setMessage({ type: "error", text: "Gagal memuat data layanan desa" })
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from("web_content_layanan_desa")
          .update(formData)
          .eq("id", editingId)
        if (error) throw error
        setMessage({ type: "success", text: "Data berhasil diperbarui" })
      } else {
        const { error } = await supabase
          .from("web_content_layanan_desa")
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

  const handleEdit = (item: LayananDesa) => {
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi,
      link_submit: item.link_submit,
      link_response: item.link_response,
    })
    setEditingId(item.id)
    setIsCreating(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah kamu yakin ingin menghapus data ini?")) return
    try {
      const { error } = await supabase
        .from("web_content_layanan_desa")
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
    setFormData({ nama: "", deskripsi: "", link_submit: "", link_response: "" })
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
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Layanan Desa</h2>
          <p className="text-gray-600">Kelola data layanan desa yang tersedia</p>
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
              {editingId ? "Ubah data layanan desa" : "Tambahkan data baru untuk layanan desa"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nama">Nama Layanan</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Pembuatan KTP, Administrasi Desa"
              />
            </div>
            <div>
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Tambahkan deskripsi layanan"
              />
            </div>
            <div>
              <Label htmlFor="link_submit">Link Submit</Label>
              <Input
                id="link_submit"
                value={formData.link_submit}
                onChange={(e) => setFormData({ ...formData, link_submit: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="link_response">Link Response</Label>
              <Input
                id="link_response"
                value={formData.link_response}
                onChange={(e) => setFormData({ ...formData, link_response: e.target.value })}
                placeholder="https://..."
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

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.nama}</h3>
                  <p className="text-gray-700">{item.deskripsi}</p>
                  <div className="mt-2 space-x-2">
                    {item.link_submit && (
                      <a
                        href={item.link_submit}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> Submit
                      </a>
                    )}
                    {item.link_response && (
                      <a
                        href={item.link_response}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline inline-flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" /> Response
                      </a>
                    )}
                  </div>
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
