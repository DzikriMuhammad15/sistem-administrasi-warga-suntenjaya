"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminAPI } from "@/lib/admin-api"
import { ImageUpload } from "./image-upload"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Palette, Crown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ArtsCultureManagement() {
  const [artsCulture, setArtsCulture] = useState<any[]>([])
  const [culturalHeritage, setCulturalHeritage] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("arts")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    image_url: "",
    image_path: "",
  })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      const [artsData, heritageData] = await Promise.all([AdminAPI.getArtsCulture(), AdminAPI.getCulturalHeritage()])

      setArtsCulture(artsData)
      setCulturalHeritage(heritageData)
    } catch (error) {
      console.error("Error loading arts and culture data:", error)
      toast.error("Failed to load arts and culture data")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingItem) {
        if (activeTab === "arts") {
          await AdminAPI.updateArtsCulture(editingItem.id, formData)
        } else {
          await AdminAPI.updateCulturalHeritage(editingItem.id, formData)
        }
        toast.success("Item updated successfully")
      } else {
        if (activeTab === "arts") {
          await AdminAPI.createArtsCulture(formData)
        } else {
          await AdminAPI.createCulturalHeritage(formData)
        }
        toast.success("Item created successfully")
      }

      setIsDialogOpen(false)
      setEditingItem(null)
      setFormData({ name: "", type: "", description: "", image_url: "", image_path: "" })
      loadAllData()
    } catch (error) {
      console.error("Error saving item:", error)
      toast.error("Failed to save item")
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      type: item.type || "",
      description: item.description || "",
      image_url: item.image_url || "",
      image_path: item.image_path || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        if (activeTab === "arts") {
          await AdminAPI.deleteArtsCulture(id)
        } else {
          await AdminAPI.deleteCulturalHeritage(id)
        }
        toast.success("Item deleted successfully")
        loadAllData()
      } catch (error) {
        console.error("Error deleting item:", error)
        toast.error("Failed to delete item")
      }
    }
  }

  const handleImageUpload = (url: string, path: string) => {
    setFormData({ ...formData, image_url: url, image_path: path })
  }

  const renderItemsList = (data: any[], type: string) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{item.name}</CardTitle>
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
            <div className="space-y-3">
              {item.image_url && (
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              {item.type && <p className="text-sm font-medium text-blue-600">{item.type}</p>}
              <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
            </div>
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
          <h2 className="text-2xl font-bold">Arts & Culture Management</h2>
          <p className="text-muted-foreground">Manage village arts, cultural activities, and heritage</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingItem(null)
                setFormData({ name: "", type: "", description: "", image_url: "", image_path: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === "arts" ? "Arts & Culture" : "Heritage"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem
                  ? `Edit ${activeTab === "arts" ? "Arts & Culture" : "Heritage"}`
                  : `Add New ${activeTab === "arts" ? "Arts & Culture" : "Heritage"}`}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the item details" : `Create a new ${activeTab} item`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              {activeTab === "arts" && (
                <div className="space-y-2">
                  <Label htmlFor="type">Type/Category</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Traditional Dance, Music, Craft"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <ImageUpload onUpload={handleImageUpload} currentImage={formData.image_url} accept="image/*" />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingItem ? "Update Item" : "Create Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="arts" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Arts & Culture
          </TabsTrigger>
          <TabsTrigger value="heritage" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Cultural Heritage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="arts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Arts & Cultural Activities</CardTitle>
              <CardDescription>Manage traditional arts, performances, and cultural activities</CardDescription>
            </CardHeader>
            <CardContent>{renderItemsList(artsCulture, "arts")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heritage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Heritage</CardTitle>
              <CardDescription>Manage cultural heritage sites, artifacts, and traditions</CardDescription>
            </CardHeader>
            <CardContent>{renderItemsList(culturalHeritage, "heritage")}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
