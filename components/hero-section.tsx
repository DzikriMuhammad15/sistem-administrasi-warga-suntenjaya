"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { supabase } from "@/lib/supabase/client"


interface HeroContent {
  link?: string
}

const getSiteSettings = async function getSiteSettings() {
  const { data, error } = await supabase.from("web_content_image_web").select("*").eq("section", "hero_section")

  if (error) {
    console.error("Error fetching site settings:", error)
    return {}
  }

  console.log(data)

  const settings: Record<string, any> = {}
  data?.forEach((setting) => {
    settings[setting.setting_key] = setting.setting_value
  })

  return settings
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [heroContent, setHeroContent] = useState<HeroContent>({})
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({})

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    const {data, error} = await supabase
      .from("web_content_image_web")
      .select("*")
      .eq("section", "hero_section")
    
    if(error){
      console.error(`error mendapatkan data hero: ${error}`)
    }
    const heroData = data?.find((item: any) => item.section == "hero_section")
    if(heroData){
      const heroContentInput = {link: heroData.link}
      setHeroContent(heroContentInput)
    }
    setIsVisible(true)
  }

  const scrollToProfile = () => {
    const element = document.querySelector("#profil")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed parallax"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${heroContent.link}')`,
        }}
      />

      {/* Animated overlay particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div
          className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">Selamat Datang di</h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">Desa Wisata Suntenjaya</h2>
          <p className="text-xl md:text-2xl mb-8 text-green-100 font-light">
            Kecamatan Lembang, Kabupaten Bandung Barat
          </p>
          <p className="text-lg mb-12 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Nikmati keindahan alam pegunungan, budaya tradisional, dan kehangatan masyarakat desa yang ramah
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToProfile}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Jelajahi Desa
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </div>
    </section>
  )
}
