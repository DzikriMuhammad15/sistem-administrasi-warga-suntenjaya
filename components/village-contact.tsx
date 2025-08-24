"use client"
import { supabase } from "@/lib/supabase/client"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react"


interface ContactContent{
  kecamatan?: string;
  kabupaten?: string;
  provinsi?: string;
  nomor_pos?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  whatsapp?: string;
}





export function VillageContact() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [contactContent, setContactContent] = useState<ContactContent>({})

  const [hasDataLoaded, setHasDataLoaded] = useState(false)

  const socialMedia = [
    { name: "Facebook", handle: contactContent.facebook, color: "bg-blue-600" },
    { name: "Instagram", handle: contactContent.instagram, color: "bg-pink-600" },
    { name: "WhatsApp", handle: contactContent.whatsapp, color: "bg-green-600" },
    { name: "YouTube", handle: contactContent.youtube, color: "bg-red-600" },
  ]


  const loadContent = async () => {

    const { data: data_contact_content, error: error_contact_content } = await supabase
      .from("web_content_informasi_desa")
      .select("*")
    
    if(error_contact_content){
      console.error(`error mendapatkan data informasi desa: ${error_contact_content}`)
    }

    const contactContentInput = {
        kecamatan: data_contact_content?.[0]?.kecamatan,
        kabupaten: data_contact_content?.[0]?.kabupaten,
        provinsi: data_contact_content?.[0]?.provinsi,
        nomor_pos: data_contact_content?.[0]?.nomor_pos,
        email: data_contact_content?.[0]?.email,
        facebook: data_contact_content?.[0]?.facebook,
        instagram: data_contact_content?.[0]?.instagram,
        youtube: data_contact_content?.[0]?.youtube,
        whatsapp: data_contact_content?.[0]?.whatsapp
    }

    setContactContent(contactContentInput)
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




  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat",
      details: ["Desa Suntenjaya", `Kecamatan ${contactContent.kecamatan}`, `Kabupaten ${contactContent.kabupaten}`, `${contactContent.provinsi} ${contactContent.nomor_pos}`],
    },
    {
      icon: Mail,
      title: "Email",
      details: [contactContent.email],
    },
  ]



  return (
    <section id="kontak" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
        </div>

        {/* Card Container */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-6 justify-center">
          {/* Contact Information */}
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon
            return (
              <Card
                key={index}
                className="w-full md:w-1/3 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Social Media */}
          <Card className="w-full md:w-1/3 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                Media Sosial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {socialMedia.map((social, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 ${social.color} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white text-xs font-bold">
                        {social.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {social.name}
                      </p>
                      <p className="text-gray-600 text-xs">{social.handle}</p>
                    </div>
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
