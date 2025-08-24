"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Home } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const { user, logout } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = "/" // redirect ke home setelah logout
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Content Management System
          </h1>
          <p className="text-sm text-gray-600">
            Kelola konten website Desa Suntenjaya
          </p>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tombol View Website */}
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="mr-2 h-4 w-4" />
              View Website
            </Button>
          </Link>

          {/* Tombol Logout */}
          <Button
            onClick={handleLogout}
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </Button>

          {/* Avatar di paling kanan */}
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-green-600 text-white">
              {user ? getInitials(user.user_metadata?.full_name || user.email!) : "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
