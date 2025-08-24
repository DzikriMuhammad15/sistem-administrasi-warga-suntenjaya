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
import { Plus, Edit, Trash2, ExternalLink, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function VillageServicesManagement() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon_url: "",
    icon_path: "",
    google_form_url: "",
    google_form_response_url: "",
  })

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const data = await AdminAPI.getVillageServices()
      setServices(data)
    } catch (error) {
      console.error("Error loading services:", error)
      toast.error("Failed to load village services")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingService) {
        await AdminAPI.updateVillageService(editingService.id, formData)
        toast.success("Service updated successfully")
      } else {
        await AdminAPI.createVillageService(formData)
        toast.success("Service created successfully")
      }

      setIsDialogOpen(false)
      setEditingService(null)
      setFormData({
        name: "",
        description: "",
        icon_url: "",
        icon_path: "",
        google_form_url: "",
        google_form_response_url: "",
      })
      loadServices()
    } catch (error) {
      console.error("Error saving service:", error)
      toast.error("Failed to save service")
    }
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      icon_url: service.icon_url || "",
      icon_path: service.icon_path || "",
      google_form_url: service.google_form_url || "",
      google_form_response_url: service.google_form_response_url || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await AdminAPI.deleteVillageService(id)
        toast.success("Service deleted successfully")
        loadServices()
      } catch (error) {
        console.error("Error deleting service:", error)
        toast.error("Failed to delete service")
      }
    }
  }

  const handleIconUpload = (url: string, path: string) => {
    setFormData({ ...formData, icon_url: url, icon_path: path })
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Village Services Management</h2>
          <p className="text-muted-foreground">Manage village services with Google Forms integration</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingService(null)
                setFormData({
                  name: "",
                  description: "",
                  icon_url: "",
                  icon_path: "",
                  google_form_url: "",
                  google_form_response_url: "",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
              <DialogDescription>
                {editingService ? "Update the service details" : "Create a new village service"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter service name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter service description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Service Icon</Label>
                <ImageUpload
                  onUpload={handleIconUpload}
                  currentImage={formData.icon_url}
                  accept="image/*"
                  placeholder="Upload service icon (optional - defaults to document icon)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-url">Google Form URL</Label>
                <Input
                  id="form-url"
                  value={formData.google_form_url}
                  onChange={(e) => setFormData({ ...formData, google_form_url: e.target.value })}
                  placeholder="https://forms.google.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="response-url">Google Form Response URL (Admin Only)</Label>
                <Input
                  id="response-url"
                  value={formData.google_form_response_url}
                  onChange={(e) => setFormData({ ...formData, google_form_response_url: e.target.value })}
                  placeholder="https://docs.google.com/spreadsheets/..."
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingService ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {service.icon_url ? (
                    <img
                      src={service.icon_url || "/placeholder.svg"}
                      alt={service.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {service.google_form_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={service.google_form_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Form
                      </a>
                    </Button>
                  )}
                  {service.google_form_response_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={service.google_form_response_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Responses
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
