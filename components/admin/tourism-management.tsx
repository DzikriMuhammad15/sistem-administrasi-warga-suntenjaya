"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AdminAPI } from "@/lib/admin-api"
import { ImageUpload } from "./image-upload"
import { toast } from "sonner"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function TourismManagement() {
  const [tourism, setTourism] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTourism, setEditingTourism] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    image_url: "",
    image_path: "",
  })

  useEffect(() => {
    loadTourism()
  }, [])

  const loadTourism = async () => {
    try {
      const data = await AdminAPI.getTourism()
      setTourism(data)
    } catch (error) {
      console.error("Error loading tourism:", error)
      toast.error("Failed to load tourism data")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingTourism) {
        await AdminAPI.updateTourism(editingTourism.id, formData)
        toast.success("Tourism destination updated successfully")
      } else {
        await AdminAPI.createTourism(formData)
        toast.success("Tourism destination created successfully")
      }

      setIsDialogOpen(false)
      setEditingTourism(null)
      setFormData({ name: "", description: "", location: "", image_url: "", image_path: "" })
      loadTourism()
    } catch (error) {
      console.error("Error saving tourism:", error)
      toast.error("Failed to save tourism destination")
    }
  }

  const handleEdit = (item: any) => {
    setEditingTourism(item)
    setFormData({
      name: item.name,
      description: item.description,
      location: item.location || "",
      image_url: item.image_url || "",
      image_path: item.image_path || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this tourism destination?")) {
      try {
        await AdminAPI.deleteTourism(id)
        toast.success("Tourism destination deleted successfully")
        loadTourism()
      } catch (error) {
        console.error("Error deleting tourism:", error)
        toast.error("Failed to delete tourism destination")
      }
    }
  }

  const handleImageUpload = (url: string, path: string) => {
    setFormData({ ...formData, image_url: url, image_path: path })
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tourism Management</h2>
          <p className="text-muted-foreground">Manage village tourism destinations and attractions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTourism(null)
                setFormData({ name: "", description: "", location: "", image_url: "", image_path: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tourism Destination
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTourism ? "Edit Tourism Destination" : "Add New Tourism Destination"}</DialogTitle>
              <DialogDescription>
                {editingTourism ? "Update the destination details" : "Create a new tourism destination"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Destination Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter destination name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter destination description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Destination Image</Label>
                <ImageUpload onUpload={handleImageUpload} currentImage={formData.image_url} accept="image/*" />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingTourism ? "Update Destination" : "Create Destination"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tourism.map((item) => (
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
                {item.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
