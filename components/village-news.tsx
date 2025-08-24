"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import Image from "next/image"

const categories = ["Semua", "Pembangunan", "Sosial", "Budaya", "Pertanian", "Kesehatan", "lainnya"]

interface BeritaDesa {
  judul?: string;
  link_foto?: string;
  tanggal?: string;
  kategori?: string;
  deskripsi_singkat?: string;
  isi?: string;
}

export function VillageNews() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [selectedNews, setSelectedNews] = useState<number | null>(null)
  const [beritaDesa, setBeritaDesa] = useState<BeritaDesa[]>([])
  const [hasDataLoaded, setHasDataLoaded] = useState(false)

  const loadContent = async () => {
    const { data: data_berita_desa, error: error_berita_desa } = await supabase
      .from("web_content_berita_desa")
      .select("*")

    if (error_berita_desa) {
      console.error(`error mendapatkan data berita desa: ${error_berita_desa}`)
    }

    const beritaDesaInput = data_berita_desa?.map((item: any) => {
      return {
        judul: item.judul,
        link_foto: item.link_foto,
        tanggal: item.tanggal,
        kategori: item.kategori,
        deskripsi_singkat: item.deskripsi_singkat,
        isi: item.isi
      }
    }) ?? []
    setBeritaDesa(beritaDesaInput)
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

  const filteredNews =
    selectedCategory === "Semua"
      ? beritaDesa
      : beritaDesa.filter((item) => item.kategori === selectedCategory)

  const selectedItem =
    selectedNews !== null ? beritaDesa.find((_, index) => index === selectedNews) : null

  return (
    <section id="berita" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Berita Desa</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Informasi terkini tentang kegiatan dan perkembangan Desa Suntenjaya
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

        {/* Regular News */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item, index) => (
            <Card
              key={index}
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => setSelectedNews(index)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.link_foto || "/placeholder.svg"}
                  alt={item.judul || "placeholder"}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{item.kategori}</Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{item.tanggal}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.judul}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.deskripsi_singkat}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* News Detail Modal */}
        {selectedNews !== null && selectedItem && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <Image
                  src={selectedItem.link_foto || "/placeholder.svg"}
                  alt={selectedItem.judul || "placeholder"}
                  width={600}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setSelectedNews(null)}
                >
                  ×
                </Button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>{selectedItem.kategori}</Badge>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedItem.tanggal}</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedItem.judul}</h2>
                <p className="text-gray-700 leading-relaxed">{selectedItem.isi}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
