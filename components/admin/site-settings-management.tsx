"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth-provider"
import { Save, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SiteSetting {
  id: string
  setting_key: string
  setting_value: string
  setting_type: string
  description: string
  updated_by: string
  updated_at: string
}

export function SiteSettingsManagement() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      console.error("Error loading settings:", error)
      setMessage({ type: "error", text: "Failed to load site settings" })
    } else {
      const settingsMap: Record<string, string> = {}
      data?.forEach((setting) => {
        settingsMap[setting.setting_key] = setting.setting_value || ""
      })
      setSettings(settingsMap)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      }))

      for (const update of updates) {
        const { error } = await supabase.from("site_settings").upsert(update, { onConflict: "setting_key" })

        if (error) throw error
      }

      setMessage({ type: "success", text: "Settings saved successfully" })
    } catch (error) {
      console.error("Error saving settings:", error)
      setMessage({ type: "error", text: "Failed to save settings" })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
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
          <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
          <p className="text-gray-600">Configure general website settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic website information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                value={settings.site_name || ""}
                onChange={(e) => handleChange("site_name", e.target.value)}
                placeholder="Desa Suntenjaya"
              />
            </div>

            <div>
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                value={settings.site_description || ""}
                onChange={(e) => handleChange("site_description", e.target.value)}
                placeholder="Website Resmi Desa Suntenjaya"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone || ""}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                  placeholder="+62 123 456 7890"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email || ""}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  placeholder="info@desasuntenjaya.id"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contact_address">Contact Address</Label>
              <Textarea
                id="contact_address"
                value={settings.contact_address || ""}
                onChange={(e) => handleChange("contact_address", e.target.value)}
                placeholder="Jl. Desa Suntenjaya No. 1, Kecamatan ABC, Kabupaten XYZ"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
