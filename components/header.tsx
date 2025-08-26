"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { AdminLogin } from "@/components/admin-login"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "#profil", label: "Profil" },
    { href: "#layanan", label: "Layanan" },
    { href: "#ppid", label: "PPID" },
    { href: "#galeri", label: "Galeri" },
    { href: "#berita", label: "Berita" },
    { href: "#kontak", label: "Kontak" },
  ]

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-green-800/95 backdrop-blur-md shadow-lg" : "bg-green-800"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo + Nama Desa */}
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="flex items-center sm:gap-2 md:gap-6 bg-white/10 rounded-lg p-2">
                {/* Logo 1 */}
                <Image
                  src="/Logo_Kabupaten_Bandung_Barat.png"
                  alt="Logo Desa 1"
                  width={40}
                  height={40}
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
                {/* Logo 2 */}
                <Image
                  src="/Logo_sadira.png"
                  alt="Logo Desa 2"
                  width={40}
                  height={40}
                  className="w-8 h-8 md:w-10 md:h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Desa Suntenjaya</h1>
                <p className="text-green-100 text-sm">Lembang, Bandung Barat</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-white hover:text-green-200 transition-colors duration-300 font-medium relative group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-200 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </nav>

            {/* Admin Controls */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => (window.location.href = "/login")}
              >
                Admin Login
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-green-900/95 backdrop-blur-md border-t border-green-700">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-3">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left text-white hover:text-green-200 transition-colors duration-300 py-2"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-3 border-t border-green-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-white hover:bg-white/10"
                    onClick={() => {
                      setIsMenuOpen(false)
                      window.location.href = "/login"
                    }}
                  >
                    Admin Login
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
    </>
  )
}
