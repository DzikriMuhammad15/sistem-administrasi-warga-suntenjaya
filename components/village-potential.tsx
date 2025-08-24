"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Mountain, Droplets, TreePine, Wheat, Users, DollarSign, Building2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"


interface SumberDayaAlam{
  nama_sumber_daya_alam?: string;
  keterangan?: String;
}

interface SumberDayaFinansial{
  nama_sumber_daya_finansial?: string;
  keterangan?: String;
  jumlah?: number;
}

interface SumberDayaKelembagaan{
  nama_lembaga?: string;
  kategori_lembaga?: String;
  jumlah_anggota?: number;
}

interface SaranaTempatUsaha{
  nama_sarana?: string;
  jumlah?: number;
}



export function VillagePotential() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [sumberDayaAlam, setSumberDayaAlam] = useState<SumberDayaAlam[]>([])
  const [sumberDayaFinansial, setSumberDayaFinansial] = useState<SumberDayaFinansial[]>([])
  const [sumberDayaKelembagaan, setSumberDayaKelembagaan] = useState<SumberDayaKelembagaan[]>([])
  const [saranaTempatUsaha, setSaranaTempatUsaha] = useState<SaranaTempatUsaha[]>([])
  const [totalSumberDayaFinansial, setTotalSumberDayaFinansial] = useState(0)
  const [hasDataLoaded, setHasDataLoaded] = useState(false)



  const loadContent = async () => {

    const { data: data_sumber_daya_alam, error: error_sumber_daya_alam } = await supabase
      .from("web_content_sumber_daya_alam")
      .select("*")
    
    if(error_sumber_daya_alam){
      console.error(`error mendapatkan data sumber daya alam: ${error_sumber_daya_alam}`)
    }
    
    const { data: data_sumber_daya_finansial, error: error_sumber_daya_finansial } = await supabase
      .from("web_content_sumber_daya_finansial")
      .select("*")
    
    if(error_sumber_daya_finansial){
      console.error(`error mendapatkan data sumber daya finansial: ${error_sumber_daya_finansial}`)
    }
    
    const { data: data_sumber_daya_kelembagaan, error: error_sumber_daya_kelembagaan } = await supabase
      .from("web_content_sumber_daya_kelembagaan")
      .select("*")
    
    if(error_sumber_daya_kelembagaan){
      console.error(`error mendapatkan data sumber daya kelembagaan: ${error_sumber_daya_kelembagaan}`)
    }
    
    const { data: data_sarana_tempat_usaha, error: error_sarana_tempat_usaha } = await supabase
      .from("web_content_sarana_tempat_usaha")
      .select("*")
    
    if(error_sarana_tempat_usaha){
      console.error(`error mendapatkan data sarana tempat usaha: ${error_sarana_tempat_usaha}`)
    }



    let totalSumberDayaFinansialInput = 0
    data_sumber_daya_finansial?.forEach((item: any) => {
      totalSumberDayaFinansialInput = totalSumberDayaFinansial + item.jumlah
    })

    setTotalSumberDayaFinansial(totalSumberDayaFinansialInput)

    const sumberDayaAlamInput = data_sumber_daya_alam?.map((item: any) => {
      return {
        nama_sumber_daya_alam: item.nama_sumber_daya_alam,
        keterangan: item.keterangan
      }
    }) ?? []
    setSumberDayaAlam(sumberDayaAlamInput)


    const sumberDayaFinansialInput = data_sumber_daya_finansial?.map((item: any) => {
      return {
        nama_sumber_daya_finansial: item.nama_sumber_daya_finansial,
        jumlah: item.jumlah,
        keterangan: item.keterangan
      }
    }) ?? []
    setSumberDayaFinansial(sumberDayaFinansialInput)


    const sumberDayaKelembagaanInput = data_sumber_daya_kelembagaan?.map((item: any) => {
      return {
        nama_lembaga: item.nama_lembaga,
        jumlah_anggota: item.jumlah_anggota,
        kategori_lembaga: item.kategori_lembaga
      }
    }) ?? []

    setSumberDayaKelembagaan(sumberDayaKelembagaanInput)

    const saranaTempatUsahaInput = data_sarana_tempat_usaha?.map((item: any) => {
      return {
        nama_sarana: item.nama_sarana,
        jumlah: item.jumlah
      }
    }) ?? []

    setSaranaTempatUsaha(saranaTempatUsahaInput)
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




  const naturalResources = [
    { name: "Tanah Bengkok", area: "4 Ha", icon: Leaf },
    { name: "Hutan Bambu", area: "- Ha", icon: TreePine },
    { name: "Hutan Kayu", area: "- Ha", icon: TreePine },
    { name: "Lahan Pekarangan", area: "20.06 Ha", icon: Leaf },
    { name: "Tanah Ladang/Sawah", area: "300 Ha", icon: Wheat },
    { name: "Tanah Perkebunan", area: "190 Ha", icon: Mountain },
    { name: "Hutan Lindung", area: "800 Ha", icon: TreePine },
    { name: "Sumber Mata Air", area: "- Unit", icon: Droplets },
  ]

  const institutions = [
    { name: "BPD", members: 7, type: "Pemerintahan" },
    { name: "RT", members: 50, type: "Pemerintahan" },
    { name: "RW", members: 17, type: "Pemerintahan" },
    { name: "PKK dan Kader PKK", members: 30, type: "Sosial" },
    { name: "LPM", members: 5, type: "Pembangunan" },
    { name: "Kader Posyandu", members: 100, type: "Kesehatan" },
    { name: "Karang Taruna", members: 32, type: "Pemuda" },
    { name: "Linmas", members: 32, type: "Keamanan" },
    { name: "BUMDES", members: 3, type: "Ekonomi" },
    { name: "MUI", members: 17, type: "Keagamaan" },
    { name: "DKM", members: 85, type: "Keagamaan" },
    { name: "Guru Ngaji", members: 90, type: "Pendidikan" },
  ]

  const financialResources = [
    { source: "PADes", amount: "Rp. 30.000.000", type: "Pendapatan Asli Desa" },
    { source: "Dana Desa/APBN", amount: "Rp. 1.183.201.000", type: "Pemerintah Pusat" },
    { source: "Alokasi Dana Desa", amount: "Rp. 830.748.200", type: "Kabupaten" },
    { source: "Dana Bagian Pajak", amount: "Rp. 308.950.300", type: "Retribusi" },
    { source: "APBD Provinsi", amount: "Rp. 130.000.000", type: "Provinsi" },
    { source: "Bunga Bank", amount: "Rp. 1.000.000", type: "Lain-lain" },
  ]

  const businessFacilities = [
    { type: "Toko", count: 7 },
    { type: "Warung", count: 107 },
    { type: "Bengkel Motor", count: 5 },
    { type: "Bengkel Mobil", count: 1 },
    { type: "Warnet", count: 1 },
    { type: "Warung Baso/Jajanan", count: 15 },
    { type: "Warung Makanan", count: 5 },
    { type: "Bengkel/Tambal Ban", count: 4 },
    { type: "Pengemudi/Ojeg", count: 21 },
    { type: "Agen BRI Link", count: 1 },
    { type: "Agen BNI", count: 1 },
    { type: "Counter HP/Pulsa", count: 10 },
    { type: "Photo Copy", count: 1 },
    { type: "Pengrajin Kursi/Lemari", count: 1 },
    { type: "Penjahit/Makloon", count: 17 },
  ]

  return (
    <section id="potensi" ref={sectionRef} className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Potensi Desa</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Kekayaan sumber daya dan potensi pembangunan Desa Suntenjaya</p>
        </div>

        {/* Natural Resources */}
        <div className="mb-16">
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-10"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mountain className="h-6 w-6 text-green-600" />
                  Sumber Daya Alam
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sumberDayaAlam.map((resource, index) => {
                    const IconComponent = Leaf
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <IconComponent className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">{resource.nama_sumber_daya_alam}</p>
                          <p className="text-xs text-gray-600">{resource.keterangan}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Financial Resources */}
        <div className="mb-16">
          <div
            className={`transition-all duration-1000 delay-400 ${isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-10"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  Sumber Daya Finansial
                  <Badge variant="secondary" className="ml-2">
                    Total: {totalSumberDayaFinansial}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sumberDayaFinansial.map((finance, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{finance.nama_sumber_daya_finansial}</h4>
                        <Badge variant="outline" className="text-xs">
                          {finance.keterangan}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-blue-600">{finance.jumlah}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Institutional Resources */}
          <div
            className={`transition-all duration-1000 delay-600 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-purple-600" />
                  Sumber Daya Kelembagaan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {sumberDayaKelembagaan.map((institution, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <div>
                        <span className="text-sm font-medium">{institution.nama_lembaga}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {institution.kategori_lembaga}
                        </Badge>
                      </div>
                      <Badge variant="secondary">{institution.jumlah_anggota} orang</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Facilities */}
          <div
            className={`transition-all duration-1000 delay-700 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-orange-600" />
                  Sarana Tempat Usaha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {saranaTempatUsaha.map((business, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm font-medium">{business.nama_sarana}</span>
                      <Badge variant="outline">{business.jumlah} unit</Badge>
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
