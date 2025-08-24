"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AdminAPI } from "@/lib/admin-api"
import {
  type GovernmentData,
  type GovernmentOfficial,
  type VillageHead,
  type VillageInstitution,
  GOVERNMENT_POSITIONS,
  INSTITUTION_TYPES,
} from "@/types/government"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Users,
  Building,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  UserX,
} from "lucide-react"

export function GovernmentManagement() {
  const [governmentData, setGovernmentData] = useState<GovernmentData>({
    officials: [],
    villageHeads: [],
    institutions: [],
    totalOfficials: 0,
    lastUpdated: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState("officials")

  // Dialog states
  const [isOfficialDialogOpen, setIsOfficialDialogOpen] = useState(false)
  const [isVillageHeadDialogOpen, setIsVillageHeadDialogOpen] = useState(false)
  const [isInstitutionDialogOpen, setIsInstitutionDialogOpen] = useState(false)

  // Editing states
  const [editingOfficial, setEditingOfficial] = useState<GovernmentOfficial | null>(null)
  const [editingVillageHead, setEditingVillageHead] = useState<VillageHead | null>(null)
  const [editingInstitution, setEditingInstitution] = useState<VillageInstitution | null>(null)

  // Form states
  const [officialForm, setOfficialForm] = useState({
    position: "",
    name: "",
    icon: "👨‍💼",
    department: "",
    phone: "",
    email: "",
    startDate: "",
    status: "active" as const,
  })

  const [villageHeadForm, setVillageHeadForm] = useState({
    dusun: "",
    name: "",
    population: "",
    phone: "",
    email: "",
    startDate: "",
    status: "active" as const,
  })

  const [institutionForm, setInstitutionForm] = useState({
    name: "",
    members: 0,
    leader: "",
    description: "",
    establishedDate: "",
    status: "active" as const,
  })

  useEffect(() => {
    loadGovernmentData()
  }, [])

  const loadGovernmentData = async () => {
    setIsLoading(true)
    try {
      const data = await AdminAPI.getGovernmentData()
      setGovernmentData(data)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load government data" })
      // Load mock data if API fails
      setGovernmentData({
        officials: [
          { id: 1, position: "Kepala Desa", name: "Asep Wahyono", icon: "👨‍💼", status: "active" },
          { id: 2, position: "Sekretaris Desa", name: "Dase", icon: "📋", status: "active" },
          { id: 3, position: "Kaur Perencanaan", name: "Fajar R", icon: "📊", status: "active" },
          { id: 4, position: "Kaur Keuangan", name: "Kania P", icon: "💰", status: "active" },
          { id: 5, position: "Kaur Umum", name: "Iwan S", icon: "📄", status: "active" },
          { id: 6, position: "Kasi Pemerintahan", name: "Rony Fasyrah", icon: "🏛️", status: "active" },
          { id: 7, position: "Kasi Pelayanan", name: "Tiarawati", icon: "🤝", status: "active" },
          { id: 8, position: "Kasi Kesra", name: "Sansan S", icon: "❤️", status: "active" },
          { id: 9, position: "Staf Keuangan", name: "Suryani", icon: "💼", status: "active" },
        ],
        villageHeads: [
          { id: 1, dusun: "Dusun 1", name: "Kiki Andrian", population: "2.984 jiwa", status: "active" },
          { id: 2, dusun: "Dusun 2", name: "Vicky P", population: "1.902 jiwa", status: "active" },
          { id: 3, dusun: "Dusun 3", name: "Rahmat S M", population: "1.878 jiwa", status: "active" },
          { id: 4, dusun: "Dusun 4", name: "Sandi A", population: "1.894 jiwa", status: "active" },
        ],
        institutions: [
          { id: 1, name: "BPD", members: 7, leader: "Toto Juanto", status: "active" },
          { id: 2, name: "RT", members: 50, leader: "-", status: "active" },
          { id: 3, name: "RW", members: 17, leader: "-", status: "active" },
          { id: 4, name: "PKK dan Kader PKK", members: 30, leader: "-", status: "active" },
          { id: 5, name: "LPM", members: 5, leader: "-", status: "active" },
          { id: 6, name: "Kader Posyandu", members: 100, leader: "-", status: "active" },
          { id: 7, name: "Karang Taruna", members: 32, leader: "-", status: "active" },
          { id: 8, name: "Linmas", members: 32, leader: "-", status: "active" },
          { id: 9, name: "BUMDES", members: 3, leader: "-", status: "active" },
          { id: 10, name: "MUI", members: 17, leader: "-", status: "active" },
          { id: 11, name: "DKM", members: 85, leader: "-", status: "active" },
          { id: 12, name: "Guru Ngaji", members: 90, leader: "-", status: "active" },
        ],
        totalOfficials: 13,
        lastUpdated: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveGovernmentData = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      await AdminAPI.updateGovernmentData(governmentData)
      setMessage({ type: "success", text: "Government data updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update government data" })
    } finally {
      setIsSaving(false)
    }
  }

  // Official management functions
  const handleSaveOfficial = () => {
    if (editingOfficial) {
      setGovernmentData((prev) => ({
        ...prev,
        officials: prev.officials.map((official) =>
          official.id === editingOfficial.id
            ? { ...editingOfficial, ...officialForm, id: editingOfficial.id }
            : official,
        ),
      }))
    } else {
      const newOfficial: GovernmentOfficial = {
        id: Date.now(),
        ...officialForm,
      }
      setGovernmentData((prev) => ({
        ...prev,
        officials: [...prev.officials, newOfficial],
        totalOfficials: prev.totalOfficials + 1,
      }))
    }
    resetOfficialForm()
    setIsOfficialDialogOpen(false)
  }

  const handleEditOfficial = (official: GovernmentOfficial) => {
    setEditingOfficial(official)
    setOfficialForm({
      position: official.position,
      name: official.name,
      icon: official.icon,
      department: official.department || "",
      phone: official.phone || "",
      email: official.email || "",
      startDate: official.startDate || "",
      status: official.status,
    })
    setIsOfficialDialogOpen(true)
  }

  const handleDeleteOfficial = (id: number) => {
    if (!confirm("Are you sure you want to delete this official?")) return
    setGovernmentData((prev) => ({
      ...prev,
      officials: prev.officials.filter((official) => official.id !== id),
      totalOfficials: prev.totalOfficials - 1,
    }))
  }

  const resetOfficialForm = () => {
    setOfficialForm({
      position: "",
      name: "",
      icon: "👨‍💼",
      department: "",
      phone: "",
      email: "",
      startDate: "",
      status: "active",
    })
    setEditingOfficial(null)
  }

  // Village Head management functions
  const handleSaveVillageHead = () => {
    if (editingVillageHead) {
      setGovernmentData((prev) => ({
        ...prev,
        villageHeads: prev.villageHeads.map((head) =>
          head.id === editingVillageHead.id
            ? { ...editingVillageHead, ...villageHeadForm, id: editingVillageHead.id }
            : head,
        ),
      }))
    } else {
      const newVillageHead: VillageHead = {
        id: Date.now(),
        ...villageHeadForm,
      }
      setGovernmentData((prev) => ({
        ...prev,
        villageHeads: [...prev.villageHeads, newVillageHead],
      }))
    }
    resetVillageHeadForm()
    setIsVillageHeadDialogOpen(false)
  }

  const handleEditVillageHead = (head: VillageHead) => {
    setEditingVillageHead(head)
    setVillageHeadForm({
      dusun: head.dusun,
      name: head.name,
      population: head.population,
      phone: head.phone || "",
      email: head.email || "",
      startDate: head.startDate || "",
      status: head.status,
    })
    setIsVillageHeadDialogOpen(true)
  }

  const handleDeleteVillageHead = (id: number) => {
    if (!confirm("Are you sure you want to delete this village head?")) return
    setGovernmentData((prev) => ({
      ...prev,
      villageHeads: prev.villageHeads.filter((head) => head.id !== id),
    }))
  }

  const resetVillageHeadForm = () => {
    setVillageHeadForm({
      dusun: "",
      name: "",
      population: "",
      phone: "",
      email: "",
      startDate: "",
      status: "active",
    })
    setEditingVillageHead(null)
  }

  // Institution management functions
  const handleSaveInstitution = () => {
    if (editingInstitution) {
      setGovernmentData((prev) => ({
        ...prev,
        institutions: prev.institutions.map((institution) =>
          institution.id === editingInstitution.id
            ? { ...editingInstitution, ...institutionForm, id: editingInstitution.id }
            : institution,
        ),
      }))
    } else {
      const newInstitution: VillageInstitution = {
        id: Date.now(),
        ...institutionForm,
      }
      setGovernmentData((prev) => ({
        ...prev,
        institutions: [...prev.institutions, newInstitution],
      }))
    }
    resetInstitutionForm()
    setIsInstitutionDialogOpen(false)
  }

  const handleEditInstitution = (institution: VillageInstitution) => {
    setEditingInstitution(institution)
    setInstitutionForm({
      name: institution.name,
      members: institution.members,
      leader: institution.leader,
      description: institution.description || "",
      establishedDate: institution.establishedDate || "",
      status: institution.status,
    })
    setIsInstitutionDialogOpen(true)
  }

  const handleDeleteInstitution = (id: number) => {
    if (!confirm("Are you sure you want to delete this institution?")) return
    setGovernmentData((prev) => ({
      ...prev,
      institutions: prev.institutions.filter((institution) => institution.id !== id),
    }))
  }

  const resetInstitutionForm = () => {
    setInstitutionForm({
      name: "",
      members: 0,
      leader: "",
      description: "",
      establishedDate: "",
      status: "active",
    })
    setEditingInstitution(null)
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">
        <UserCheck className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">
        <UserX className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading government data...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Government Data Management</h2>
          <p className="text-gray-600">Manage village government structure, officials, and institutions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadGovernmentData} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSaveGovernmentData} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Officials</p>
                <p className="text-3xl font-bold text-blue-600">{governmentData.officials.length}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Village Heads</p>
                <p className="text-3xl font-bold text-green-600">{governmentData.villageHeads.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Institutions</p>
                <p className="text-3xl font-bold text-purple-600">{governmentData.institutions.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="officials" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Government Officials
          </TabsTrigger>
          <TabsTrigger value="village-heads" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Village Heads
          </TabsTrigger>
          <TabsTrigger value="institutions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Institutions
          </TabsTrigger>
        </TabsList>

        {/* Government Officials Tab */}
        <TabsContent value="officials" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Government Officials</h3>
            <Dialog open={isOfficialDialogOpen} onOpenChange={setIsOfficialDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetOfficialForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Official
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingOfficial ? "Edit Official" : "Add New Official"}</DialogTitle>
                  <DialogDescription>
                    {editingOfficial ? "Update official information" : "Add a new government official"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <Select
                      value={officialForm.position}
                      onValueChange={(value) => setOfficialForm((prev) => ({ ...prev, position: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {GOVERNMENT_POSITIONS.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={officialForm.name}
                      onChange={(e) => setOfficialForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="icon">Icon</Label>
                      <Input
                        id="icon"
                        value={officialForm.icon}
                        onChange={(e) => setOfficialForm((prev) => ({ ...prev, icon: e.target.value }))}
                        placeholder="👨‍💼"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={officialForm.status}
                        onValueChange={(value: "active" | "inactive") =>
                          setOfficialForm((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={officialForm.phone}
                        onChange={(e) => setOfficialForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={officialForm.email}
                        onChange={(e) => setOfficialForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={officialForm.startDate}
                      onChange={(e) => setOfficialForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOfficialDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveOfficial}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingOfficial ? "Update" : "Add"} Official
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {governmentData.officials.map((official) => (
              <Card key={official.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{official.icon}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{official.name}</h4>
                        <p className="text-sm text-gray-600">{official.position}</p>
                        <div className="flex items-center gap-4 mt-1">
                          {official.phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone className="h-3 w-3" />
                              <span>{official.phone}</span>
                            </div>
                          )}
                          {official.email && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span>{official.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(official.status)}
                      <Button variant="outline" size="sm" onClick={() => handleEditOfficial(official)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteOfficial(official.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Village Heads Tab */}
        <TabsContent value="village-heads" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Village Heads (Kepala Dusun)</h3>
            <Dialog open={isVillageHeadDialogOpen} onOpenChange={setIsVillageHeadDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetVillageHeadForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Village Head
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingVillageHead ? "Edit Village Head" : "Add New Village Head"}</DialogTitle>
                  <DialogDescription>
                    {editingVillageHead ? "Update village head information" : "Add a new village head"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dusun">Dusun *</Label>
                    <Input
                      id="dusun"
                      value={villageHeadForm.dusun}
                      onChange={(e) => setVillageHeadForm((prev) => ({ ...prev, dusun: e.target.value }))}
                      placeholder="e.g., Dusun 1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={villageHeadForm.name}
                      onChange={(e) => setVillageHeadForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="population">Population</Label>
                    <Input
                      id="population"
                      value={villageHeadForm.population}
                      onChange={(e) => setVillageHeadForm((prev) => ({ ...prev, population: e.target.value }))}
                      placeholder="e.g., 2.984 jiwa"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={villageHeadForm.phone}
                        onChange={(e) => setVillageHeadForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={villageHeadForm.status}
                        onValueChange={(value: "active" | "inactive") =>
                          setVillageHeadForm((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsVillageHeadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveVillageHead}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingVillageHead ? "Update" : "Add"} Village Head
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {governmentData.villageHeads.map((head) => (
              <Card key={head.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-green-800">{head.dusun}</h4>
                      <p className="text-sm text-gray-700">{head.name}</p>
                      <p className="text-xs text-gray-600">{head.population}</p>
                      {head.phone && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Phone className="h-3 w-3" />
                          <span>{head.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(head.status)}
                      <Button variant="outline" size="sm" onClick={() => handleEditVillageHead(head)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVillageHead(head.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Institutions Tab */}
        <TabsContent value="institutions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Village Institutions</h3>
            <Dialog open={isInstitutionDialogOpen} onOpenChange={setIsInstitutionDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetInstitutionForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Institution
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingInstitution ? "Edit Institution" : "Add New Institution"}</DialogTitle>
                  <DialogDescription>
                    {editingInstitution ? "Update institution information" : "Add a new village institution"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Institution Name *</Label>
                    <Select
                      value={institutionForm.name}
                      onValueChange={(value) => setInstitutionForm((prev) => ({ ...prev, name: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select institution type" />
                      </SelectTrigger>
                      <SelectContent>
                        {INSTITUTION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="members">Members Count *</Label>
                      <Input
                        id="members"
                        type="number"
                        value={institutionForm.members}
                        onChange={(e) =>
                          setInstitutionForm((prev) => ({ ...prev, members: Number.parseInt(e.target.value) }))
                        }
                        placeholder="Number of members"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={institutionForm.status}
                        onValueChange={(value: "active" | "inactive") =>
                          setInstitutionForm((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="leader">Leader</Label>
                    <Input
                      id="leader"
                      value={institutionForm.leader}
                      onChange={(e) => setInstitutionForm((prev) => ({ ...prev, leader: e.target.value }))}
                      placeholder="Leader name or '-' if none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={institutionForm.description}
                      onChange={(e) => setInstitutionForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the institution"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="establishedDate">Established Date</Label>
                    <Input
                      id="establishedDate"
                      type="date"
                      value={institutionForm.establishedDate}
                      onChange={(e) => setInstitutionForm((prev) => ({ ...prev, establishedDate: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInstitutionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveInstitution}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingInstitution ? "Update" : "Add"} Institution
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {governmentData.institutions.map((institution) => (
              <Card key={institution.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{institution.name}</h4>
                    {getStatusBadge(institution.status)}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Members:</span> {institution.members} orang
                    </p>
                    <p>
                      <span className="font-medium">Leader:</span> {institution.leader}
                    </p>
                    {institution.description && <p className="text-xs">{institution.description}</p>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => handleEditInstitution(institution)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteInstitution(institution.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
