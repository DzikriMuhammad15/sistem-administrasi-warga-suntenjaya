"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Save, Edit, FileText, Users, Heart, Building } from "lucide-react"
import { toast } from "sonner"
import { adminApi } from "@/lib/admin-api"
import type { VillageService } from "@/types/services"

const iconOptions = [
  { value: "FileText", label: "Dokumen", icon: FileText },
  { value: "Users", label: "Pengguna", icon: Users },
  { value: "Heart", label: "Kesehatan", icon: Heart },
  { value: "Building", label: "Bangunan", icon: Building },
]

export function ServicesManagement() {
  const [services, setServices] = useState<VillageService[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingService, setEditingService] = useState<VillageService | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const data = await adminApi.get("/services")
      setServices(data)
    } catch (error) {
      toast.error("Gagal memuat data layanan")
    } finally {
      setLoading(false)
    }
  }

  const saveService = async (service: VillageService) => {
    setSaving(true)
    try {
      if (service.id) {
        await adminApi.put(`/services/${service.id}`, service)
        setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)))
        toast.success("Layanan berhasil diperbarui")
      } else {
        const newService = await adminApi.post("/services", service)
        setServices((prev) => [...prev, newService])
        toast.success("Layanan berhasil ditambahkan")
      }
      setEditingService(null)
      setIsAddingNew(false)
    } catch (error) {
      toast.error("Gagal menyimpan layanan")
    } finally {
      setSaving(false)
    }
  }

  const deleteService = async (id: number) => {
    try {
      await adminApi.delete(`/services/${id}`)
      setServices((prev) => prev.filter((s) => s.id !== id))
      toast.success("Layanan berhasil dihapus")
    } catch (error) {
      toast.error("Gagal menghapus layanan")
    }
  }

  const startAddNew = () => {
    setEditingService({
      title: "",
      description: "",
      icon: "FileText",
      items: [],
      hours: "08:00 - 15:00",
      location: "Kantor Desa",
      isActive: true,
    })
    setIsAddingNew(true)
  }

  const ServiceForm = ({
    service,
    onSave,
    onCancel,
  }: {
    service: VillageService
    onSave: (service: VillageService) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<VillageService>(service)
    const [newItem, setNewItem] = useState("")

    const addItem = () => {
      if (newItem.trim()) {
        setFormData((prev) => ({
          ...prev,
          items: [...prev.items, newItem.trim()],
        }))
        setNewItem("")
      }
    }

    const removeItem = (index: number) => {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }))
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{service.id ? "Edit Layanan" : "Tambah Layanan Baru"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Judul Layanan</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label>Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Deskripsi</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Jam Operasional</Label>
              <Input
                value={formData.hours}
                onChange={(e) => setFormData((prev) => ({ ...prev, hours: e.target.value }))}
              />
            </div>
            <div>
              <Label>Lokasi</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Item Layanan</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Tambah item layanan"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addItem()}
              />
              <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.items.map((item, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {item}
                  <button onClick={() => removeItem(index)} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
            />
            <Label>Layanan Aktif</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onSave(formData)} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Layanan Desa</h2>
        <Button onClick={startAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>

      {(editingService || isAddingNew) && (
        <ServiceForm
          service={editingService!}
          onSave={saveService}
          onCancel={() => {
            setEditingService(null)
            setIsAddingNew(false)
          }}
        />
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = iconOptions.find((opt) => opt.value === service.icon)?.icon || FileText
          return (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div>📍 {service.location}</div>
                  <div>🕒 {service.hours}</div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {service.items.slice(0, 3).map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {service.items.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.items.length - 3} lainnya
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingService(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => service.id && deleteService(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
