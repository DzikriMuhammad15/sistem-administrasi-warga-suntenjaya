"use client"

import { useState } from "react"
import { FileUpload } from "./file-upload"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, FileText, Download } from "lucide-react"

interface DocumentUploadProps {
  value?: string
  filename?: string
  onChange: (url: string, filename: string) => void
  onRemove?: () => void
  className?: string
}

export function DocumentUpload({ value, filename, onChange, onRemove, className }: DocumentUploadProps) {
  const [documentUrl, setDocumentUrl] = useState(value || "")
  const [documentName, setDocumentName] = useState(filename || "")

  const handleUpload = (url: string, filename: string) => {
    setDocumentUrl(url)
    setDocumentName(filename)
    onChange(url, filename)
  }

  const handleRemove = async () => {
    if (documentUrl) {
      try {
        await fetch("/api/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: documentUrl }),
        })
      } catch (error) {
        console.error("Failed to delete document:", error)
      }
    }

    setDocumentUrl("")
    setDocumentName("")
    onChange("", "")
    onRemove?.()
  }

  if (documentUrl) {
    return (
      <div className={className}>
        <div className="flex items-center space-x-2 p-3 border rounded-lg">
          <FileText className="h-5 w-5 text-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{documentName}</p>
            <Badge variant="secondary" className="text-xs">
              Document
            </Badge>
          </div>
          <div className="flex space-x-1">
            <Button type="button" variant="outline" size="sm" onClick={() => window.open(documentUrl, "_blank")}>
              <Download className="h-3 w-3" />
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <FileUpload
      onUpload={handleUpload}
      accept=".pdf,.doc,.docx,.txt,.rtf"
      maxSize={10}
      folder="documents"
      className={className}
    />
  )
}
