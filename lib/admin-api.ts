import { supabase } from "@/lib/supabase/client"

export class AdminAPI {
  // News Management
  static async getNews() {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createNews(newsData: any) {
    const { data, error } = await supabase
      .from("news")
      .insert([
        {
          title: newsData.title,
          slug: newsData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          content: newsData.content,
          excerpt: newsData.excerpt,
          category: newsData.category,
          author: newsData.author,
          date: newsData.date,
          image_url: newsData.image,
          featured: newsData.featured,
          status: newsData.status,
          read_time: newsData.readTime || "3 menit",
          views: 0,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateNews(id: string, newsData: any) {
    const { data, error } = await supabase
      .from("news")
      .update({
        title: newsData.title,
        slug: newsData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        content: newsData.content,
        excerpt: newsData.excerpt,
        category: newsData.category,
        author: newsData.author,
        date: newsData.date,
        image_url: newsData.image,
        featured: newsData.featured,
        status: newsData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteNews(id: string) {
    const { error } = await supabase.from("news").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Events Management
  static async getEvents() {
    const { data, error } = await supabase.from("events").select("*").order("start_date", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createEvent(eventData: any) {
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          start_date: eventData.startDate,
          end_date: eventData.endDate,
          featured_image: eventData.image,
          status: eventData.status || "upcoming",
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateEvent(id: string, eventData: any) {
    const { data, error } = await supabase
      .from("events")
      .update({
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        featured_image: eventData.image,
        status: eventData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Gallery Management
  static async getGallery() {
    const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createGalleryItem(galleryData: any) {
    const { data, error } = await supabase
      .from("gallery")
      .insert([
        {
          title: galleryData.title,
          description: galleryData.description,
          image_url: galleryData.imageUrl,
          thumbnail_url: galleryData.thumbnailUrl || galleryData.imageUrl,
          category: galleryData.category,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateGalleryItem(id: string, galleryData: any) {
    const { data, error } = await supabase
      .from("gallery")
      .update({
        title: galleryData.title,
        description: galleryData.description,
        image_url: galleryData.imageUrl,
        thumbnail_url: galleryData.thumbnailUrl || galleryData.imageUrl,
        category: galleryData.category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteGalleryItem(id: string) {
    const { error } = await supabase.from("gallery").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Homepage Content Management
  static async getHomepageContent() {
    const { data, error } = await supabase
      .from("homepage_content")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createHomepageContent(contentData: any) {
    const { data, error } = await supabase
      .from("homepage_content")
      .insert([
        {
          section_name: contentData.sectionName,
          title: contentData.title,
          content: contentData.content,
          image_url: contentData.imageUrl,
          display_order: contentData.displayOrder,
          is_active: contentData.isActive,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateHomepageContent(id: string, contentData: any) {
    const { data, error } = await supabase
      .from("homepage_content")
      .update({
        section_name: contentData.sectionName,
        title: contentData.title,
        content: contentData.content,
        image_url: contentData.imageUrl,
        display_order: contentData.displayOrder,
        is_active: contentData.isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteHomepageContent(id: string) {
    const { error } = await supabase.from("homepage_content").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Site Settings Management
  static async getSiteSettings() {
    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) throw new Error(error.message)

    const settings: Record<string, any> = {}
    data?.forEach((setting) => {
      settings[setting.setting_key] = setting.setting_value
    })

    return settings
  }

  static async updateSiteSetting(key: string, value: any) {
    const { data, error } = await supabase
      .from("site_settings")
      .upsert({
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  // Village Profile Management (legacy compatibility)
  static async getVillageProfile() {
    return this.getSiteSettings()
  }

  static async updateVillageProfile(data: any) {
    const promises = Object.entries(data).map(([key, value]) => this.updateSiteSetting(key, value))
    return Promise.all(promises)
  }

  // Statistics Management (legacy compatibility)
  static async getStatistics() {
    return this.getSiteSettings()
  }

  static async updateStatistics(data: any) {
    return this.updateVillageProfile(data)
  }

  // Government Data Management (legacy compatibility)
  static async getGovernmentData() {
    return this.getSiteSettings()
  }

  static async updateGovernmentData(data: any) {
    return this.updateVillageProfile(data)
  }

  // Government Structure Management
  static async getGovernmentStructure() {
    const { data, error } = await supabase
      .from("government_structure")
      .select("*")
      .order("order_index", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createGovernmentPosition(positionData: any) {
    const { data, error } = await supabase
      .from("government_structure")
      .insert([
        {
          name: positionData.name,
          position: positionData.position,
          photo_url: positionData.photo_url,
          photo_path: positionData.photo_path,
          order_index: positionData.order_index || 0,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateGovernmentPosition(id: string, positionData: any) {
    const { data, error } = await supabase
      .from("government_structure")
      .update({
        name: positionData.name,
        position: positionData.position,
        photo_url: positionData.photo_url,
        photo_path: positionData.photo_path,
        order_index: positionData.order_index,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteGovernmentPosition(id: string) {
    const { error } = await supabase.from("government_structure").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Village Officers Management
  static async getVillageOfficers() {
    const { data, error } = await supabase
      .from("village_officers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createVillageOfficer(officerData: any) {
    const { data, error } = await supabase
      .from("village_officers")
      .insert([
        {
          name: officerData.name,
          position: officerData.position,
          photo_url: officerData.photo_url,
          start_date: officerData.start_date,
          end_date: officerData.end_date || null,
          description: officerData.description,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateVillageOfficer(id: string, officerData: any) {
    const { data, error } = await supabase
      .from("village_officers")
      .update({
        name: officerData.name,
        position: officerData.position,
        photo_url: officerData.photo_url,
        start_date: officerData.start_date,
        end_date: officerData.end_date || null,
        description: officerData.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteVillageOfficer(id: string) {
    const { error } = await supabase.from("village_officers").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Village Heads Management
  static async getVillageHeads() {
    const { data, error } = await supabase.from("village_heads").select("*").order("start_year", { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createVillageHead(headData: any) {
    const { data, error } = await supabase
      .from("village_heads")
      .insert([
        {
          name: headData.name,
          photo_url: headData.photo_url,
          start_year: headData.start_year,
          end_year: headData.end_year,
          period: headData.period,
          achievements: headData.achievements,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateVillageHead(id: string, headData: any) {
    const { data, error } = await supabase
      .from("village_heads")
      .update({
        name: headData.name,
        photo_url: headData.photo_url,
        start_year: headData.start_year,
        end_year: headData.end_year,
        period: headData.period,
        achievements: headData.achievements,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteVillageHead(id: string) {
    const { error } = await supabase.from("village_heads").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Welcome Section Management
  static async getWelcomeSection() {
    const { data, error } = await supabase.from("welcome_section").select("*").single()

    if (error && error.code !== "PGRST116") throw new Error(error.message)
    return (
      data || {
        description:
          "Enjoy the beauty of mountain nature, traditional culture, and the warmth of a friendly village community",
      }
    )
  }

  static async updateWelcomeSection(welcomeData: any) {
    const { data, error } = await supabase
      .from("welcome_section")
      .upsert({
        id: welcomeData.id || undefined,
        background_image_url: welcomeData.background_image_url,
        background_image_path: welcomeData.background_image_path,
        description: welcomeData.description,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  // Village Profile Management
  static async getVillageProfileData() {
    const { data, error } = await supabase.from("village_profile").select("*").single()

    if (error && error.code !== "PGRST116") throw new Error(error.message)
    return data || {}
  }

  static async updateVillageProfileData(profileData: any) {
    const { data, error } = await supabase
      .from("village_profile")
      .upsert({
        id: profileData.id || undefined,
        coordinates: profileData.coordinates,
        altitude: profileData.altitude,
        temperature: profileData.temperature,
        land_area: profileData.land_area,
        total_population: profileData.total_population,
        male_population: profileData.male_population,
        female_population: profileData.female_population,
        total_hamlets: profileData.total_hamlets,
        total_rw: profileData.total_rw,
        total_rt: profileData.total_rt,
        state_forest_area: profileData.state_forest_area,
        agricultural_land_area: profileData.agricultural_land_area,
        profile_image_url: profileData.profile_image_url,
        profile_image_path: profileData.profile_image_path,
        agriculture_area: profileData.agriculture_area,
        fields_area: profileData.fields_area,
        residential_area: profileData.residential_area,
        village_vision: profileData.village_vision,
        village_history: profileData.village_history,
        north_boundary: profileData.north_boundary,
        west_boundary: profileData.west_boundary,
        south_boundary: profileData.south_boundary,
        east_boundary: profileData.east_boundary,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  // Hamlet Management
  static async getHamlets() {
    const { data, error } = await supabase.from("hamlets").select("*").order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createHamlet(hamletData: any) {
    const { data, error } = await supabase
      .from("hamlets")
      .insert([
        {
          name: hamletData.name,
          head_name: hamletData.head_name,
          population: hamletData.population,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateHamlet(id: string, hamletData: any) {
    const { data, error } = await supabase
      .from("hamlets")
      .update({
        name: hamletData.name,
        head_name: hamletData.head_name,
        population: hamletData.population,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteHamlet(id: string) {
    const { error } = await supabase.from("hamlets").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Village Institutions Management
  static async getVillageInstitutions() {
    const { data, error } = await supabase.from("village_institutions").select("*").order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createVillageInstitution(institutionData: any) {
    const { data, error } = await supabase
      .from("village_institutions")
      .insert([
        {
          name: institutionData.name,
          member_count: institutionData.member_count,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateVillageInstitution(id: string, institutionData: any) {
    const { data, error } = await supabase
      .from("village_institutions")
      .update({
        name: institutionData.name,
        member_count: institutionData.member_count,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteVillageInstitution(id: string) {
    const { error } = await supabase.from("village_institutions").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Education Statistics Management
  static async getEducationStatistics() {
    const { data, error } = await supabase.from("education_statistics").select("*").order("level", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createEducationStatistic(educationData: any) {
    const { data, error } = await supabase
      .from("education_statistics")
      .insert([
        {
          level: educationData.level,
          count: educationData.count,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateEducationStatistic(id: string, educationData: any) {
    const { data, error } = await supabase
      .from("education_statistics")
      .update({
        level: educationData.level,
        count: educationData.count,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteEducationStatistic(id: string) {
    const { error } = await supabase.from("education_statistics").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Livelihoods Management
  static async getLivelihoods() {
    const { data, error } = await supabase.from("livelihoods").select("*").order("type", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createLivelihood(livelihoodData: any) {
    const { data, error } = await supabase
      .from("livelihoods")
      .insert([
        {
          type: livelihoodData.type,
          count: livelihoodData.count,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateLivelihood(id: string, livelihoodData: any) {
    const { data, error } = await supabase
      .from("livelihoods")
      .update({
        type: livelihoodData.type,
        count: livelihoodData.count,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteLivelihood(id: string) {
    const { error } = await supabase.from("livelihoods").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Livestock Management
  static async getLivestock() {
    const { data, error } = await supabase.from("livestock").select("*").order("type", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createLivestock(livestockData: any) {
    const { data, error } = await supabase
      .from("livestock")
      .insert([
        {
          type: livestockData.type,
          count: livestockData.count,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateLivestock(id: string, livestockData: any) {
    const { data, error } = await supabase
      .from("livestock")
      .update({
        type: livestockData.type,
        count: livestockData.count,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteLivestock(id: string) {
    const { error } = await supabase.from("livestock").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Infrastructure Management
  static async getInfrastructure() {
    const { data, error } = await supabase.from("infrastructure").select("*").order("type", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createInfrastructure(infrastructureData: any) {
    const { data, error } = await supabase
      .from("infrastructure")
      .insert([
        {
          type: infrastructureData.type,
          count: infrastructureData.count,
          unit: infrastructureData.unit || "unit",
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateInfrastructure(id: string, infrastructureData: any) {
    const { data, error } = await supabase
      .from("infrastructure")
      .update({
        type: infrastructureData.type,
        count: infrastructureData.count,
        unit: infrastructureData.unit,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteInfrastructure(id: string) {
    const { error } = await supabase.from("infrastructure").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Sports Facilities Management
  static async getSportsFacilities() {
    const { data, error } = await supabase.from("sports_facilities").select("*").order("type", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createSportsFacility(facilityData: any) {
    const { data, error } = await supabase
      .from("sports_facilities")
      .insert([
        {
          type: facilityData.type,
          count: facilityData.count,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateSportsFacility(id: string, facilityData: any) {
    const { data, error } = await supabase
      .from("sports_facilities")
      .update({
        type: facilityData.type,
        count: facilityData.count,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteSportsFacility(id: string) {
    const { error } = await supabase.from("sports_facilities").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Natural Resources Management
  static async getNaturalResources() {
    const { data, error } = await supabase.from("natural_resources").select("*").order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createNaturalResource(resourceData: any) {
    const { data, error } = await supabase
      .from("natural_resources")
      .insert([
        {
          name: resourceData.name,
          description: resourceData.description,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateNaturalResource(id: string, resourceData: any) {
    const { data, error } = await supabase
      .from("natural_resources")
      .update({
        name: resourceData.name,
        description: resourceData.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteNaturalResource(id: string) {
    const { error } = await supabase.from("natural_resources").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Financial Resources Management
  static async getFinancialResources() {
    const { data, error } = await supabase.from("financial_resources").select("*").order("source", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createFinancialResource(resourceData: any) {
    const { data, error } = await supabase
      .from("financial_resources")
      .insert([
        {
          source: resourceData.source,
          amount: resourceData.amount,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateFinancialResource(id: string, resourceData: any) {
    const { data, error } = await supabase
      .from("financial_resources")
      .update({
        source: resourceData.source,
        amount: resourceData.amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteFinancialResource(id: string) {
    const { error } = await supabase.from("financial_resources").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Institutional Resources Management
  static async getInstitutionalResources() {
    const { data, error } = await supabase
      .from("institutional_resources")
      .select("*")
      .order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createInstitutionalResource(resourceData: any) {
    const { data, error } = await supabase
      .from("institutional_resources")
      .insert([
        {
          name: resourceData.name,
          description: resourceData.description,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateInstitutionalResource(id: string, resourceData: any) {
    const { data, error } = await supabase
      .from("institutional_resources")
      .update({
        name: resourceData.name,
        description: resourceData.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteInstitutionalResource(id: string) {
    const { error } = await supabase.from("institutional_resources").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Business Facilities Management
  static async getBusinessFacilities() {
    const { data, error } = await supabase.from("business_facilities").select("*").order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createBusinessFacility(facilityData: any) {
    const { data, error } = await supabase
      .from("business_facilities")
      .insert([
        {
          name: facilityData.name,
          description: facilityData.description,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateBusinessFacility(id: string, facilityData: any) {
    const { data, error } = await supabase
      .from("business_facilities")
      .update({
        name: facilityData.name,
        description: facilityData.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteBusinessFacility(id: string) {
    const { error } = await supabase.from("business_facilities").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Arts and Culture Management
  static async getArtsCulture() {
    const { data, error } = await supabase.from("arts_culture").select("*").order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createArtsCulture(cultureData: any) {
    const { data, error } = await supabase
      .from("arts_culture")
      .insert([
        {
          name: cultureData.name,
          type: cultureData.type,
          description: cultureData.description,
          image_url: cultureData.image_url,
          image_path: cultureData.image_path,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateArtsCulture(id: string, cultureData: any) {
    const { data, error } = await supabase
      .from("arts_culture")
      .update({
        name: cultureData.name,
        type: cultureData.type,
        description: cultureData.description,
        image_url: cultureData.image_url,
        image_path: cultureData.image_path,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteArtsCulture(id: string) {
    const { error } = await supabase.from("arts_culture").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Cultural Heritage Management
  static async getCulturalHeritage() {
    const { data, error } = await supabase.from("cultural_heritage").select("*").order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createCulturalHeritage(heritageData: any) {
    const { data, error } = await supabase
      .from("cultural_heritage")
      .insert([
        {
          name: heritageData.name,
          description: heritageData.description,
          image_url: heritageData.image_url,
          image_path: heritageData.image_path,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateCulturalHeritage(id: string, heritageData: any) {
    const { data, error } = await supabase
      .from("cultural_heritage")
      .update({
        name: heritageData.name,
        description: heritageData.description,
        image_url: heritageData.image_url,
        image_path: heritageData.image_path,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteCulturalHeritage(id: string) {
    const { error } = await supabase.from("cultural_heritage").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Village Services Management
  static async getVillageServices() {
    const { data, error } = await supabase.from("village_services").select("*").order("name", { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createVillageService(serviceData: any) {
    const { data, error } = await supabase
      .from("village_services")
      .insert([
        {
          name: serviceData.name,
          description: serviceData.description,
          icon_url: serviceData.icon_url,
          icon_path: serviceData.icon_path,
          google_form_url: serviceData.google_form_url,
          google_form_response_url: serviceData.google_form_response_url,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateVillageService(id: string, serviceData: any) {
    const { data, error } = await supabase
      .from("village_services")
      .update({
        name: serviceData.name,
        description: serviceData.description,
        icon_url: serviceData.icon_url,
        icon_path: serviceData.icon_path,
        google_form_url: serviceData.google_form_url,
        google_form_response_url: serviceData.google_form_response_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteVillageService(id: string) {
    const { error } = await supabase.from("village_services").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Public Documents Management (PPID)
  static async getPublicDocuments() {
    const { data, error } = await supabase
      .from("public_documents")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createPublicDocument(documentData: any) {
    const { data, error } = await supabase
      .from("public_documents")
      .insert([
        {
          title: documentData.title,
          description: documentData.description,
          file_url: documentData.file_url,
          file_path: documentData.file_path,
          file_type: documentData.file_type,
          is_visible: documentData.is_visible !== false,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updatePublicDocument(id: string, documentData: any) {
    const { data, error } = await supabase
      .from("public_documents")
      .update({
        title: documentData.title,
        description: documentData.description,
        file_url: documentData.file_url,
        file_path: documentData.file_path,
        file_type: documentData.file_type,
        is_visible: documentData.is_visible,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deletePublicDocument(id: string) {
    const { error } = await supabase.from("public_documents").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Tourism Management
  static async getTourism() {
    const { data, error } = await supabase.from("tourism").select("*").order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createTourism(tourismData: any) {
    const { data, error } = await supabase
      .from("tourism")
      .insert([
        {
          name: tourismData.name,
          description: tourismData.description,
          location: tourismData.location,
          image_url: tourismData.image_url,
          image_path: tourismData.image_path,
        },
      ])
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async updateTourism(id: string, tourismData: any) {
    const { data, error } = await supabase
      .from("tourism")
      .update({
        name: tourismData.name,
        description: tourismData.description,
        location: tourismData.location,
        image_url: tourismData.image_url,
        image_path: tourismData.image_path,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }

  static async deleteTourism(id: string) {
    const { error } = await supabase.from("tourism").delete().eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Contact Information Management
  static async getContactInfo() {
    const { data, error } = await supabase.from("contact_info").select("*").single()

    if (error && error.code !== "PGRST116") throw new Error(error.message)
    return (
      data || {
        address: "",
        phone: "",
        email: "",
        service_hours: "",
        facebook_url: "",
        instagram_url: "",
        twitter_url: "",
        youtube_url: "",
      }
    )
  }

  static async updateContactInfo(contactData: any) {
    const { data, error } = await supabase
      .from("contact_info")
      .upsert({
        id: contactData.id || undefined,
        address: contactData.address,
        phone: contactData.phone,
        email: contactData.email,
        service_hours: contactData.service_hours,
        facebook_url: contactData.facebook_url,
        instagram_url: contactData.instagram_url,
        twitter_url: contactData.twitter_url,
        youtube_url: contactData.youtube_url,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw new Error(error.message)
    return data?.[0]
  }
}

export const adminApi = AdminAPI
