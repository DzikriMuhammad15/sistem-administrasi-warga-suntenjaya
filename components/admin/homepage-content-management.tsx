"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "./image-upload"
import { Plus, Edit, Save, X, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"

interface HomepageContent {
  id: string
  section_name: string
  title: string
  subtitle: string
  content: string
  image_path: string
  is_active: boolean
  display_order: number
  created_by: string
  created_at: string
  updated_at: string
}

export function HomepageContentManagement() {
  const [contents, setContents] = useState<HomepageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const { user } = useAuth()

  const [formData, setFormData] = useState({
    section_name: "",
    title: "",
    subtitle: "",
    content: "",
    image_path: "",
    is_active: true,
    display_order: 0,
  })

  useEffect(() => {
    loadContents()
  }, [])

  const loadContents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("homepage_content")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error loading contents:", error)
      setMessage({ type: "error", text: "Failed to load homepage content" })
    } else {
      setContents(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!user) return

    try {
      if (editingId) {
        const { error } = await supabase
          .from("homepage_content")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId)

        if (error) throw error
        setMessage({ type: "success", text: "Content updated successfully" })
      } else {
        const { error } = await supabase.from("homepage_content").insert({
          ...formData,
          created_by: user.id, // langsung dari supabase.auth user
        })

        if (error) throw error
        setMessage({ type: "success", text: "Content created successfully" })
      }

      setEditingId(null)
      setIsCreating(false)
      resetForm()
      loadContents()
    } catch (error) {
      console.error("Error saving content:", error)
      setMessage({ type: "error", text: "Failed to save content" })
    }
  }

  const handleEdit = (content: HomepageContent) => {
    setFormData({
      section_name: content.section_name,
      title: content.title,
      subtitle: content.subtitle,
      content: content.content,
      image_path: content.image_path,
      is_active: content.is_active,
      display_order: content.display_order,
    })
    setEditingId(content.id)
    setIsCreating(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return

    try {
      const { error } = await supabase.from("homepage_content").delete().eq("id", id)

      if (error) throw error
      setMessage({ type: "success", text: "Content deleted successfully" })
      loadContents()
    } catch (error) {
      console.error("Error deleting content:", error)
      setMessage({ type: "error", text: "Failed to delete content" })
    }
  }

  const resetForm = () => {
    setFormData({
      section_name: "",
      title: "",
      subtitle: "",
      content: "",
      image_path: "",
      is_active: true,
      display_order: 0,
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
          <h2 className="text-2xl font-bold text-gray-900">Homepage Content Management</h2>
          <p className="text-gray-600">Manage dynamic content sections for the homepage</p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingId}>
          <Plus className="mr-2 h-4 w-4" />
          Add Content Section
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
            <CardTitle>{editingId ? "Edit Content Section" : "Create New Content Section"}</CardTitle>
            <CardDescription>
              {editingId ? "Update the content section details" : "Add a new content section to the homepage"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* form content sama persis */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="section_name">Section Name</Label>
                <Input
                  id="section_name"
                  value={formData.section_name}
                  onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
                  placeholder="e.g., hero, profile, history"
                />
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Section title"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Section subtitle"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Section content"
                rows={4}
              />
            </div>

            <div>
              <Label>Featured Image</Label>
              <ImageUpload
                value={formData.image_path}
                onChange={(path) => setFormData({ ...formData, image_path: path })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                {editingId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {contents.map((content) => (
          <Card key={content.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{content.section_name}</Badge>
                    <Badge variant={content.is_active ? "default" : "secondary"}>
                      {content.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-gray-500">Order: {content.display_order}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{content.title}</h3>
                  {content.subtitle && <p className="text-gray-600 mb-2">{content.subtitle}</p>}
                  <p className="text-gray-700 text-sm line-clamp-2">{content.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Updated: {new Date(content.updated_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(content)}
                    disabled={isCreating || !!editingId}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(content.id)}
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
