"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { Plus, Search, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import CustomPagination from "@/components/custom-pagination"
import UserAreaItem from "@/components/user-area/user-area-item"
import UserAreaEditItem from "@/components/user-area/user-area-edit-item"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { fetcher } from "@/lib/axios"
import type { UserArea } from "@/types/user-area"

const LIMIT = 9

export default function Page() {
    const [offset, setOffset] = useState(0)
    const [search, setSearch] = useState("")
    const [debounced, setDebounced] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [openCreate, setOpenCreate] = useState(false)

    // Debounce para el buscador
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounced(search)
            setOffset(0)
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const { data, isLoading, mutate } = useSWR<{ count: number; results: UserArea[] }>(
        `/user-area?search=${debounced}&offset=${offset}&limit=${LIMIT}`,
        fetcher,
        {
            keepPreviousData: true,
            onError: (err) => {
                if (err?.response?.status === 403) {
                    setError("Acceso denegado. No tienes permisos para ver esta sección.")
                } else {
                    setError("Ocurrió un error al cargar las asignaciones.")
                }
            },
        }
    )

    const pages = useMemo(() => (data?.count ? Math.ceil(data.count / LIMIT) : 0), [data?.count])

    if (error) {
        return <div className="flex items-center justify-center h-full text-lg text-destructive">{error}</div>
    }

    return (
        <div className="flex flex-col gap-6 h-full px-2 sm:px-6 py-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Asignación de Usuarios a Áreas</h1>
                </div>
                <Button
                    className="w-full sm:w-auto"
                    onClick={() => setOpenCreate(true)}
                >
                    <Plus className="h-4 w-4" />
                    Asignar
                </Button>
            </div>

            {/* Modal para asignar usuario a área */}
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogContent className="max-w-lg w-full">
                    <DialogHeader>
                        <DialogTitle>Asignar Usuario a Área</DialogTitle>
                    </DialogHeader>
                    <UserAreaEditItem
                        onSuccess={() => {
                            setOpenCreate(false)
                            mutate()
                        }}
                        onCancel={() => setOpenCreate(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative w-full max-w-md">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar asignaciones..."
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
                        <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-[40vh]">
                        <div className="w-14 h-14 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
                    </div>
                ) : data && data.results.length > 0 ? (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "flex flex-col gap-4"
                        }
                    >
                        {data.results.map((userArea) => (
                            <UserAreaItem key={userArea.id} userArea={userArea} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                        <div className="text-center">
                            <h3 className="text-lg font-medium mb-2">No se encontraron asignaciones</h3>
                            <p className="text-sm mb-4">
                                {search ? "Intenta con otros términos de búsqueda" : "Comienza asignando usuarios a áreas"}
                            </p>
                            {!search && (
                                <Button
                                    className="w-full sm:w-auto"
                                    onClick={() => setOpenCreate(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Asignar Usuario
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {data && data.count > LIMIT && (
                <div className="flex justify-center mt-6">
                    <CustomPagination
                        total={pages}
                        page={Math.floor(offset / LIMIT) + 1}
                        setPage={(page) => setOffset((page - 1) * LIMIT)}
                    />
                </div>
            )}
        </div>
    )
}