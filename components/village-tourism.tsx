"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, Camera, Mountain, TreePine } from "lucide-react"
import Image from "next/image"

const tourismSpots = [
  {
    id: 1,
    name: "Sawah Terasering Suntenjaya",
    description: "Pemandangan sawah terasering yang menakjubkan dengan latar belakang pegunungan",
    category: "Alam",
    highlights: ["Foto Instagram", "Sunrise/Sunset", "Trekking Ringan"],
    image: "/placeholder.svg?height=300&width=400",
    icon: Mountain,
  },
  {
    id: 2,
    name: "Hutan Pinus Suntenjaya",
    description: "Hutan pinus yang sejuk dengan jalur trekking dan spot foto yang menarik",
    category: "Alam",
    highlights: ["Udara Sejuk", "Spot Foto", "Piknik"],
    image: "/placeholder.svg?height=300&width=400",
    icon: TreePine,
  },
  {
    id: 3,
    name: "Puncak Bukit Suntenjaya",
    description: "Titik tertinggi desa dengan panorama 360 derajat yang spektakuler",
    category: "Petualangan",
    highlights: ["Panorama 360°", "Sunrise Terbaik", "Camping"],
    image: "/placeholder.svg?height=300&width=400",
    icon: Mountain,
  },
  {
    id: 4,
    name: "Sumber Mata Air Jernih",
    description: "Mata air alami yang jernih dengan suasana yang tenang dan menyegarkan",
    category: "Alam",
    highlights: ["Air Jernih", "Berenang", "Relaksasi"],
    image: "/placeholder.svg?height=300&width=400",
    icon: TreePine,
  },
]

const facilities = [
  { name: "Homestay", available: true, description: "Penginapan di rumah warga" },
  { name: "Warung Makan", available: true, description: "Makanan lokal dan tradisional" },
  { name: "Pemandu Wisata", available: true, description: "Guide lokal berpengalaman" },
  { name: "Transportasi", available: true, description: "Ojek dan angkutan desa" },
  { name: "Toilet Umum", available: true, description: "Fasilitas kebersihan" },
  { name: "Mushola", available: true, description: "Tempat ibadah" },
]

export function VillageTourism() {
  return (
    <section id="wisata" className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Wisata Desa Suntenjaya</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jelajahi keindahan alam dan budaya Desa Suntenjaya yang memukau
          </p>
        </div>

        {/* Tourism Spots */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {tourismSpots.map((spot) => {
            const IconComponent = spot.icon
            return (
              <Card
                key={spot.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={spot.image || "/placeholder.svg"}
                    alt={spot.name}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">{spot.category}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 rounded-full p-2">
                      <IconComponent className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-black/70 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{spot.name}</h3>
                  <p className="text-gray-600 mb-4">{spot.description}</p>



                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm">Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {spot.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
