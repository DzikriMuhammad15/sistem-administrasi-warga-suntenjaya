"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Save, Edit } from "lucide-react"
import { toast } from "sonner"
import { adminApi } from "@/lib/admin-api"
import type { VillageStatistics } from "@/types/statistics"

export function StatisticsManagement() {
  const [statistics, setStatistics] = useState<VillageStatistics>({
    education: [],
    occupation: [],
    livestock: [],
    facilities: [],
    sports: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingItem, setEditingItem] = useState<{ type: string; index: number } | null>(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const data = await adminApi.get("/statistics")
      setStatistics(data)
    } catch (error) {
      toast.error("Gagal memuat data statistik")
    } finally {
      setLoading(false)
    }
  }

  const saveStatistics = async () => {
    setSaving(true)
    try {
      await adminApi.put("/statistics", statistics)
      toast.success("Data statistik berhasil disimpan")
      setEditingItem(null)
    } catch (error) {
      toast.error("Gagal menyimpan data statistik")
    } finally {
      setSaving(false)
    }
  }

  const addItem = (type: keyof VillageStatistics) => {
    const newItem = getEmptyItem(type)
    setStatistics((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }))
    setEditingItem({ type, index: statistics[type].length })
  }

  const removeItem = (type: keyof VillageStatistics, index: number) => {
    setStatistics((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const updateItem = (type: keyof VillageStatistics, index: number, field: string, value: any) => {
    setStatistics((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const getEmptyItem = (type: keyof VillageStatistics) => {
    switch (type) {
      case "education":
        return { level: "", count: 0, percentage: 0 }
      case "occupation":
        return { job: "", count: 0 }
      case "livestock":
        return { type: "", owners: 0 }
      case "facilities":
        return { facility: "", count: 0 }
      case "sports":
        return { sport: "", count: 0 }
      default:
        return {}
    }
  }

  const renderEducationTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Data Pendidikan</h3>
        <Button onClick={() => addItem("education")} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data
        </Button>
      </div>

      <div className="space-y-3">
        {statistics.education.map((edu, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              {editingItem?.type === "education" && editingItem.index === index ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Tingkat</Label>
                    <Input
                      value={edu.level}
                      onChange={(e) => updateItem("education", index, "level", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Jumlah</Label>
                    <Input
                      type="number"
                      value={edu.count}
                      onChange={(e) => updateItem("education", index, "count", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Persentase</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={edu.percentage}
                      onChange={(e) =>
                        updateItem("education", index, "percentage", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{edu.level}</span>
                    <Badge variant="secondary" className="ml-2">
                      {edu.count} orang
                    </Badge>
                    <Badge variant="outline" className="ml-2">
                      {edu.percentage}%
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem({ type: "education", index })}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeItem("education", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderOccupationTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Data Pekerjaan</h3>
        <Button onClick={() => addItem("occupation")} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data
        </Button>
      </div>

      <div className="space-y-3">
        {statistics.occupation.map((job, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              {editingItem?.type === "occupation" && editingItem.index === index ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Pekerjaan</Label>
                    <Input value={job.job} onChange={(e) => updateItem("occupation", index, "job", e.target.value)} />
                  </div>
                  <div>
                    <Label>Jumlah</Label>
                    <Input
                      type="number"
                      value={job.count}
                      onChange={(e) => updateItem("occupation", index, "count", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{job.job}</span>
                    <Badge variant="secondary" className="ml-2">
                      {job.count} orang
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem({ type: "occupation", index })}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeItem("occupation", index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderGenericTab = (
    type: "livestock" | "facilities" | "sports",
    title: string,
    fieldName: string,
    countLabel: string,
  ) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button onClick={() => addItem(type)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data
        </Button>
      </div>

      <div className="space-y-3">
        {statistics[type].map((item: any, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              {editingItem?.type === type && editingItem.index === index ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{fieldName}</Label>
                    <Input
                      value={item[type === "livestock" ? "type" : type === "facilities" ? "facility" : "sport"]}
                      onChange={(e) =>
                        updateItem(
                          type,
                          index,
                          type === "livestock" ? "type" : type === "facilities" ? "facility" : "sport",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Jumlah</Label>
                    <Input
                      type="number"
                      value={item[type === "livestock" ? "owners" : "count"]}
                      onChange={(e) =>
                        updateItem(
                          type,
                          index,
                          type === "livestock" ? "owners" : "count",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">
                      {item[type === "livestock" ? "type" : type === "facilities" ? "facility" : "sport"]}
                    </span>
                    <Badge variant="secondary" className="ml-2">
                      {item[type === "livestock" ? "owners" : "count"]} {countLabel}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingItem({ type, index })}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeItem(type, index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manajemen Statistik Desa</h2>
        <Button onClick={saveStatistics} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Menyimpan..." : "Simpan Semua"}
        </Button>
      </div>

      <Tabs defaultValue="education" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="education">Pendidikan</TabsTrigger>
          <TabsTrigger value="occupation">Pekerjaan</TabsTrigger>
          <TabsTrigger value="livestock">Ternak</TabsTrigger>
          <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
          <TabsTrigger value="sports">Olahraga</TabsTrigger>
        </TabsList>

        <TabsContent value="education">{renderEducationTab()}</TabsContent>

        <TabsContent value="occupation">{renderOccupationTab()}</TabsContent>

        <TabsContent value="livestock">
          {renderGenericTab("livestock", "Data Ternak", "Jenis Ternak", "pemilik")}
        </TabsContent>

        <TabsContent value="facilities">
          {renderGenericTab("facilities", "Data Fasilitas", "Nama Fasilitas", "unit")}
        </TabsContent>

        <TabsContent value="sports">
          {renderGenericTab("sports", "Data Olahraga", "Jenis Olahraga", "unit")}
        </TabsContent>
      </Tabs>
    </div>
  )
}
