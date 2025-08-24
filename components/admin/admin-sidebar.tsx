"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Info,
  Award,
  Users,
  Map,
  Building2,
  BookOpen,
  Briefcase,
  Landmark,
  Dumbbell,
  Leaf,
  Wallet,
  Network,
  Store,
  Palette,
  Handshake,
  FileText,
  Image as ImageIcon,
  Newspaper,
  UserCircle,
} from "lucide-react"

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const menuItems = [
  {
    id: "village-info",
    label: "Informasi Desa",
    icon: Info,
  },
  {
    id: "village-head",
    label: "Kepala Desa",
    icon: Award,
  },
  {
    id: "government-structure",
    label: "Struktur Kepemerintahan",
    icon: Users,
  },
  {
    id: "hamlets",
    label: "Dusun",
    icon: Map,
  },
  {
    id: "institutions",
    label: "Kelembagaan Desa",
    icon: Building2,
  },
  {
    id: "education",
    label: "Tingkat Pendidikan",
    icon: BookOpen,
  },
  {
    id: "livelihoods",
    label: "Mata Pencaharian",
    icon: Briefcase,
  },
  {
    id: "infrastructure",
    label: "Sarana Prasarana",
    icon: Landmark,
  },
  {
    id: "sports-facilities",
    label: "Sarana Olahraga",
    icon: Dumbbell,
  },
  {
    id: "natural-resources",
    label: "Sumber Daya Alam",
    icon: Leaf,
  },
  {
    id: "financial-resources",
    label: "Sumber Daya Finansial",
    icon: Wallet,
  },
  {
    id: "institutional-resources",
    label: "Sumber Daya Kelembagaan",
    icon: Network,
  },
  {
    id: "business-facilities",
    label: "Sarana Tempat Usaha",
    icon: Store,
  },
  {
    id: "arts-culture",
    label: "Seni Budaya",
    icon: Palette,
  },
  {
    id: "village-services",
    label: "Layanan Desa",
    icon: Handshake,
  },
  {
    id: "village-documents",
    label: "Dokumen Desa",
    icon: FileText,
  },
  {
    id: "village-gallery",
    label: "Galeri Desa",
    icon: ImageIcon,
  },
  {
    id: "village-news",
    label: "Berita Desa",
    icon: Newspaper,
  },
  {
    id: "profile-picture",
    label: "Gambar Profil",
    icon: UserCircle,
  },
]

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Content Manager</h2>
        <p className="text-sm text-gray-600 mt-1">Desa Suntenjaya</p>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  activeSection === item.id
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
