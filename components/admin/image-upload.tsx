"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FileUpload } from "./file-upload"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (path: string, url: string) => void
  onRemove?: () => void
  className?: string
}

export function ImageUpload({ value, onChange, onRemove, className }: ImageUploadProps) {
  const [imagePath, setImagePath] = useState(value || "")
  const [imageUrl, setImageUrl] = useState("")
  const supabase = createClientComponentClient()

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http")) return path
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/desa_suntenjaya_bucket/${path}`
  }

  const handleUpload = (url: string, filename: string, path: string) => {
    setImagePath(path)
    setImageUrl(url)
    onChange(path, url)
  }

  const handleRemove = async () => {
    if (imagePath) {
      await supabase.storage.from("desa_suntenjaya_bucket").remove([imagePath])
    }
    setImagePath("")
    setImageUrl("")
    onChange("", "")
    onRemove?.()
  }

  if (imagePath) {
    return (
      <div className={className}>
        <div className="relative inline-block">
          <Image
            src={getImageUrl(imagePath) || "/placeholder.svg"}
            alt="Uploaded image"
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return <FileUpload onUpload={handleUpload} accept="image/*" maxSize={5} folder="images" className={className} />
}
