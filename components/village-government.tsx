"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase/client"


interface StrukturKepemerintahan{
  nama?: string;
  jabatan?: string;
}

interface Dusun{
  nomor_dusun?: number;
  kepala_dusun?: string;
  jumlah_warga?: number;
}

interface KelembagaanDesa{
  jabatan?: string;
  jumlah_menjabat?: number
}

export function VillageGovernment() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [hasDataLoaded, setHasDataLoaded] = useState(false)
  const [strukturKepemerintahan, setStrukturKepemerintahan] = useState<StrukturKepemerintahan[]>([])
  const [dusun, setDusun] = useState<Dusun[]>([])
  const [kelembagaan_desa, set_kelembagaan_desa] = useState<KelembagaanDesa[]>([])

  const loadContent = async () => {

    const { data, error } = await supabase
      .from("web_content_struktur_kepemerintahan")
      .select("*")
    
    if(error){
      console.error(`error mendapatkan data struktur kepemerintahan: ${error}`)
    }

    const {data: data_dusun, error: error_dusun} = await supabase
      .from("web_content_dusun")
      .select("*")
    
    if(error_dusun){
      console.error(`error mendapatkan data dusun: ${error_dusun}`)
    }
    
    const {data: data_kelembagaan_desa, error: error_kelembagaan_desa} = await supabase
    .from("web_content_kelembagaan_desa")
    .select("*")
    
    if(error_kelembagaan_desa){
      console.error(`error mendapatkan data kelembagaan desa: ${error_kelembagaan_desa}`)
    }

    const strukturKepemerintahanInput: StrukturKepemerintahan[] = data?.map((item: any) => {
      return {
        nama: item.nama,
        jabatan: item.jabatan
      }
    }) ?? []

    setStrukturKepemerintahan(strukturKepemerintahanInput)

    const dusunInput: Dusun[] = data_dusun?.map((item: any) => {
      return {
        nomor_dusun: item.nomor_dusun,
        kepala_dusun: item.kepala_dusun,
        jumlah_warga: item.jumlah_warga
      }
    }) ?? []

    setDusun(dusunInput)

    const kelembagaan_desa_input = data_kelembagaan_desa?.map((item: any) => {
      return {
        jabatan: item.jabatan,
        jumlah_menjabat: item.jumlah_menjabat
      }
    }) ?? []

    set_kelembagaan_desa(kelembagaan_desa_input)

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

  const governmentStructure = [
    { position: "Kepala Desa", name: "Asep Wahyono", icon: "👨‍💼" },
    { position: "Sekretaris Desa", name: "Dase", icon: "📋" },
    { position: "Kaur Perencanaan", name: "Fajar R", icon: "📊" },
    { position: "Kaur Keuangan", name: "Kania P", icon: "💰" },
    { position: "Kaur Umum", name: "Iwan S", icon: "📄" },
    { position: "Kasi Pemerintahan", name: "Rony Fasyrah", icon: "🏛️" },
    { position: "Kasi Pelayanan", name: "Tiarawati", icon: "🤝" },
    { position: "Kasi Kesra", name: "Sansan S", icon: "❤️" },
    { position: "Staf Keuangan", name: "Suryani", icon: "💼" },
  ]

  const villageHeads = [
    { dusun: "Dusun 1", name: "Kiki Andrian", population: "2.984 jiwa" },
    { dusun: "Dusun 2", name: "Vicky P", population: "1.902 jiwa" },
    { dusun: "Dusun 3", name: "Rahmat S M", population: "1.878 jiwa" },
    { dusun: "Dusun 4", name: "Sandi A", population: "1.894 jiwa" },
  ]

  const institutions = [
    { name: "BPD", members: 7, leader: "Toto Juanto" },
    { name: "RT", members: 50, leader: "-" },
    { name: "RW", members: 17, leader: "-" },
    { name: "PKK dan Kader PKK", members: 30, leader: "-" },
    { name: "LPM", members: 5, leader: "-" },
    { name: "Kader Posyandu", members: 100, leader: "-" },
    { name: "Karang Taruna", members: 32, leader: "-" },
    { name: "Linmas", members: 32, leader: "-" },
    { name: "BUMDES", members: 3, leader: "-" },
    { name: "MUI", members: 17, leader: "-" },
    { name: "DKM", members: 85, leader: "-" },
    { name: "Guru Ngaji", members: 90, leader: "-" },
  ]

  return (
    <section id="pemerintahan" ref={sectionRef} className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Pemerintahan Desa</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Struktur organisasi dan kelembagaan Desa Suntenjaya</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Government Structure */}
          <div
            className={`lg:col-span-2 transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-10"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building className="h-6 w-6 text-blue-600" />
                  Struktur Pemerintahan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {strukturKepemerintahan.map((official, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <div className="text-2xl">👨‍💼</div>
                      <div>
                        <div className="font-medium text-gray-900">{official.nama}</div>
                        <div className="text-sm text-gray-600">{official.jabatan}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Village Heads */}
          <div
            className={`transition-all duration-1000 delay-400 ${isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-10"}`}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                  Kepala Dusun
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dusun.map((head, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">Dusun {head.nomor_dusun}</div>
                      <div className="text-sm text-gray-700">{head.kepala_dusun}</div>
                      <div className="text-xs text-gray-600">{head.jumlah_warga} jiwa</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Village Institutions */}
        <div
          className={`mt-12 transition-all duration-1000 delay-600 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-600" />
                Kelembagaan Desa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kelembagaan_desa.map((institution, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{institution.jabatan}</div>
                    </div>
                    <Badge variant="secondary">{institution.jumlah_menjabat} orang</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
