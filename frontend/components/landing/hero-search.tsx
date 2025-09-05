"use client";
import { Button } from "@/components/ui/button";
import type React from "react";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { fetcher } from "@/lib/axios";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";

// Datos de ejemplo para la sección de páginas médicas
const mockData = {
  paginas: [
    { title: "Inicio", url: "/" },
    { title: "Consultas Médicas", url: "/consultas" },
    { title: "Historial Clínico", url: "/historial" },
    { title: "Citas y Reservas", url: "/citas" },
    { title: "Laboratorios", url: "/laboratorios" },
    { title: "Emergencias", url: "/emergencias" },
  ],
};

// Interfaces para los datos de las APIs
interface Publication {
  id: number;
  titulo: string;
  portada: string;
  fecha: string;
  area: string;
}

interface Archive {
  id: number;
  nombre: string;
  descripcion: string;
  archivo: string;
  area: string;
}

export default function HeroSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{
    paginas: { title: string; url: string }[];
    publicaciones: Publication[];
    archivos: Archive[];
  }>({
    paginas: [],
    publicaciones: [],
    archivos: [],
  });
  const containerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Usar SWR para obtener datos de publicaciones y archivos en tiempo real
  const { data: publicationsData } = useSWR(
    searchTerm.length > 0 ? `publicaciones/?search=${searchTerm}` : null,
    fetcher,
    { refreshInterval: 300, revalidateOnFocus: false }
  );
  const { data: archivesData } = useSWR(
    searchTerm.length > 0 ? `areas/archivos/?search=${searchTerm}` : null,
    fetcher,
    { refreshInterval: 300, revalidateOnFocus: false }
  );

  // Determinar si está cargando
  const isLoading = searchTerm.length > 0 && (!publicationsData || !archivesData);

  // Filtrar resultados instantáneamente
  useEffect(() => {
    if (searchTerm.length < 1) {
      setResults({ paginas: [], publicaciones: [], archivos: [] });
      setIsOpen(false);
      return;
    }
    const termLower = searchTerm.toLocaleLowerCase();
    const filteredPages = mockData.paginas.filter((item) =>
      item.title.toLocaleLowerCase().includes(termLower) ||
      item.title.toLocaleLowerCase().split(' ').some(word => word.startsWith(termLower))
    );
    setResults({
      paginas: filteredPages,
      publicaciones: publicationsData?.results || [],
      archivos: archivesData?.results || [],
    });
    setIsOpen(true);
  }, [searchTerm, publicationsData, archivesData]);

  // Mantener el focus en el input cuando el popover se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [isOpen]);

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Manejar clic en el botón de búsqueda
  const handleSearchClick = () => {
    if (searchTerm.length > 0) {
      setIsOpen(true);
    }
  };

  // Verificar si hay resultados en alguna sección
  const hasResults =
    results.paginas.length > 0 ||
    (results.publicaciones && results.publicaciones.length > 0) ||
    (results.archivos && results.archivos.length > 0);

  // Función para manejar la navegación a publicaciones y archivos
  const handlePublicationClick = (publication: Publication) => {
    setIsOpen(false);
    // Redirigir a /publicaciones/[id]
    window.location.href = `/publicaciones/${publication.id}`;
  };

  const handleArchiveClick = (archive: Archive) => {
    setIsOpen(false);
    // Redirigir a /[area]/[id]/
    window.location.href = `/${archive.area}/${archive.id}`;
  };

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto">
      <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <div className="relative">
          <PopoverAnchor className="w-full">
            <div className="relative group">
              <Input
                ref={inputRef}
                placeholder="Buscar pacientes, historiales, citas..."
                className="w-full h-14 pl-6 pr-16 text-base border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                value={searchTerm}
                onChange={handleInputChange}
              />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 p-0 rounded-lg shadow-md transition-all duration-200"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
                onClick={handleSearchClick}
              >
                <Search className="h-5 w-5" />
              </Button>
              {/* Indicador de escritura */}
              {searchTerm && (
                <div 
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--primary)" }}
                ></div>
              )}
            </div>
          </PopoverAnchor>
        </div>
        <PopoverContent
          className="w-[700px] p-0 border-2 shadow-2xl rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--background)",
            borderColor: "var(--border)",
          }}
          align="start"
          sideOffset={12}
        >
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center gap-2" style={{ color: "var(--muted-foreground)" }}>
                <div 
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
                ></div>
                <span className="text-sm">Buscando...</span>
              </div>
            </div>
          ) : results.paginas.length > 0 || results.publicaciones.length > 0 || results.archivos.length > 0 ? (
            <div className="max-h-80 overflow-y-auto p-4">
              {/* Secciones */}
              {results.paginas.length > 0 && (
                <div className="mb-6">
                  <h3 
                    className="text-sm font-semibold mb-3 uppercase tracking-wide"
                    style={{ color: "var(--primary)" }}
                  >
                    Secciones del Sistema
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {results.paginas.map((item, index) => (
                      <Link
                        key={`page-${index}`}
                        href={item.url}
                        className="flex items-center p-3 rounded-lg shadow-sm hover:shadow-md transition-colors text-sm font-medium"
                        style={{
                          backgroundColor: "var(--muted)",
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                        }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: "var(--primary)" }}
                        ></div>
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {/* Publicaciones */}
              {results.publicaciones.length > 0 && (
                <div className="mb-6">
                  <h3 
                    className="text-sm font-semibold mb-3 uppercase tracking-wide"
                    style={{ color: "var(--secondary)" }}
                  >
                    Publicaciones Médicas
                  </h3>
                  <div className="space-y-3">
                    {results.publicaciones.slice(0, 3).map((item, index) => (
                      <div
                        key={`pub-${index}`}
                        onClick={() => handlePublicationClick(item)}
                        className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-colors"
                        style={{
                          backgroundColor: "var(--accent)",
                          borderColor: "var(--border)",
                        }}
                      >
                        {item.portada && (
                          <div 
                            className="flex-shrink-0 w-8 h-8 relative overflow-hidden rounded border"
                            style={{
                              backgroundColor: "var(--muted)",
                              borderColor: "var(--border)",
                            }}
                          >
                            <Image
                              src={item.portada || "/placeholder.svg"}
                              alt={item.titulo}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p 
                            className="font-semibold text-sm truncate"
                            style={{ color: "var(--foreground)" }}
                          >
                            {item.titulo}
                          </p>
                          <p 
                            className="text-xs"
                            style={{ color: "var(--secondary)" }}
                          >
                            {new Date(item.fecha).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Documentos */}
              {results.archivos.length > 0 && (
                <div>
                  <h3 
                    className="text-sm font-semibold mb-3 uppercase tracking-wide"
                    style={{ color: "var(--accent-foreground)" }}
                  >
                    Documentos Médicos
                  </h3>
                  <div className="space-y-3">
                    {results.archivos.slice(0, 3).map((item, index) => (
                      <div
                        key={`arch-${index}`}
                        onClick={() => handleArchiveClick(item)}
                        className="p-3 border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-colors"
                        style={{
                          backgroundColor: "var(--muted)",
                          borderColor: "var(--border)",
                        }}
                      >
                        <p 
                          className="font-semibold text-sm"
                          style={{ color: "var(--foreground)" }}
                        >
                          {item.nombre}
                        </p>
                        <p 
                          className="text-xs truncate"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          {item.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : searchTerm ? (
            <div className="p-6 text-center">
              <div className="mb-2" style={{ color: "var(--muted-foreground)" }}>
                <Search className="h-8 w-8 mx-auto opacity-50" />
              </div>
              <p style={{ color: "var(--muted-foreground)" }} className="text-sm">
                No se encontraron resultados para{" "}
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                  "{searchTerm}"
                </span>
              </p>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                Escribe para buscar en MEDISOL
              </p>
            </div>
          )}
          <div 
            className="px-6 py-4 border-t"
            style={{
              background: "linear-gradient(to right, var(--muted), var(--accent))",
              borderColor: "var(--border)"
            }}
          >
            <div className="flex items-center justify-between text-sm" style={{ color: "var(--muted-foreground)" }}>
              <div className="flex items-center gap-2">
                <kbd 
                  className="px-2 py-1 border rounded-md font-mono text-xs"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >ESC</kbd>
                <span>para cerrar</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: "var(--primary)" }}>MEDISOL</span>
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--primary)" }}
                ></div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
