"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Palette, Trophy } from "lucide-react"
import { supabase } from "@/lib/supabase/client"



interface SeniBudaya{
  nama?: string;
  jumlah_grup?: number;
  lokasi?: string;
}




export function VillageArtsCulture() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [seniBudaya, setSeniBudaya] = useState<SeniBudaya[]>([])
  const [banyaknyaJenisKesenian, setBanyaknyaJenisKesenian] = useState(0)
  const [hasDataLoaded, setHasDataLoaded] = useState(false)



  const loadContent = async () => {

    const { data: data_seni_budaya, error: error_seni_budaya } = await supabase
      .from("web_content_seni_budaya")
      .select("*")
    
    if(error_seni_budaya){
      console.error(`error mendapatkan data seni budaya: ${error_seni_budaya}`)
    }

    let banyaknyaJenisKesenianInput = 0
    data_seni_budaya?.forEach((item: any) => {
      banyaknyaJenisKesenianInput = banyaknyaJenisKesenianInput + 1
    })

    const seniBudayaInput = data_seni_budaya?.map((item: any) => {
      return {
        nama: item.nama,
        jumlah_grup: item.jumlah_grup,
        lokasi: item.lokasi
      }
    }) ?? []
    setSeniBudaya(seniBudayaInput)
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




  const artsData = [
    { name: "Calung", locations: "RW 7, 8, 9, 15", count: 4, type: "Musik Tradisional" },
    { name: "Qasidah", locations: "RW 1-17", count: 17, type: "Musik Religi" },
    { name: "Organ Tunggal", locations: "RW 5 & 14", count: 2, type: "Musik Modern" },
    { name: "Jaipong", locations: "RW 5, 7, 9, 12, 16", count: 5, type: "Tari Tradisional" },
    { name: "Marawis", locations: "RW 1-17", count: 17, type: "Musik Religi" },
    { name: "Hadroh", locations: "RW 6 & 8", count: 2, type: "Musik Religi" },
    { name: "Pencak Silat", locations: "RW 5, 10, 11", count: 3, type: "Seni Bela Diri" },
  ]

  const getTypeColor = (index: number) => {
    if(index % 6 == 1){
      return "bg-green-100 text-green-800"
    }
    else if(index % 6 ==2){
      return "bg-blue-100 text-blue-800"
    }
    else if(index % 6 == 3){
      return "bg-purple-100 text-purple-800"
    }
    else if(index % 6 == 4){
      return "bg-orange-100 text-orange-800"
    }
    else if(index % 6 == 5){
      return "bg-red-100 text-red-800"
    }
    else{
      return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <section id="seni-budaya" ref={sectionRef} className="py-20 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Seni dan Budaya</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Kekayaan seni dan budaya yang hidup di Desa Suntenjaya</p>
        </div>

        <div
          className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-up" : "opacity-0 translate-y-10"}`}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Music className="h-6 w-6 text-purple-600" />
                Jenis Kesenian dan Budaya
                <Badge variant="secondary" className="ml-2">
                  {banyaknyaJenisKesenian} Jenis Kesenian
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seniBudaya.map((art, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border-2 border-dashed transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      index % 4 == 0
                        ? "border-blue-300 bg-blue-50"
                        : index % 4 == 1
                          ? "border-green-300 bg-green-50"
                          : index % 4 == 2
                            ? "border-orange-300 bg-orange-50"
                            : index % 4 == 3
                              ? "border-red-300 bg-red-50"
                              : "border-purple-300 bg-purple-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{art.nama}</h3>
                      <Badge className={getTypeColor(index)}>{art.jumlah_grup} grup</Badge>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Lokasi:</p>
                      <p>{art.lokasi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cultural Heritage Description */}
        <div
          className={`mt-12 transition-all duration-1000 delay-400 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Palette className="h-6 w-6 text-pink-600" />
                Warisan Budaya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed">
                  Desa Suntenjaya memiliki kekayaan seni dan budaya yang beragam, mulai dari musik tradisional seperti
                  Calung yang tersebar di 4 RW, hingga seni bela diri Pencak Silat yang aktif di 3 lokasi. Kesenian
                  religi seperti Qasidah dan Marawis hadir di seluruh RW (1-17), menunjukkan kuatnya nilai-nilai
                  keagamaan dalam kehidupan masyarakat.
                </p>
                <p className="mt-4">
                  Tari Jaipong sebagai warisan budaya Sunda masih lestari dan aktif di 5 RW, sementara Hadroh dan musik
                  modern seperti Organ Tunggal menambah keberagaman ekspresi seni di desa ini. Semua kesenian ini tidak
                  hanya berfungsi sebagai hiburan, tetapi juga sebagai media pelestarian budaya dan penguatan identitas
                  masyarakat Desa Suntenjaya.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
