"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AdminAPI } from "@/lib/admin-api"
import { ImageUpload } from "./image-upload"
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

export function GovernmentStructureManagement() {
  const [positions, setPositions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPosition, setEditingPosition] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    photo_url: "",
    photo_path: "",
    order_index: 0,
  })

  useEffect(() => {
    loadPositions()
  }, [])

  const loadPositions = async () => {
    try {
      const data = await AdminAPI.getGovernmentStructure()
      setPositions(data)
    } catch (error) {
      console.error("Error loading positions:", error)
      toast.error("Failed to load government positions")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingPosition) {
        await AdminAPI.updateGovernmentPosition(editingPosition.id, formData)
        toast.success("Position updated successfully")
      } else {
        await AdminAPI.createGovernmentPosition(formData)
        toast.success("Position created successfully")
      }

      setIsDialogOpen(false)
      setEditingPosition(null)
      setFormData({ name: "", position: "", photo_url: "", photo_path: "", order_index: 0 })
      loadPositions()
    } catch (error) {
      console.error("Error saving position:", error)
      toast.error("Failed to save position")
    }
  }

  const handleEdit = (position: any) => {
    setEditingPosition(position)
    setFormData({
      name: position.name,
      position: position.position,
      photo_url: position.photo_url || "",
      photo_path: position.photo_path || "",
      order_index: position.order_index || 0,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this position?")) {
      try {
        await AdminAPI.deleteGovernmentPosition(id)
        toast.success("Position deleted successfully")
        loadPositions()
      } catch (error) {
        console.error("Error deleting position:", error)
        toast.error("Failed to delete position")
      }
    }
  }

  const handleImageUpload = (url: string, path: string) => {
    setFormData({ ...formData, photo_url: url, photo_path: path })
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Government Structure Management</h2>
          <p className="text-muted-foreground">Manage village government positions and officials</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPosition(null)
                setFormData({ name: "", position: "", photo_url: "", photo_path: "", order_index: 0 })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPosition ? "Edit Position" : "Add New Position"}</DialogTitle>
              <DialogDescription>
                {editingPosition ? "Update the position details" : "Create a new government position"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter official name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="Enter position title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Display order"
                />
              </div>
              <div className="space-y-2">
                <Label>Photo</Label>
                <ImageUpload onUpload={handleImageUpload} currentImage={formData.photo_url} accept="image/*" />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingPosition ? "Update Position" : "Create Position"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {positions.map((position) => (
          <Card key={position.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{position.position}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(position)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(position.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {position.photo_url && (
                  <img
                    src={position.photo_url || "/placeholder.svg"}
                    alt={position.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                <p className="font-medium">{position.name}</p>
                <p className="text-sm text-muted-foreground">Order: {position.order_index}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
