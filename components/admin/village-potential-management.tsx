"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminAPI } from "@/lib/admin-api"
import { toast } from "sonner"
import { Plus, Edit, Trash2, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function VillagePotentialManagement() {
  const [naturalResources, setNaturalResources] = useState<any[]>([])
  const [financialResources, setFinancialResources] = useState<any[]>([])
  const [institutionalResources, setInstitutionalResources] = useState<any[]>([])
  const [businessFacilities, setBusinessFacilities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("natural")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    source: "",
    amount: 0,
  })

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      const [naturalData, financialData, institutionalData, businessData] = await Promise.all([
        AdminAPI.getNaturalResources(),
        AdminAPI.getFinancialResources(),
        AdminAPI.getInstitutionalResources(),
        AdminAPI.getBusinessFacilities(),
      ])

      setNaturalResources(naturalData)
      setFinancialResources(financialData)
      setInstitutionalResources(institutionalData)
      setBusinessFacilities(businessData)
    } catch (error) {
      console.error("Error loading village potential data:", error)
      toast.error("Failed to load village potential data")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      let result
      const data = {
        name: formData.name,
        description: formData.description,
        source: formData.source,
        amount: formData.amount,
      }

      if (editingItem) {
        switch (activeTab) {
          case "natural":
            result = await AdminAPI.updateNaturalResource(editingItem.id, data)
            break
          case "financial":
            result = await AdminAPI.updateFinancialResource(editingItem.id, data)
            break
          case "institutional":
            result = await AdminAPI.updateInstitutionalResource(editingItem.id, data)
            break
          case "business":
            result = await AdminAPI.updateBusinessFacility(editingItem.id, data)
            break
        }
        toast.success("Item updated successfully")
      } else {
        switch (activeTab) {
          case "natural":
            result = await AdminAPI.createNaturalResource(data)
            break
          case "financial":
            result = await AdminAPI.createFinancialResource(data)
            break
          case "institutional":
            result = await AdminAPI.createInstitutionalResource(data)
            break
          case "business":
            result = await AdminAPI.createBusinessFacility(data)
            break
        }
        toast.success("Item created successfully")
      }

      setIsDialogOpen(false)
      setEditingItem(null)
      setFormData({ name: "", description: "", source: "", amount: 0 })
      loadAllData()
    } catch (error) {
      console.error("Error saving item:", error)
      toast.error("Failed to save item")
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name: item.name || "",
      description: item.description || "",
      source: item.source || "",
      amount: item.amount || 0,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        switch (activeTab) {
          case "natural":
            await AdminAPI.deleteNaturalResource(id)
            break
          case "financial":
            await AdminAPI.deleteFinancialResource(id)
            break
          case "institutional":
            await AdminAPI.deleteInstitutionalResource(id)
            break
          case "business":
            await AdminAPI.deleteBusinessFacility(id)
            break
        }
        toast.success("Item deleted successfully")
        loadAllData()
      } catch (error) {
        console.error("Error deleting item:", error)
        toast.error("Failed to delete item")
      }
    }
  }

  const renderResourcesList = (data: any[], type: string) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{item.name || item.source}</CardTitle>
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
            <div className="space-y-2">
              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
              {item.amount && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Rp {item.amount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const getTotalFinancialResources = () => {
    return financialResources.reduce((total, resource) => total + (resource.amount || 0), 0)
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Village Potential Management</h2>
          <p className="text-muted-foreground">Manage natural, financial, institutional, and business resources</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingItem(null)
                setFormData({ name: "", description: "", source: "", amount: 0 })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Resource" : "Add New Resource"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the resource details" : `Create a new ${activeTab} resource`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{activeTab === "financial" ? "Source" : "Name"}</Label>
                <Input
                  id="name"
                  value={activeTab === "financial" ? formData.source : formData.name}
                  onChange={(e) =>
                    activeTab === "financial"
                      ? setFormData({ ...formData, source: e.target.value })
                      : setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={`Enter ${activeTab === "financial" ? "source" : "name"}`}
                />
              </div>
              {activeTab === "financial" && (
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Rp)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number.parseInt(e.target.value) || 0 })}
                    placeholder="Enter amount"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingItem ? "Update Resource" : "Create Resource"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="natural">Natural</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="institutional">Institutional</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="natural" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Natural Resources</CardTitle>
              <CardDescription>Manage village natural resources and assets</CardDescription>
            </CardHeader>
            <CardContent>{renderResourcesList(naturalResources, "natural")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Resources</CardTitle>
              <CardDescription>
                Manage financial resources and funding sources
                {financialResources.length > 0 && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        Total: Rp {getTotalFinancialResources().toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderResourcesList(financialResources, "financial")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="institutional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Institutional Resources</CardTitle>
              <CardDescription>Manage institutional resources and partnerships</CardDescription>
            </CardHeader>
            <CardContent>{renderResourcesList(institutionalResources, "institutional")}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Facilities</CardTitle>
              <CardDescription>Manage business facilities and commercial resources</CardDescription>
            </CardHeader>
            <CardContent>{renderResourcesList(businessFacilities, "business")}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
