"use client"

import { supabase } from "@/lib/supabase/client"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Clock, Users } from "lucide-react"



interface DokumenDesa{
  nama?: string;
  link?: string;
}







const ppidServices = [
  {
    title: "Informasi Berkala",
    description: "Informasi yang wajib disediakan dan diumumkan secara berkala",
    items: ["Profil Desa", "RPJM Desa", "APB Desa", "Laporan Keuangan"],
    icon: Clock,
  },
  {
    title: "Informasi Serta Merta",
    description: "Informasi yang dapat mengancam hajat hidup orang banyak",
    items: ["Bencana Alam", "Wabah Penyakit", "Gangguan Keamanan", "Krisis Pangan"],
    icon: Users,
  },
  {
    title: "Informasi Setiap Saat",
    description: "Informasi yang harus tersedia setiap saat",
    items: ["Struktur Organisasi", "Visi Misi", "Peraturan Desa", "Data Statistik"],
    icon: FileText,
  },
]

const documents = [
  { name: "RPJM Desa 2019-2025", type: "PDF", size: "2.5 MB", date: "2024-01-15" },
  { name: "APB Desa 2024", type: "PDF", size: "1.8 MB", date: "2024-01-10" },
  { name: "Laporan Keuangan 2023", type: "PDF", size: "3.2 MB", date: "2024-01-05" },
  { name: "Peraturan Desa No. 1/2024", type: "PDF", size: "1.1 MB", date: "2024-01-01" },
]

export function VillagePPID() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [dokumenDesa, setDokumenDesa] = useState<DokumenDesa[]>([])
  const [hasDataLoaded, setHasDataLoaded] = useState(false)



  const loadContent = async () => {

    const { data: data_doukmen_desa, error: error_dokumen_desa } = await supabase
      .from("web_content_dokumen_desa")
      .select("*")
    
    if(error_dokumen_desa){
      console.error(`error mendapatkan data dokumen desa: ${error_dokumen_desa}`)
    }

    const dokumenDesaInput = data_doukmen_desa?.map((item: any) => {
      return {
        nama: item.nama,
        link: item.link
      }
    }) ?? []
    setDokumenDesa(dokumenDesaInput)
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
    <section id="ppid" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">PPID Desa Suntenjaya</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pejabat Pengelola Informasi dan Dokumentasi - Transparansi Informasi Publik
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {ppidServices.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-center">{service.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Download className="w-6 h-6 text-blue-600" />
              Dokumen Publik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {dokumenDesa.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{doc.nama}</h4>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={doc.link}>
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Unduh
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


      </div>
    </section>
  )
}
