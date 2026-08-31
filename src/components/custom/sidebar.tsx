"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, FileText, PlusCircle, BarChart3, Menu, X, Moon, Sun, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import type { User } from "@/types"

const citizenLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/complaints/new", label: "Report Issue", icon: PlusCircle },
  { href: "/complaints/mine", label: "My Complaints", icon: FileText },
  { href: "/complaints", label: "Browse", icon: BarChart3 },
]

const officerLinks = [
  { href: "/officer/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/complaints", label: "Browse", icon: FileText },
]

export function Sidebar() {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const stored = localStorage.getItem("shehri_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const links = user?.role === "officer" ? officerLinks : citizenLinks

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all complaint data? This cannot be undone.")) {
      localStorage.removeItem("shehri_complaints")
      window.location.reload()
    }
  }

  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-40 md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute right-0 top-0 h-full w-64 bg-card border-l border-border p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold">Menu</span>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
              <div className="border-t border-border my-2 pt-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-critical hover:bg-critical/10 transition-colors w-full"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="font-bold text-sm">Shehri Portal</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border p-4 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          <button
            onClick={handleClearData}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-critical hover:bg-critical/10 transition-colors w-full"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </button>
          <p className="text-xs text-muted-foreground pt-2">
            KMC Helpdesk: 1339
          </p>
        </div>
      </aside>
    </>
  )
}
