"use client"

import { useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (url: string, filename: string, path: string) => void
  accept?: string
  maxSize?: number // in MB
  folder?: string
  multiple?: boolean
  className?: string
}

export function FileUpload({
  onUpload,
  accept = "*/*",
  maxSize = 10,
  folder = "uploads",
  multiple = false,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    if (!files.length) return
    const file = files[0]

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      // ✅ pastikan user login
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) throw sessionError
      if (!session) throw new Error("You must be logged in to upload files")

      const userId = session.user.id
      const ext = file.name.split(".").pop()
      const filename = `${Date.now()}.${ext}`
      const filepath = `${folder}/${userId}-${filename}` // ✅ path tanpa leading slash

      const { error: uploadError } = await supabase.storage
        .from("desa_suntenjaya_bucket")
        .upload(filepath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from("desa_suntenjaya_bucket")
        .getPublicUrl(filepath)

      onUpload(data.publicUrl, filename, filepath)

      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      setProgress(100)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files)
  }

  const isImage = accept.includes("image")

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300",
          uploading && "opacity-50 pointer-events-none",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-2">
          {isImage ? (
            <ImageIcon className="h-8 w-8 text-gray-400" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          <div className="text-sm text-gray-600">
            <Label
              htmlFor="file-upload"
              className="cursor-pointer text-primary hover:text-primary/80"
            >
              Click to upload
            </Label>{" "}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">Max file size: {maxSize}MB</p>
        </div>
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
