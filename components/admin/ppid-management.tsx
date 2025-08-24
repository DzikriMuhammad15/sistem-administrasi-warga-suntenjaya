"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AdminAPI } from "@/lib/admin-api"
import { FileUpload } from "./file-upload"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Download, Eye, EyeOff, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function PPIDManagement() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
    file_path: "",
    file_type: "",
    is_visible: true,
  })

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const data = await AdminAPI.getPublicDocuments()
      setDocuments(data)
    } catch (error) {
      console.error("Error loading documents:", error)
      toast.error("Failed to load public documents")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingDocument) {
        await AdminAPI.updatePublicDocument(editingDocument.id, formData)
        toast.success("Document updated successfully")
      } else {
        await AdminAPI.createPublicDocument(formData)
        toast.success("Document created successfully")
      }

      setIsDialogOpen(false)
      setEditingDocument(null)
      setFormData({ title: "", description: "", file_url: "", file_path: "", file_type: "", is_visible: true })
      loadDocuments()
    } catch (error) {
      console.error("Error saving document:", error)
      toast.error("Failed to save document")
    }
  }

  const handleEdit = (document: any) => {
    setEditingDocument(document)
    setFormData({
      title: document.title,
      description: document.description || "",
      file_url: document.file_url || "",
      file_path: document.file_path || "",
      file_type: document.file_type || "",
      is_visible: document.is_visible !== false,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await AdminAPI.deletePublicDocument(id)
        toast.success("Document deleted successfully")
        loadDocuments()
      } catch (error) {
        console.error("Error deleting document:", error)
        toast.error("Failed to delete document")
      }
    }
  }

  // ✅ update supaya cocok dengan FileUpload versi baru
  const handleFileUpload = (url: string, filename: string, path: string) => {
    const fileExt = filename.split(".").pop()?.toLowerCase() || "file"
    setFormData({ ...formData, file_url: url, file_path: path, file_type: fileExt })
  }

  const toggleVisibility = async (document: any) => {
    try {
      await AdminAPI.updatePublicDocument(document.id, {
        ...document,
        is_visible: !document.is_visible,
      })
      toast.success(`Document ${document.is_visible ? "hidden" : "made visible"}`)
      loadDocuments()
    } catch (error) {
      console.error("Error updating document visibility:", error)
      toast.error("Failed to update document visibility")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">PPID Document Management</h2>
          <p className="text-muted-foreground">Manage public documents for download and visibility</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingDocument(null)
                setFormData({
                  title: "",
                  description: "",
                  file_url: "",
                  file_path: "",
                  file_type: "",
                  is_visible: true,
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDocument ? "Edit Document" : "Add New Document"}</DialogTitle>
              <DialogDescription>
                {editingDocument ? "Update the document details" : "Upload a new public document"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter document title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter document description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Document File</Label>
                <FileUpload
                  onUpload={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  folder="ppid-documents"
                  multiple={false}
                />
                {formData.file_url && (
                  <p className="text-xs text-green-600">Uploaded: {formData.file_path}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                />
                <Label htmlFor="visible">Make document visible to public</Label>
              </div>
              <Button onClick={handleSave} className="w-full">
                {editingDocument ? "Update Document" : "Create Document"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((document) => (
          <Card key={document.id} className={!document.is_visible ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {document.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleVisibility(document)}>
                    {document.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(document)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(document.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{document.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{document.file_type?.toUpperCase() || "FILE"}</span>
                  {document.file_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={document.file_url} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full ${document.is_visible ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {document.is_visible ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
