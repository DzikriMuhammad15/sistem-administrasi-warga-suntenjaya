"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AdminAPI } from "@/lib/admin-api"
import { toast } from "sonner"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function ContactManagement() {
  const [contactData, setContactData] = useState<any>({
    address: "",
    phone: "",
    email: "",
    service_hours: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadContactData()
  }, [])

  const loadContactData = async () => {
    try {
      const data = await AdminAPI.getContactInfo()
      setContactData(data)
    } catch (error) {
      console.error("Error loading contact data:", error)
      toast.error("Failed to load contact information")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await AdminAPI.updateContactInfo(contactData)
      toast.success("Contact information updated successfully")
    } catch (error) {
      console.error("Error saving contact data:", error)
      toast.error("Failed to update contact information")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setContactData({ ...contactData, [field]: value })
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Contact Information Management</h2>
        <p className="text-muted-foreground">Manage village contact details and social media links</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Basic Contact Information
            </CardTitle>
            <CardDescription>Update address, phone, email, and service hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Textarea
                id="address"
                value={contactData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter village address"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={contactData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+62 xxx xxx xxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={contactData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="desa@suntenjaya.id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-hours" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Service Hours
              </Label>
              <Input
                id="service-hours"
                value={contactData.service_hours}
                onChange={(e) => handleInputChange("service_hours", e.target.value)}
                placeholder="Senin - Jumat: 08:00 - 16:00"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Facebook className="h-5 w-5" />
              Social Media Links
            </CardTitle>
            <CardDescription>Update social media profiles and links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook URL
              </Label>
              <Input
                id="facebook"
                value={contactData.facebook_url}
                onChange={(e) => handleInputChange("facebook_url", e.target.value)}
                placeholder="https://facebook.com/desasuntenjaya"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram URL
              </Label>
              <Input
                id="instagram"
                value={contactData.instagram_url}
                onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                placeholder="https://instagram.com/desasuntenjaya"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter URL
              </Label>
              <Input
                id="twitter"
                value={contactData.twitter_url}
                onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                placeholder="https://twitter.com/desasuntenjaya"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                YouTube URL
              </Label>
              <Input
                id="youtube"
                value={contactData.youtube_url}
                onChange={(e) => handleInputChange("youtube_url", e.target.value)}
                placeholder="https://youtube.com/@desasuntenjaya"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Contact Information"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
