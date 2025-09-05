"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const [hydrated, setHydrated] = useState(false)

  // Espera a que zustand hidrate el estado
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Redirige si no hay usuario autenticado (solo después de hidratar)
  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/auth/login")
    }
  }, [hydrated, user, router])

  // Muestra toast de login solo una vez
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("showLoginToast")) {
      toast.success("Sesión iniciada")
      localStorage.removeItem("showLoginToast")
    }
  }, [])

  if (!hydrated) {
    // Puedes mostrar un loader si quieres
    return null
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}