"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Crown, Mountain } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface HistoryContent{
  nama?: string;
  tahun_jabat_awal?: number;
  tahun_jabat_akhir?: number;
  keterangan?: string;
}


export function VillageHistory() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [hasDataLoaded, setHasDataLoaded] = useState(false)
  const [historyContent, setHistoryContent] = useState <HistoryContent[]>([])
  const [currentKepalaDesa, setCurrentKepalaDesa] = useState <HistoryContent>({})

  const loadContent = async () => {

    const { data, error } = await supabase
      .from("web_content_kepala_desa")
      .select("*")
      .order("tahun_jabat_akhir", { ascending: true })
    
    if(error){
      console.error(`error mendapatkan data kepala desa: ${error}`)
    }

    const historyContentInput:HistoryContent[] = data?.map((item: any) => {
      return {
          nama: item.nama,
          tahun_jabat_awal: item.tahun_jabat_awal,
          tahun_jabat_akhir: item.tahun_jabat_akhir,
          keterangan: item.keterangan
      }
    }) ?? []
    setHistoryContent(historyContentInput)
    const currentKepalaDesaInput = data?.[data.length-1]
    setCurrentKepalaDesa(currentKepalaDesaInput)
    setHasDataLoaded(true)
  }

  useEffect(() => {
    loadContent()
  }, [])



  useEffect(() => {
    if(!hasDataLoaded) return
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


  const mountains = [
    "Gunung Manglayang",
    "Gunung Mangparang",
    "Gunung Kasur",
    "Gunung Sangara",
    "Gunung Bukit Tunggul",
    "Gunung Palasari",
    "Gunung Tangkuban Perahu",
    "Gunung Burangrang",
  ]

  return (
    <section id="sejarah" ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Sejarah Desa</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Geological History */}
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-10"}`}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mountain className="h-6 w-6 text-green-600" />
                  Sejarah Geologis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Formasi Gunung Sunda (1 juta tahun lalu)</h4>
                  <p className="text-sm text-gray-700">
                    Aktivitas vulkanik di utara Bandung membentuk gunung api raksasa dengan diameter dasar 20 km dan
                    ketinggian 2000-3000 meter di atas permukaan laut.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Lahirnya Tangkuban Perahu (11.000 tahun lalu)</h4>
                  <p className="text-sm text-gray-700">
                    Setelah runtuhnya Gunung Sunda, lahirlah Gunung Tangkuban Perahu sebagai anak kaldera yang menutupi
                    bagian timur sisa gunung api lama.
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Terbentuknya Dataran Bandung</h4>
                  <p className="text-sm text-gray-700">
                    Erupsi kedua (6000 tahun lalu) menyumbat Sungai Citarum dan membentuk Danau Bandung. Dataran tinggi
                    Bandung yang subur terbentuk dari lahar dan debu vulkanik.
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Rangkaian Gunung Sunda:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {mountains.map((mountain, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {mountain}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Village Leaders History */}
          <div
            className={`transition-all duration-1000 delay-400 ${isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-10"}`}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-blue-600" />
                  Kepala Desa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {historyContent.map((head, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-600 min-w-[100px]">
                        <Calendar className="h-4 w-4" />
                        {head.tahun_jabat_awal}-{head.tahun_jabat_akhir}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{head.nama}</div>
                        <div className="text-xs text-gray-600">{head.keterangan}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Kepala Desa Saat Ini</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{currentKepalaDesa?.nama}</span> (Periode {currentKepalaDesa?.tahun_jabat_awal}-{currentKepalaDesa?.tahun_jabat_akhir})
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
