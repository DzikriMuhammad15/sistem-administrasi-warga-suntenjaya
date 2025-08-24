"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { ImageUpload } from "./image-upload"
import { RoleGuard } from "./role-guard"

interface VillageInfo {
  id: string
  village_name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  population: number
  area: string
  village_head: string
  logo_url: string
  banner_url: string
  created_at: string
  updated_at: string
}

export function VillageInfoManagement() {
  const [villageInfo, setVillageInfo] = useState<VillageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    fetchVillageInfo()
  }, [])

  const fetchVillageInfo = async () => {
    try {
      const { data, error } = await supabase.from("village_info").select("*").single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is expected for first time
        throw error
      }

      if (data) {
        setVillageInfo(data)
      } else {
        // Create default village info if none exists
        const defaultInfo = {
          village_name: "Desa Suntenjaya",
          description: "",
          address: "",
          phone: "",
          email: "",
          website: "",
          population: 0,
          area: "",
          village_head: "",
          logo_url: "",
          banner_url: "",
        }
        setVillageInfo(defaultInfo as VillageInfo)
      }
    } catch (error) {
      console.error("Error fetching village info:", error)
      setAlert({ type: "error", message: "Failed to fetch village information" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!villageInfo) return

    setSaving(true)
    try {
      const dataToSave = {
        ...villageInfo,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("village_info").upsert(dataToSave).select().single()

      if (error) throw error

      setVillageInfo(data)
      setAlert({ type: "success", message: "Village information updated successfully" })
    } catch (error) {
      console.error("Error saving village info:", error)
      setAlert({ type: "error", message: "Failed to save village information" })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof VillageInfo, value: string | number) => {
    if (!villageInfo) return
    setVillageInfo({ ...villageInfo, [field]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!villageInfo) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load village information</AlertDescription>
      </Alert>
    )
  }

  return (
    <RoleGuard adminOnly>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Village Information</h2>
            <p className="text-muted-foreground">Manage basic village information and settings</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {alert && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="village_name">Village Name</Label>
                  <Input
                    id="village_name"
                    value={villageInfo.village_name}
                    onChange={(e) => handleInputChange("village_name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="village_head">Village Head</Label>
                  <Input
                    id="village_head"
                    value={villageInfo.village_head}
                    onChange={(e) => handleInputChange("village_head", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={villageInfo.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={villageInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="population">Population</Label>
                  <Input
                    id="population"
                    type="number"
                    value={villageInfo.population}
                    onChange={(e) => handleInputChange("population", Number.parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    value={villageInfo.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="e.g., 15.5 km²"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={villageInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={villageInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={villageInfo.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Village Logo</Label>
                <ImageUpload
                  value={villageInfo.logo_url}
                  onChange={(url) => handleInputChange("logo_url", url)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Banner Image</Label>
                <ImageUpload
                  value={villageInfo.banner_url}
                  onChange={(url) => handleInputChange("banner_url", url)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  )
}
