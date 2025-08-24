"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Mountain } from "lucide-react"
import { supabase } from "@/lib/supabase/client"


interface ProfileContent {
  luas_tanah_pertanian?: number;
  luas_ladang?: number;
  luas_hutan_negara?: number;
  luas_pemukiman?: number;
  luas_total?: number;
  jumlah_rt?: number;
  jumlah_rw?: number;
  jumlah_dusun?: number;
  penduduk_pria?: number;
  penduduk_wanita?: number;
  penduduk_total?: number;
  visi_desa?: string;
  profile_image_link?: string;
}


export function VillageProfile() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasDataLoaded, setHasDataLoaded] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  
  // dynamic
  const [ProfileContent, setProfileContent] = useState<ProfileContent>({})

  const loadContent = async () => {
    const {data, error} = await supabase
      .from("web_content_informasi_desa")
      .select("*")
    
    if(error){
      console.error(`error mendapatkan data profile: ${error}`)
    }

    const profileData = data?.[0]
  

    const {data: data_image, error: error_image} = await supabase
      .from("web_content_image_web")
      .select("*")
      .eq("section", "profile_section")

    if(error_image){
      console.error(`error mendapatkan gambar profile ${error_image}`)
    }

    const profileImageURL = data_image?.find((item: any) => item.section == "profile_section")

    if(profileData){
      const profileDataInput = {
        luas_tanah_pertanian: profileData.luas_tanah_pertanian,
        luas_ladang: profileData.luas_ladang,
        luas_hutan_negara: profileData.luas_hutan_negara,
        luas_pemukiman: profileData.luas_pemukiman,
        luas_total: profileData.luas_tanah_pertanian + profileData.luas_ladang + profileData.luas_hutan_negara + profileData.luas_pemukiman,
        jumlah_rt: profileData.jumlah_rt,
        jumlah_rw: profileData.jumlah_rw,
        jumlah_dusun: profileData.jumlah_dusun,
        penduduk_pria: profileData.penduduk_pria,
        penduduk_wanita: profileData.penduduk_wanita,
        penduduk_total: profileData.penduduk_pria + profileData.penduduk_wanita,
        visi_desa: profileData.visi_desa,
        profile_image_link: profileImageURL.link,
      }
      console.log(profileDataInput)
      setProfileContent(profileDataInput)
    }
    setHasDataLoaded(true)
    console.log("beres pertama")
    console.log(hasDataLoaded)
  }

  useEffect(() => {
    loadContent()
  }, [])


  // Intersection Observer untuk animasi
  useEffect(() => {
    console.log("masuk kedua")
    console.log(`kedua: ${hasDataLoaded}`)
    if (!hasDataLoaded) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [hasDataLoaded])

  return (
    <section id="profil" ref={sectionRef} className="py-20 bg-gradient-to-br from-white to-green-50">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Profil Desa Suntenjaya</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Desa yang MAJU (Mandiri, Agamis, Jenius, dan Unggul) dengan semangat persatuan dan gotong royong
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold">Lokasi & Geografis</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Koordinat:</span> 11,68° LU, 6°49'45,268" LS
              </p>
              <p>
                <span className="font-medium">Ketinggian:</span> 1.280-1.290 mdpl
              </p>
              <p>
                <span className="font-medium">Suhu:</span> 20-24°C
              </p>
              <p>
                <span className="font-medium">Luas:</span> {ProfileContent.luas_total} Ha
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Demografi</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Total Penduduk:</span> {ProfileContent.penduduk_total} jiwa
              </p>
              <p>
                <span className="font-medium">Laki-laki:</span> {ProfileContent.penduduk_pria} jiwa ({ProfileContent.penduduk_pria/ProfileContent.penduduk_total * 100}%)
              </p>
              <p>
                <span className="font-medium">Perempuan:</span> {ProfileContent.penduduk_wanita} jiwa ({ProfileContent.penduduk_wanita/ProfileContent.penduduk_total * 100}%)
              </p>
              <p>
                <span className="font-medium">Dusun:</span> {ProfileContent.jumlah_dusun} wilayah
              </p>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <Mountain className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-semibold">Wilayah</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">RW:</span> {ProfileContent.jumlah_rw} wilayah
              </p>
              <p>
                <span className="font-medium">RT:</span> {ProfileContent.jumlah_rt} wilayah
              </p>
              <p>
                <span className="font-medium">Hutan Negara:</span> {ProfileContent.luas_hutan_negara} Ha
              </p>
              <p>
                <span className="font-medium">Tanah Pertanian:</span> {ProfileContent.luas_tanah_pertanian} Ha
              </p>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-10"}`}
          >
            <Card className="overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="relative group">
                  <img
                    src={ProfileContent.profile_image_link}
                    alt="Pemandangan Desa Suntenjaya dengan latar belakang perbukitan hijau dan sawah terasering"
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 p-6">
              <h4 className="text-lg font-semibold mb-4">Penggunaan Lahan</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Tanah Pertanian</span>
                  <Badge variant="secondary">{ProfileContent.luas_tanah_pertanian} Ha</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Hutan Negara</span>
                  <Badge variant="secondary">{ProfileContent.luas_hutan_negara} Ha</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Ladang/Tegal</span>
                  <Badge variant="secondary">{ProfileContent.luas_ladang} Ha</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Pemukiman</span>
                  <Badge variant="secondary">{ProfileContent.luas_pemukiman} Ha</Badge>
                </div>
              </div>
            </Card>
          </div>

          <div
            className={`space-y-6 transition-all duration-1000 delay-400 ${isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-10"}`}
          >
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
                <h4 className="text-lg font-semibold text-green-600 mb-3">Visi Desa</h4>
                <p className="text-gray-700 leading-relaxed">
                  "{ProfileContent.visi_desa}"
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
                <h4 className="text-lg font-semibold text-blue-600 mb-3">Sejarah Singkat</h4>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Desa Suntenjaya memiliki sejarah geologis yang unik, terbentuk dari aktivitas vulkanik Gunung Sunda
                  dan Gunung Tangkuban Perahu. Dataran tinggi yang subur ini merupakan hasil dari lahar dan debu
                  vulkanik yang menjadikan tanah sangat cocok untuk pertanian.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
                <h4 className="text-lg font-semibold text-orange-600 mb-3">Batas Wilayah</h4>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Utara:</span> Desa Cupunagara
                  </div>
                  <div>
                    <span className="font-medium">Selatan:</span> Desa Cikadut
                  </div>
                  <div>
                    <span className="font-medium">Barat:</span> Desa Cibodas
                  </div>
                  <div>
                    <span className="font-medium">Timur:</span> Desa Cipanjalu
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold">{ProfileContent.penduduk_total}</div>
                <div className="text-sm opacity-90">Total Penduduk</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold">{ProfileContent.luas_total}</div>
                <div className="text-sm opacity-90">Hektar Luas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
