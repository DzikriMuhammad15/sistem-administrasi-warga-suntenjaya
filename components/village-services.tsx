"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Users, Heart, Building, Clock, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase/client"



interface LayananDesa{
  nama?: string;
  deskripsi?: string;
  link_submit?: string;
}




const services = [
  {
    id: 1,
    title: "Pelayanan Administrasi",
    description: "Layanan pembuatan surat-surat administrasi kependudukan",
    icon: FileText,
    items: ["KTP", "KK", "Akta Kelahiran", "Surat Pindah", "Surat Keterangan"],
    hours: "08:00 - 15:00",
    location: "Kantor Desa",
  },
  {
    id: 2,
    title: "Bantuan Sosial",
    description: "Program bantuan untuk masyarakat kurang mampu",
    icon: Heart,
    items: ["PKH", "BPNT", "Bantuan Lansia", "Bantuan Disabilitas"],
    hours: "08:00 - 14:00",
    location: "Kantor Desa",
  },
  {
    id: 3,
    title: "Pelayanan Kesehatan",
    description: "Layanan kesehatan dasar untuk masyarakat",
    icon: Users,
    items: ["Posyandu", "Imunisasi", "KB", "Pemeriksaan Kesehatan"],
    hours: "08:00 - 12:00",
    location: "Puskesmas Pembantu",
  },
  {
    id: 4,
    title: "Perizinan Usaha",
    description: "Layanan perizinan untuk usaha mikro dan kecil",
    icon: Building,
    items: ["SIUP", "TDP", "Izin Usaha", "Rekomendasi"],
    hours: "08:00 - 15:00",
    location: "Kantor Desa",
  },
]

export function VillageServices() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [LayananDesa, setLayananDesa] = useState<LayananDesa[]>([])
  const [hasDataLoaded, setHasDataLoaded] = useState(false)



  const loadContent = async () => {

    const { data: data_layanan_desa, error: error_layanan_desa } = await supabase
      .from("web_content_layanan_desa")
      .select("*")
    
    if(error_layanan_desa){
      console.error(`error mendapatkan data layanan desa: ${error_layanan_desa}`)
    }

    const layananDesaInput = data_layanan_desa?.map((item: any) => {
      return {
        nama: item.nama,
        deskripsi: item.deskripsi,
        link_submit: item.link_submit
      }
    }) ?? []
    setLayananDesa(layananDesaInput)
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


  return (
    <section id="layanan" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Layanan Desa</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Berbagai layanan publik yang tersedia untuk masyarakat Desa Suntenjaya
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {LayananDesa.map((service, index) => {
            const IconComponent = FileText
            return (
              <Card
                key={index}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  selectedService === index ? "ring-2 ring-blue-500 shadow-xl" : ""
                }`}
                onClick={() => setSelectedService(selectedService === index ? null : index)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{service.nama}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4 text-sm">{service.deskripsi}</p>

                  {selectedService === index && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      {/* Tombol Ambil Layanan */}
                    <a
                      href={service.link_submit}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-300"
                      >
                        Ambil Layanan
                      </button>
                    </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
