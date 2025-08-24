"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminAPI } from "@/lib/admin-api"
import { toast } from "sonner"
import { Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function VillageStatisticsManagement() {
  const [education, setEducation] = useState<any[]>([])
  const [livelihoods, setLivelihoods] = useState<any[]>([])
  const [livestock, setLivestock] = useState<any[]>([])
  const [infrastructure, setInfrastructure] = useState<any[]>([])
  const [sports, setSports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("education")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    level: "",
    type: "",
    count: 0,
    unit: "unit",
  })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      const [educationData, livelihoodsData, livestockData, infrastructureData, sportsData] = await Promise.all([
        AdminAPI.getEducationStatistics(),
        AdminAPI.getLivelihoods(),
        AdminAPI.getLivestock(),
        AdminAPI.getInfrastructure(),
        AdminAPI.getSportsFacilities(),
      ])

      setEducation(educationData)
      setLivelihoods(livelihoodsData)
      setLivestock(livestockData)
      setInfrastructure(infrastructureData)
      setSports(sportsData)
    } catch (error) {
      console.error("Error loading statistics:", error)
      toast.error("Failed to load statistics data")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      let result
      const data = {
        level: formData.level || formData.type,
        type: formData.type,
        count: formData.count,
        unit: formData.unit,
      }

      if (editingItem) {
        switch (activeTab) {
          case "education":
            result = await AdminAPI.updateEducationStatistic(editingItem.id, data)
            break
          case "livelihoods":
            result = await AdminAPI.updateLivelihood(editingItem.id, data)
            break
          case "livestock":
            result = await AdminAPI.updateLivestock(editingItem.id, data)
            break
          case "infrastructure":
            result = await AdminAPI.updateInfrastructure(editingItem.id, data)
            break
          case "sports":
            result = await AdminAPI.updateSportsFacility(editingItem.id, data)
            break
        }
        toast.success("Item updated successfully")
      } else {
        switch (activeTab) {
          case "education":
            result = await AdminAPI.createEducationStatistic(data)
            break
          case "livelihoods":
            result = await AdminAPI.createLivelihood(data)
            break
          case "livestock":
            result = await AdminAPI.createLivestock(data)
            break
          case "infrastructure":
            result = await AdminAPI.createInfrastructure(data)
            break
          case "sports":
            result = await AdminAPI.createSportsFacility(data)
            break
        }
        toast.success("Item created successfully")
      }

      setIsDialogOpen(false)
      setEditingItem(null)
      setFormData({ level: "", type: "", count: 0, unit: "unit" })
      loadAllData()
    } catch (error) {
      console.error("Error saving item:", error)
      toast.error("Failed to save item")
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      level: item.level || "",
      type: item.type || "",
      count: item.count || 0,
      unit: item.unit || "unit",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        switch (activeTab) {
          case "education":
            await AdminAPI.deleteEducationStatistic(id)
            break
          case "livelihoods":
            await AdminAPI.deleteLivelihood(id)
            break
          case "livestock":
            await AdminAPI.deleteLivestock(id)
            break
          case "infrastructure":
            await AdminAPI.deleteInfrastructure(id)
            break
          case "sports":
            await AdminAPI.deleteSportsFacility(id)
            break
        }
        toast.success("Item deleted successfully")
        loadAllData()
      } catch (error) {
        console.error("Error deleting item:", error)
        toast.error("Failed to delete item")
      }
    }
  }

  const renderStatisticsList = (data: any[], type: string) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{item.level || item.type}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.count}</p>
            {item.unit && item.unit !== "unit" && <p className="text-sm text-muted-foreground">{item.unit}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Village Statistics Management</h2>
          <p className="text-muted-foreground">
            Manage education, livelihoods, livestock, infrastructure, and sports data
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingItem(null)
                setFormData({ level: "", type: "", count: 0, unit: "unit" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the item details" : `Create a new ${activeTab} item`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{activeTab === "education" ? "Education Level" : "Type/Name"}</Label>
                <Input
                  id="name"
                  value={activeTab === "education" ? formData.level : formData.type}
                  onChange={(e) =>
                    activeTab === "education"
                      ? setFormData({ ...formData, level: e.target.value })
                      : setFormData({ ...formData, type: e.target.value })
                  }
                  placeholder={`Enter ${activeTab === "education" ? "education level" : "type/name"}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="count">Count</Label>
                <Input
                  id="count"
                  type="number"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Enter count"
                />
              </div>
              {activeTab === "infrastructure" && (
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Enter unit (e.g., km, unit, etc.)"
                  />
                </div>
              )}
              <Button onClick={handleSave} className="w-full">
                {editingItem ? "Update Item" : "Create Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="livelihoods">Livelihoods</TabsTrigger>
          <TabsTrigger value="livestock">Livestock</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
        </TabsList>

        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Education Statistics</CardTitle>
              <CardDescription>Manage education level data for the village</CardDescription>
            </CardHeader>
            <CardContent>{renderStatisticsList(education, "education")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livelihoods" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Livelihoods</CardTitle>
              <CardDescription>Manage livelihood and occupation data</CardDescription>
            </CardHeader>
            <CardContent>{renderStatisticsList(livelihoods, "livelihoods")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livestock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Livestock</CardTitle>
              <CardDescription>Manage livestock ownership data</CardDescription>
            </CardHeader>
            <CardContent>{renderStatisticsList(livestock, "livestock")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure</CardTitle>
              <CardDescription>Manage village infrastructure data</CardDescription>
            </CardHeader>
            <CardContent>{renderStatisticsList(infrastructure, "infrastructure")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sports Facilities</CardTitle>
              <CardDescription>Manage sports and recreational facilities</CardDescription>
            </CardHeader>
            <CardContent>{renderStatisticsList(sports, "sports")}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
