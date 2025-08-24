"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminAPI } from "@/lib/admin-api"
import { ImageUpload } from "./image-upload"
import { toast } from "sonner"
import { Save, RefreshCw, MapPin, Users, Mountain, Globe } from "lucide-react"

export function VillageProfileManagement() {
  const [profile, setProfile] = useState<any>({
    coordinates: "",
    altitude: "",
    temperature: "",
    land_area: 0,
    total_population: 0,
    male_population: 0,
    female_population: 0,
    total_hamlets: 0,
    total_rw: 0,
    total_rt: 0,
    state_forest_area: 0,
    agricultural_land_area: 0,
    agriculture_area: 0,
    fields_area: 0,
    residential_area: 0,
    north_boundary: "",
    south_boundary: "",
    west_boundary: "",
    east_boundary: "",
    village_vision: "",
    village_history: "",
    profile_image_url: "",
    profile_image_path: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const data = await AdminAPI.getVillageProfileData()
      setProfile(data)
    } catch (error) {
      console.error("Error loading profile:", error)
      toast.error("Failed to load village profile data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await AdminAPI.updateVillageProfileData(profile)
      toast.success("Village profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to update village profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = (url: string, path: string) => {
    setProfile({ ...profile, profile_image_url: url, profile_image_path: path })
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading village profile data...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Village Profile Management</h2>
          <p className="text-gray-600">Manage village geographic, demographic, and administrative data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadProfile} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="demographic" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Demographics
          </TabsTrigger>
          <TabsTrigger value="geography" className="flex items-center gap-2">
            <Mountain className="h-4 w-4" />
            Geography
          </TabsTrigger>
          <TabsTrigger value="identity" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Identity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Location coordinates, altitude, temperature, and land area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coordinates">Coordinates</Label>
                  <Input
                    id="coordinates"
                    value={profile.coordinates}
                    onChange={(e) => setProfile({ ...profile, coordinates: e.target.value })}
                    placeholder="e.g., 11,68° LU, 6°49'45,268 LS"
                  />
                </div>
                <div>
                  <Label htmlFor="altitude">Altitude</Label>
                  <Input
                    id="altitude"
                    value={profile.altitude}
                    onChange={(e) => setProfile({ ...profile, altitude: e.target.value })}
                    placeholder="e.g., 1280-1290 mdpl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    value={profile.temperature}
                    onChange={(e) => setProfile({ ...profile, temperature: e.target.value })}
                    placeholder="e.g., 20-24°C"
                  />
                </div>
                <div>
                  <Label htmlFor="land-area">Total Land Area (Ha)</Label>
                  <Input
                    id="land-area"
                    type="number"
                    step="0.01"
                    value={profile.land_area}
                    onChange={(e) => setProfile({ ...profile, land_area: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <Label>Profile Image</Label>
                <ImageUpload onUpload={handleImageUpload} currentImage={profile.profile_image_url} accept="image/*" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Population Data</CardTitle>
              <CardDescription>Current population statistics and demographics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="total-population">Total Population</Label>
                <Input
                  id="total-population"
                  type="number"
                  value={profile.total_population}
                  onChange={(e) => setProfile({ ...profile, total_population: Number.parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="male-population">Male Population</Label>
                  <Input
                    id="male-population"
                    type="number"
                    value={profile.male_population}
                    onChange={(e) => setProfile({ ...profile, male_population: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="female-population">Female Population</Label>
                  <Input
                    id="female-population"
                    type="number"
                    value={profile.female_population}
                    onChange={(e) =>
                      setProfile({ ...profile, female_population: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hamlets">Number of Hamlets</Label>
                  <Input
                    id="hamlets"
                    type="number"
                    value={profile.total_hamlets}
                    onChange={(e) => setProfile({ ...profile, total_hamlets: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="rw">Number of RW</Label>
                  <Input
                    id="rw"
                    type="number"
                    value={profile.total_rw}
                    onChange={(e) => setProfile({ ...profile, total_rw: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="rt">Number of RT</Label>
                  <Input
                    id="rt"
                    type="number"
                    value={profile.total_rt}
                    onChange={(e) => setProfile({ ...profile, total_rt: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Land Usage Distribution</CardTitle>
              <CardDescription>Distribution of land usage across different categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state-forest">State Forest Area (Ha)</Label>
                  <Input
                    id="state-forest"
                    type="number"
                    step="0.01"
                    value={profile.state_forest_area}
                    onChange={(e) =>
                      setProfile({ ...profile, state_forest_area: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="agricultural-land">Agricultural Land Area (Ha)</Label>
                  <Input
                    id="agricultural-land"
                    type="number"
                    step="0.01"
                    value={profile.agricultural_land_area}
                    onChange={(e) =>
                      setProfile({ ...profile, agricultural_land_area: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="agriculture">Agriculture Area (Ha)</Label>
                  <Input
                    id="agriculture"
                    type="number"
                    step="0.01"
                    value={profile.agriculture_area}
                    onChange={(e) =>
                      setProfile({ ...profile, agriculture_area: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="fields">Fields Area (Ha)</Label>
                  <Input
                    id="fields"
                    type="number"
                    step="0.01"
                    value={profile.fields_area}
                    onChange={(e) => setProfile({ ...profile, fields_area: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="residential">Residential Area (Ha)</Label>
                  <Input
                    id="residential"
                    type="number"
                    step="0.01"
                    value={profile.residential_area}
                    onChange={(e) =>
                      setProfile({ ...profile, residential_area: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Village Boundaries</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="north-boundary">North Boundary</Label>
                    <Input
                      id="north-boundary"
                      value={profile.north_boundary}
                      onChange={(e) => setProfile({ ...profile, north_boundary: e.target.value })}
                      placeholder="e.g., Desa Cupunagara"
                    />
                  </div>
                  <div>
                    <Label htmlFor="south-boundary">South Boundary</Label>
                    <Input
                      id="south-boundary"
                      value={profile.south_boundary}
                      onChange={(e) => setProfile({ ...profile, south_boundary: e.target.value })}
                      placeholder="e.g., Desa Cikadut"
                    />
                  </div>
                  <div>
                    <Label htmlFor="west-boundary">West Boundary</Label>
                    <Input
                      id="west-boundary"
                      value={profile.west_boundary}
                      onChange={(e) => setProfile({ ...profile, west_boundary: e.target.value })}
                      placeholder="e.g., Desa Cibodas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="east-boundary">East Boundary</Label>
                    <Input
                      id="east-boundary"
                      value={profile.east_boundary}
                      onChange={(e) => setProfile({ ...profile, east_boundary: e.target.value })}
                      placeholder="e.g., Desa Cipanjalu"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Village Identity</CardTitle>
              <CardDescription>Vision and history of the village</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vision">Village Vision</Label>
                <Textarea
                  id="vision"
                  value={profile.village_vision}
                  onChange={(e) => setProfile({ ...profile, village_vision: e.target.value })}
                  placeholder="Enter the village vision statement..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="history">Village History</Label>
                <Textarea
                  id="history"
                  value={profile.village_history}
                  onChange={(e) => setProfile({ ...profile, village_history: e.target.value })}
                  placeholder="Enter the village history..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
