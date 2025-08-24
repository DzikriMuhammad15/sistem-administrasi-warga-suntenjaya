"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Briefcase, MilkIcon as Cow, Building, Dumbbell } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface TingkatPendidikan{
  tingkat_pendidikan?: string;
  jumlah?: number;
}

interface MataPencaharian{
  nama_mata_pencaharian?: string;
  jumlah?: number;
}

interface SaranaPrasarana{
  nama_sarana?: string;
  jumlah?: number;
}

interface SaranaOlahraga{
  nama_sarana?: string;
  jumlah?: number;
}


export function VillageStatistics() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [tingkatPendidikan, setTingkatPendidikan] = useState<TingkatPendidikan[]>([])
  const [mataPencaharian, setMataPencaharian] = useState<MataPencaharian[]>([])
  const [saranaPrasarana, setSaranaPrasarana] = useState<SaranaPrasarana[]>([])
  const [saranaOlahraga, setSaranaOlahraga] = useState<SaranaOlahraga[]>([])
  const [jumlahAllPendidikan, setJumlahAllPendidikan] = useState(0)
  const [hasDataLoaded, setHasDataLoaded] = useState(false)


  const loadContent = async () => {

    const { data: data_tingkat_pendidikan, error: error_tingkat_pendidikan } = await supabase
      .from("web_content_tingkat_pendidikan")
      .select("*")
    
    if(error_tingkat_pendidikan){
      console.error(`error mendapatkan data tingkat pendidikan: ${error_tingkat_pendidikan}`)
    }
    
    const { data: data_mata_pencaharian, error: error_mata_pencaharian } = await supabase
      .from("web_content_mata_pencaharian")
      .select("*")
    
    if(error_mata_pencaharian){
      console.error(`error mendapatkan data mata pencaharian: ${error_mata_pencaharian}`)
    }
    
    const { data: data_sarana_prasarana, error: error_sarana_prasarana } = await supabase
      .from("web_content_sarana_prasarana")
      .select("*")
    
    if(error_sarana_prasarana){
      console.error(`error mendapatkan data sarana prasarana: ${error_sarana_prasarana}`)
    }
    
    const { data: data_sarana_olahraga, error: error_sarana_olahraga } = await supabase
      .from("web_content_sarana_olahraga")
      .select("*")
    
    if(error_sarana_olahraga){
      console.error(`error mendapatkan data sarana olahraga: ${error_sarana_olahraga}`)
    }

    let jumlahAllPendidikanInput = 0
    data_tingkat_pendidikan?.forEach((item: any) => {
      jumlahAllPendidikanInput = jumlahAllPendidikanInput + item.jumlah
    })

    setJumlahAllPendidikan(jumlahAllPendidikanInput)

    const tingkatPendidikanInput = data_tingkat_pendidikan?.map((item: any) => {
      return {
        tingkat_pendidikan: item.tingkat_pendidikan,
        jumlah: item.jumlah
      }
    }) ?? []
    setTingkatPendidikan(tingkatPendidikanInput)


    const mataPencaharianInput = data_mata_pencaharian?.map((item: any) => {
      return {
        nama_mata_pencaharian: item.nama_mata_pencaharian,
        jumlah: item.jumlah
      }
    }) ?? []
    setMataPencaharian(mataPencaharianInput)


    const saranaPrasaranaInput = data_sarana_prasarana?.map((item: any) => {
      return {
        nama_sarana: item.nama_sarana,
        jumlah: item.jumlah
      }
    }) ?? []

    setSaranaPrasarana(saranaPrasaranaInput)

    const saranaOlahragaInput = data_sarana_olahraga?.map((item: any) => {
      return {
        nama_sarana: item.nama_sarana,
        jumlah: item.jumlah
      }
    }) ?? []

    setSaranaOlahraga(saranaOlahragaInput)
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






  const educationData = [
    { level: "SD", count: 494, percentage: 13.2 },
    { level: "SMP", count: 1182, percentage: 31.7 },
    { level: "SLTA", count: 1363, percentage: 36.5 },
    { level: "Diploma", count: 555, percentage: 14.9 },
    { level: "S1/S2", count: 101, percentage: 2.7 },
  ]

  const occupationData = [
    { job: "Petani", count: 3246 },
    { job: "Buruh harian lepas", count: 1145 },
    { job: "Pedagang", count: 978 },
    { job: "Peternak", count: 1135 },
    { job: "Karyawan", count: 126 },
    { job: "PNS", count: 31 },
    { job: "Jasa", count: 36 },
    { job: "Bengkel", count: 16 },
    { job: "TNI/POLRI", count: 5 },
    { job: "Bidan/Perawat", count: 5 },
  ]

  const livestockData = [
    { type: "Sapi", owners: 965 },
    { type: "Ayam kampong", owners: 141 },
    { type: "Kambing/Domba", owners: 56 },
    { type: "Ikan", owners: 25 },
    { type: "Itik/Bebek", owners: 15 },
    { type: "Ayam Broiler", owners: 9 },
  ]

  const facilitiesData = [
    { facility: "Gedung Mesjid", count: 19 },
    { facility: "Gedung Sekolah Dasar", count: 3 },
    { facility: "Gedung SLTP", count: 1 },
    { facility: "Gedung PUSTU", count: 1 },
    { facility: "Gedung Kantor Desa", count: 1 },
    { facility: "Gedung Kantor BPD", count: 1 },
    { facility: "Gedung Kantor PKK", count: 1 },
    { facility: "Gedung Pos Kamling", count: 1 },
  ]

  const sportsData = [
    { sport: "Lapang Tenis Meja", count: 17 },
    { sport: "Lapang Voly Bal", count: 8 },
    { sport: "Lapang Bulu Tangkis", count: 1 },
    { sport: "Lapang Futsal", count: 1 },
  ]

  return (
    <section id="statistik" ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Statistik Desa</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Data lengkap demografi dan fasilitas Desa Suntenjaya</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Education Statistics */}
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-10"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  Tingkat Pendidikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tingkatPendidikan.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{edu.tingkat_pendidikan}</span>
                        <Badge variant="secondary">{edu.jumlah} orang</Badge>
                      </div>
                      <Progress value={edu.jumlah ? (edu.jumlah/jumlahAllPendidikan) *100 : 0} className="h-2" />
                      <div className="text-xs text-gray-500 text-right">{edu.jumlah ? (edu.jumlah/jumlahAllPendidikan) *100 : 0}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Occupation Statistics */}
          <div
            className={`transition-all duration-1000 delay-400 ${isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-10"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-green-600" />
                  Mata Pencaharian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {mataPencaharian.map((job, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">{job.nama_mata_pencaharian}</span>
                      <Badge variant="outline">{job.jumlah} orang</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Facilities */}
          <div
            className={`transition-all duration-1000 delay-700 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building className="h-6 w-6 text-purple-600" />
                  Sarana Prasarana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {saranaPrasarana.map((facility, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{facility.nama_sarana}</span>
                      <Badge variant="outline">{facility.jumlah} unit</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sports Facilities */}
          <div
            className={`transition-all duration-1000 delay-800 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Dumbbell className="h-6 w-6 text-red-600" />
                  Sarana Olahraga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {saranaOlahraga.map((sport, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{sport.nama_sarana}</span>
                      <Badge variant="secondary">{sport.jumlah} unit</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
