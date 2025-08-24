"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { DashboardOverview } from "./dashboard-overview"
import { KepalaDesaManagement } from "./kepala-desa-management"
import { StrukturKepemerintahanManagement } from "../struktur-kepemerintahan-management"
import { TingkatPendidikanManagement } from "./web-content-tingkat-pendidikan-management"
import { MataPencaharianManagement } from "./mata-pencaharian-management"
import { SaranaPrasaranaManagement } from "./sarana-prasarana-management"
import { SaranaOlahragaManagement } from "./sarana-olahraga-management"
import { SumberDayaAlamManagement } from "./sumber-daya-alam-management"
import { SumberDayaFinansialManagement } from "./sumber-daya-finansial-management"
import { SumberDayaKelembagaanManagement } from "./sumber-daya-kelembagaan-management"
import { SaranaTempatUsahaManagement } from "./sarana-tempat-usaha-management"
import { SeniBudayaManagement } from "./seni-budaya-management"
import { LayananDesaManagement } from "./layanan-desa-management"
import { GaleriDesaManagement } from "./galeri-desa-management"
import { BeritaDesaManagement } from "./berita-desa-management"
import { ImageWebManagement } from "./image-web-management"
import { DokumenDesaManagement } from "./dokumen-desa-management"
import { InformasiDesaManagement } from "./informasi-desa-management"
import { DusunManagement } from "./dusun-management"
import { KelembagaanDesaManagement } from "./kelembagaan-desa-management"


export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("homepage-content")

  const renderContent = () => {
    switch (activeSection) {
      case "village-info":
        return <InformasiDesaManagement />
      case "village-head":
        return <KepalaDesaManagement />
      case "government-structure":
        return <StrukturKepemerintahanManagement />
      case "hamlets":
        return <DusunManagement />
      case "institutions":
        return <KelembagaanDesaManagement />
      case "education":
        return <TingkatPendidikanManagement />
      case "livelihoods":
        return <MataPencaharianManagement />
      case "infrastructure":
        return <SaranaPrasaranaManagement />
      case "sports-facilities":
        return <SaranaOlahragaManagement />
      case "natural-resources":
        return <SumberDayaAlamManagement />
      case "financial-resources":
        return <SumberDayaFinansialManagement />
      case "institutional-resources":
        return <SumberDayaKelembagaanManagement />
      case "business-facilities":
        return <SaranaTempatUsahaManagement />
      case "arts-culture":
        return <SeniBudayaManagement />
      case "village-services":
        return <LayananDesaManagement />
      case "village-documents":
        return <DokumenDesaManagement />
      case "village-gallery":
        return <GaleriDesaManagement />
      case "village-news":
        return <BeritaDesaManagement />
      case "profile-picture":
        return <ImageWebManagement />
      default:
        return <InformasiDesaManagement />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  )
}
