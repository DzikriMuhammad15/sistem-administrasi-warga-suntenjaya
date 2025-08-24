"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Newspaper, MapPin, BarChart3, TrendingUp, Eye, Calendar, Activity } from "lucide-react"

export function DashboardOverview() {
  const stats = [
    {
      title: "Total Berita",
      value: "24",
      description: "+2 dari bulan lalu",
      icon: Newspaper,
      trend: "up",
    },
    {
      title: "Pengunjung Website",
      value: "1,234",
      description: "+12% dari bulan lalu",
      icon: Eye,
      trend: "up",
    },
    {
      title: "Data Pemerintahan",
      value: "15",
      description: "Struktur organisasi",
      icon: Users,
      trend: "stable",
    },
    {
      title: "Destinasi Wisata",
      value: "8",
      description: "Lokasi terdaftar",
      icon: MapPin,
      trend: "stable",
    },
  ]

  const recentActivities = [
    {
      action: "Berita baru ditambahkan",
      title: "Program Bantuan Sosial 2024",
      time: "2 jam yang lalu",
      icon: Newspaper,
    },
    {
      action: "Data statistik diperbarui",
      title: "Statistik Penduduk Q4 2024",
      time: "1 hari yang lalu",
      icon: BarChart3,
    },
    {
      action: "Profil desa diperbarui",
      title: "Visi Misi Desa",
      time: "3 hari yang lalu",
      icon: MapPin,
    },
    {
      action: "Galeri foto ditambahkan",
      title: "Kegiatan Gotong Royong",
      time: "1 minggu yang lalu",
      icon: Activity,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">Selamat datang di panel admin Desa Suntenjaya</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-600 flex items-center mt-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>Perubahan terbaru pada konten website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Aksi cepat untuk mengelola konten</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Newspaper className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium text-sm">Tambah Berita</p>
                <p className="text-xs text-gray-600">Buat artikel baru</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <BarChart3 className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium text-sm">Update Statistik</p>
                <p className="text-xs text-gray-600">Perbarui data</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Users className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-sm">Edit Pemerintahan</p>
                <p className="text-xs text-gray-600">Kelola struktur</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <MapPin className="h-6 w-6 text-orange-600 mb-2" />
                <p className="font-medium text-sm">Kelola Wisata</p>
                <p className="text-xs text-gray-600">Update destinasi</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
