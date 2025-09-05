"use client"

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import CustomPagination from "@/components/custom-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserEditForm } from "@/components/users/user-edit-form";
import UsuarioCardItem from "@/components/users/user-card-item";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetcher } from "@/lib/axios";
import type { Usuario, UsuariosResponse } from "@/types/usuarios";
import { Plus, Search, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import * as XLSX from "xlsx";

const LIMIT = 6;

export default function Page() {
  const user = useAuthStore((state) => state.user);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVO" | "INACTIVO">("ALL");
  const [openCreate, setOpenCreate] = useState(false);

  const canCreateUsers = user?.role === "ADMIN";

  // Debounce para el buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
      setOffset(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Resetear offset cuando cambia el filtro de estado
  useEffect(() => {
    setOffset(0);
  }, [statusFilter]);

  const { data, isLoading, error, mutate } = useSWR<UsuariosResponse>(
    `/user/?&search=${debounced}&offset=${offset}&limit=${LIMIT}${statusFilter !== "ALL" ? `&status=${statusFilter}` : ""}`,
    fetcher,
    { keepPreviousData: true }
  );

  const exportUsuariosToExcel = async () => {
    try {
      const params = new URLSearchParams({ limit: "10000" });
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (debounced) params.append("search", debounced);

      const allData = await fetcher(`/user/?${params}`);
      if (!allData?.results?.length) return;

      const exportData = allData.results.map((usuario: Usuario) => ({
        ID: usuario.id,
        Nombre: usuario.name,
        DNI: usuario.dni,
        Email: usuario.email,
        Rol: usuario.role,
        Estado: usuario.status === "ACTIVO" ? "Activo" : "Inactivo",
        "Fecha de Creación": usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-ES') : 'N/A',
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      const sheetName = statusFilter === "ALL" ? "Usuarios" : `Usuarios-${statusFilter}`;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      const fileName = statusFilter === "ALL" ? "usuarios.xlsx" : `usuarios-${statusFilter.toLowerCase()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error al exportar:", error);
    }
  };

  const pages = useMemo(() => (data?.count ? Math.ceil(data.count / LIMIT) : 0), [data?.count]);

  if (error) {
    const errorMessage = error?.response?.status === 403
      ? "Acceso denegado. No tienes permisos para ver esta sección."
      : "Ocurrió un error al cargar los usuarios.";
    return <div className="flex items-center justify-center h-full text-lg text-destructive">{errorMessage}</div>;
  }

  return (
    <div className="flex flex-col gap-6 h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        {canCreateUsers && (
          <Button onClick={() => setOpenCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        )}
      </div>

      {/* Modal para crear nuevo usuario */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              Crear Nuevo Usuario
            </DialogTitle>
          </DialogHeader>
          <UserEditForm
            onSuccess={() => {
              setOpenCreate(false);
              mutate();
            }}
            onCancel={() => setOpenCreate(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuarios..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportUsuariosToExcel}>
            Exportar Excel
          </Button>

          <div className="flex border rounded-md">
            {[
              { key: "ALL", label: "Todos" },
              { key: "ACTIVO", label: "Activos" },
              { key: "INACTIVO", label: "Inactivos" }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={statusFilter === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setStatusFilter(key as typeof statusFilter)}
                className="rounded-none first:rounded-l-md last:rounded-r-md"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data?.results?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.results.map((usuario) => (
              <UsuarioCardItem key={usuario.id} usuario={usuario} mutate={mutate} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">No se encontraron usuarios</h3>
            <p className="text-sm">
              {search ? "Intenta con otros términos de búsqueda" : "No hay usuarios registrados aún"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.count > LIMIT && (
        <div className="flex justify-center">
          <CustomPagination
            total={pages}
            page={Math.floor(offset / LIMIT) + 1}
            setPage={(page) => setOffset((page - 1) * LIMIT)}
          />
        </div>
      )}
    </div>
  );
}