import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { VillageProfile } from "@/components/village-profile"
import { VillageHistory } from "@/components/village-history"
import { VillageGovernment } from "@/components/village-government"
import { VillageStatistics } from "@/components/village-statistics"
import { VillagePotential } from "@/components/village-potential"
import { VillageArtsCulture } from "@/components/village-arts-culture"
import { VillageServices } from "@/components/village-services"
import { VillagePPID } from "@/components/village-ppid"
import { VillageGallery } from "@/components/village-gallery"
import { VillageNews } from "@/components/village-news"
import { VillageTourism } from "@/components/village-tourism"
import { VillageContact } from "@/components/village-contact"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <VillageProfile />
      <VillageHistory />
      <VillageGovernment />
      <VillageStatistics />
      <VillagePotential />
      <VillageArtsCulture />
      <VillageServices />
      <VillagePPID />
      <VillageGallery />
      <VillageNews />
      <VillageContact />
    </main>
  )
}
