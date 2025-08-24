"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AdminAPI } from "@/lib/admin-api"
import { ImageUpload } from "./image-upload"
import { toast } from "sonner"

export function WelcomeSectionManagement() {
  const [welcomeData, setWelcomeData] = useState<any>({
    description: "",
    background_image_url: "",
    background_image_path: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadWelcomeData()
  }, [])

  const loadWelcomeData = async () => {
    try {
      const data = await AdminAPI.getWelcomeSection()
      setWelcomeData(data)
    } catch (error) {
      console.error("Error loading welcome data:", error)
      toast.error("Failed to load welcome section data")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await AdminAPI.updateWelcomeSection(welcomeData)
      toast.success("Welcome section updated successfully")
    } catch (error) {
      console.error("Error saving welcome data:", error)
      toast.error("Failed to update welcome section")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (url: string, path: string) => {
    setWelcomeData({
      ...welcomeData,
      background_image_url: url,
      background_image_path: path,
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome Section Management</h2>
        <p className="text-muted-foreground">Manage the welcome section of your homepage</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome Section Settings</CardTitle>
          <CardDescription>Update the background image and description text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="background-image">Background Image</Label>
            <ImageUpload
              onUpload={handleImageUpload}
              currentImage={welcomeData.background_image_url}
              accept="image/*"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description Text</Label>
            <Textarea
              id="description"
              placeholder="Enter welcome description..."
              value={welcomeData.description}
              onChange={(e) => setWelcomeData({ ...welcomeData, description: e.target.value })}
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
