"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Calendar } from "lucide-react"
import Image from "next/image"

interface GaleriDesa {
  judul?: string;
  link_foto?: string;
  tanggal?: string;
  kategori?: string;
  deskripsi?: string;
}

const categories = ["Semua", "Pembangunan", "Pertanian", "Budaya", "Kesehatan", "Pendidikan", "lainnya"]

export function VillageGallery() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [galeriDesa, setGaleriDesa] = useState<GaleriDesa[]>([])
  const [hasDataLoaded, setHasDataLoaded] = useState(false)

  const loadContent = async () => {
    const { data: data_galeri_desa, error: error_galeri_desa } = await supabase
      .from("web_content_galeri_desa")
      .select("*")

    if (error_galeri_desa) {
      console.error(`error mendapatkan data galeri desa: ${error_galeri_desa}`)
    }

    const galeriDesaInput = data_galeri_desa?.map((item: any) => {
      return {
        judul: item.judul,
        link_foto: item.link_foto,
        tanggal: item.tanggal,
        kategori: item.kategori,
        deskripsi: item.deskripsi
      }
    }) ?? []

    setGaleriDesa(galeriDesaInput)
    console.log(galeriDesaInput[0]?.link_foto)
    setHasDataLoaded(true)
  }

  useEffect(() => {
    loadContent()
  }, [])

  useEffect(() => {
    if (!hasDataLoaded) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasDataLoaded])

  const filteredItems =
    selectedCategory === "Semua"
      ? galeriDesa
      : galeriDesa.filter((item) => item.kategori === selectedCategory)

  const selectedItem =
    selectedImage !== null ? galeriDesa.find((_, index) => index === selectedImage) : null

  return (
    <section id="galeri" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Galeri Desa</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dokumentasi kegiatan dan keindahan Desa Suntenjaya
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              onClick={() => setSelectedImage(index)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.link_foto || "/placeholder.svg"}
                  alt={item.judul || "gambar placeholder"}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-900 hover:bg-white">{item.kategori}</Badge>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.judul}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.deskripsi}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.tanggal}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && selectedItem && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>

              <div className="bg-white rounded-lg overflow-hidden">
                <div className="relative">
                  <Image
                    src={selectedItem.link_foto || "/placeholder.svg"}
                    alt={selectedItem.judul || "placeholder"}
                    width={800}
                    height={600}
                    className="w-full h-96 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{selectedItem.kategori}</Badge>
                    <span className="text-sm text-gray-500">{selectedItem.tanggal}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.judul}</h3>
                  <p className="text-gray-600 mb-4">{selectedItem.deskripsi}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
