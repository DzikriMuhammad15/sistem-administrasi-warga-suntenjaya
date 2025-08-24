"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { supabase } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, FileText, Download, Save, RefreshCw, Search, Filter } from "lucide-react"
import { FileUpload } from "./file-upload"


interface Document {
  id: string
  title: string
  description?: string
  file_url: string
  file_name: string
  file_size?: number
  file_type?: string
  category: string
  uploaded_by?: string
  created_at: string
  updated_at: string
}

interface DocumentFormData {
  title: string
  description: string
  file_url: string
  file_name: string
  file_size: number
  file_type: string
  category: string
}

const DOCUMENT_CATEGORIES = ["general", "regulations", "reports", "announcements", "forms", "procedures"]

export function DocumentsManagement() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_path: "",
    file_url: "",
    file_name: "",
    file_size: 0,
    file_type: "",
    category: "general",
  })

  useEffect(() => {
    loadDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchTerm, selectedCategory])

  const handleFileUpload = (url: string, filename: string, path: string) => {
    const fileExt = filename.split(".").pop()?.toLowerCase() || "file"
    setFormData({ ...formData, file_url: url, file_path: path, file_type: fileExt })
    console.log(url)
  }

  const loadDocuments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load documents" })
    } finally {
      setIsLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = documents

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory)
    }

    setFilteredDocuments(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      if (editingDocument) {
        const { error } = await supabase.from("documents").update(formData).eq("id", editingDocument.id)

        if (error) throw error
        setMessage({ type: "success", text: "Document updated successfully!" })
      } else {
        const { error } = await supabase.from("documents").insert([formData])

        if (error) throw error
        setMessage({ type: "success", text: "Document created successfully!" })
      }

      resetForm()
      setIsDialogOpen(false)
      loadDocuments()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save document" })
    }
  }

  const handleEdit = (document: Document) => {
    setEditingDocument(document)
    setFormData({
      title: document.title,
      description: document.description || "",
      file_url: document.file_url,
      file_name: document.file_name,
      file_size: document.file_size || 0,
      file_type: document.file_type || "",
      category: document.category,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const { error } = await supabase.from("documents").delete().eq("id", id)

      if (error) throw error
      setMessage({ type: "success", text: "Document deleted successfully!" })
      loadDocuments()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete document" })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      file_url: "",
      file_name: "",
      file_size: 0,
      file_type: "",
      category: "general",
    })
    setEditingDocument(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documents Management</h2>
          <p className="text-gray-600">Manage village documents and files</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDocuments} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingDocument ? "Edit Document" : "Add New Document"}</DialogTitle>
                <DialogDescription>
                  {editingDocument ? "Update the document information" : "Add a new document to the system"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Document Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Document title"
                    required
                  />
                  <FileUpload
                    onUpload={handleFileUpload}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    folder="ppid-documents"
                    multiple={false}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Document description"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="file_name">File Name *</Label>
                    <Input
                      id="file_name"
                      value={formData.file_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, file_name: e.target.value }))}
                      placeholder="document.pdf"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="file_type">File Type</Label>
                    <Input
                      id="file_type"
                      value={formData.file_type}
                      onChange={(e) => setFormData((prev) => ({ ...prev, file_type: e.target.value }))}
                      placeholder="application/pdf"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="file_url">File URL *</Label>
                    <Input
                      id="file_url"
                      value={formData.file_url}
                      onChange={(e) => setFormData((prev) => ({ ...prev, file_url: e.target.value }))}
                      placeholder="/path/to/document.pdf"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="file_size">File Size (bytes)</Label>
                    <Input
                      id="file_size"
                      type="number"
                      value={formData.file_size}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, file_size: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingDocument ? "Update" : "Add"} Document
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Loading documents...
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first document to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{document.category}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{document.title}</h3>
                      {document.description && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{document.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{document.file_name}</span>
                        {document.file_size && <span>{formatFileSize(document.file_size)}</span>}
                        <span>{formatDate(document.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(document)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
