"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import data from "./data.json"
import { api } from "@/lib/axios"
import { useAuthStore } from "@/store/authStore"
import { jwtDecode } from "jwt-decode"
import type { JwtPayload } from "@/types/auth"
import { EmployeeRole, SystemRole } from "@/lib/constants/employee-roles"

export default function DashboardContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { setTokens, setUser } = useAuthStore()

    const [areaCount, setAreaCount] = useState(0)
    const [areaDetail, setAreaDetail] = useState("")
    const [areaInactive, setAreaInactive] = useState(0)
    const [userCount, setUserCount] = useState(0)
    const [userDetail, setUserDetail] = useState("")
    const [userInactive, setUserInactive] = useState(0)
    const [ticketCount, setTicketCount] = useState(0)
    const [ticketDetail, setTicketDetail] = useState("")
    const [ticketResolved, setTicketResolved] = useState(0)

    // Manejar tokens de Google OAuth
    useEffect(() => {
        const accessToken = searchParams.get('accessToken')
        const refreshToken = searchParams.get('refreshToken')

        console.log('Dashboard - Params recibidos:', { accessToken: !!accessToken, refreshToken: !!refreshToken })

        if (accessToken && refreshToken) {
            console.log('Dashboard - Procesando tokens de Google OAuth')

            // Guardar tokens en el store
            setTokens(accessToken, refreshToken)

            // Decodificar el JWT para obtener info del usuario
            try {
                const decoded: JwtPayload = jwtDecode(accessToken)
                console.log('Dashboard - JWT decodificado:', decoded)

                setUser({
                    id: parseInt(decoded.sub),
                    dni: "",
                    firstName: "",
                    lastName: "",
                    email: decoded.email || "",
                    role: EmployeeRole.STAFF,
                    systemRole: (decoded.roles?.[0] as SystemRole) || SystemRole.USER,
                    isActive: true,
                    hasSystemAccess: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })

                console.log('Dashboard - Usuario guardado en el store')
            } catch (error) {
                console.error('Error decodificando JWT:', error)
            }

            // Limpiar la URL removiendo los parámetros
            router.replace('/dashboard')
        }
    }, [searchParams, setTokens, setUser, router])

    useEffect(() => {
        // Dar tiempo para que los tokens se procesen antes de hacer las llamadas
        const timer = setTimeout(() => {
            Promise.all([
                api.get("/area"),
                api.get("/area?status=ACTIVA&limit=1"),
                api.get("/area?status=INACTIVA&limit=1"),
            ]).then(([allRes, activeRes, inactiveRes]) => {
                setAreaCount(allRes.data.count)
                setAreaDetail(`Áreas activas: ${activeRes.data.count}`)
                setAreaInactive(inactiveRes.data.count)
            }).catch(() => {
                setAreaCount(0)
                setAreaDetail("No disponible")
                setAreaInactive(0)
            })

            Promise.all([
                api.get("/user"),
                api.get("/user?status=ACTIVO&limit=1"),
                api.get("/user?status=INACTIVO&limit=1"),
            ]).then(([allRes, activeRes, inactiveRes]) => {
                setUserCount(allRes.data.count)
                setUserDetail(`Usuarios activos: ${activeRes.data.count}`)
                setUserInactive(inactiveRes.data.count)
            }).catch(() => {
                setUserCount(0)
                setUserDetail("No disponible")
                setUserInactive(0)
            })

            Promise.all([
                api.get("/tickets"),
                api.get("/tickets?status=PENDIENTE&limit=1"),
                api.get("/tickets?status=RESUELTO&limit=1"),
            ]).then(([allRes, pendingRes, resolvedRes]) => {
                setTicketCount(allRes.data.count)
                setTicketDetail(`Tickets pendientes: ${pendingRes.data.count}`)
                setTicketResolved(resolvedRes.data.count)
            }).catch(() => {
                setTicketCount(0)
                setTicketDetail("No disponible")
                setTicketResolved(0)
            })
        }, 500) // Esperar 500ms para que se procesen los tokens

        return () => clearTimeout(timer)
    }, [searchParams]) // Depender de searchParams para que se ejecute cuando cambien

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <SidebarInset>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <SectionCards
                                areaCount={areaCount}
                                areaDetail={areaDetail}
                                areaInactive={areaInactive}
                                userCount={userCount}
                                userDetail={userDetail}
                                userInactive={userInactive}
                                ticketCount={ticketCount}
                                ticketDetail={ticketDetail}
                                ticketResolved={ticketResolved}
                            />
                            <DataTable data={data} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
