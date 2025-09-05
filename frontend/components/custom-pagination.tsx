"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

interface CustomPaginationProps {
  page: number;
  total: number;
  setPage: (page: number) => void;
  max_visible_pages?: number;
}

export default function CustomPagination({
  page,
  total,
  setPage,
  max_visible_pages = 8,
}: CustomPaginationProps) {
  // Calculate which page numbers to display
  const pageNumbers = useMemo(() => {
    // Si tenemos menos páginas que el máximo visible, mostrar todas las páginas
    if (total <= max_visible_pages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Siempre mostrar primera y última página
    const firstPage = 1;
    const lastPage = total;

    // Calcular cuántas páginas mostrar en total (excluyendo elipsis)
    // Queremos que el número total de elementos sea constante
    const maxPagesToShow = max_visible_pages - 2; // Restamos 2 para primera y última

    // Calcular el rango central
    let startPage: number;
    let endPage: number;

    if (page <= Math.ceil(maxPagesToShow / 2)) {
      // Cerca del inicio
      startPage = 2;
      endPage = maxPagesToShow;

      // Ajustar si endPage excede el total
      if (endPage >= lastPage) {
        endPage = lastPage - 1;
      }
    } else if (page >= total - Math.floor(maxPagesToShow / 2)) {
      // Cerca del final
      endPage = lastPage - 1;
      startPage = endPage - maxPagesToShow + 2;

      // Ajustar si startPage es menor que 2
      if (startPage < 2) {
        startPage = 2;
      }
    } else {
      // En medio
      const offset = Math.floor((maxPagesToShow - 1) / 2);
      startPage = page - offset;
      endPage = page + offset;

      // Asegurar que no excedemos los límites
      if (startPage < 2) {
        startPage = 2;
        endPage = startPage + maxPagesToShow - 2;
      }

      if (endPage >= lastPage) {
        endPage = lastPage - 1;
        startPage = endPage - maxPagesToShow + 2;
      }
    }

    // Construir el array de números de página con elipsis
    const pages: (number | string)[] = [firstPage];

    // Añadir elipsis inicial si es necesario
    if (startPage > 2) {
      pages.push("start-ellipsis");
    }

    // Añadir páginas intermedias
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Añadir elipsis final si es necesario
    if (endPage < lastPage - 1) {
      pages.push("end-ellipsis");
    }

    // Añadir última página si no está ya incluida
    if (lastPage !== firstPage) {
      pages.push(lastPage);
    }

    return pages;
  }, [page, total, max_visible_pages]);

  return (
    <Pagination className="mt-auto">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            size="sm"
            className="gap-1 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline-flex">Anterior</span>
          </Button>
        </PaginationItem>

        {pageNumbers.map((pageNumber, index) => (
          <PaginationItem key={`${pageNumber}-${index}`}>
            {pageNumber === "start-ellipsis" ||
            pageNumber === "end-ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <Button
                variant={page === pageNumber ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "h-9 w-9",
                  page !== pageNumber && "cursor-pointer"
                )}
                onClick={() =>
                  typeof pageNumber === "number" && setPage(pageNumber)
                }
              >
                {pageNumber}
              </Button>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            variant="ghost"
            onClick={() => setPage(Math.min(total, page + 1))}
            disabled={page === total}
            size="sm"
            className="gap-1 cursor-pointer"
          >
            <span className="hidden sm:inline-flex">Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
