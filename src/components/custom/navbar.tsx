"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, LogOut, Moon, Sun, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import type { User as UserType } from "@/types"

export function Navbar() {
  const [user, setUser] = useState<UserType | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const stored = localStorage.getItem("shehri_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("shehri_user")
    setUser(null)
    window.location.href = "/"
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all complaint data? This cannot be undone.")) {
      localStorage.removeItem("shehri_complaints")
      window.location.reload()
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                SP
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">
                Shehri Portal
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/complaints" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Browse Complaints
            </Link>
            {user?.role === "officer" && (
              <Link href="/officer/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Officer Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearData}
              className="hidden sm:flex text-critical hover:text-critical"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-border py-3 space-y-2">
            <Link href="/complaints" className="block px-2 py-1.5 text-sm font-medium hover:bg-muted rounded-md">
              Browse Complaints
            </Link>
            {user?.role === "officer" && (
              <Link href="/officer/dashboard" className="block px-2 py-1.5 text-sm font-medium hover:bg-muted rounded-md">
                Officer Dashboard
              </Link>
            )}
            <div className="border-t border-border my-2 pt-2 space-y-1">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md w-full"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
              <button
                onClick={handleClearData}
                className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-critical hover:bg-critical/10 rounded-md w-full"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
