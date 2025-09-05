"use client";

import {
  Building2,
  Calendar,
  Eye,
  EyeOff,
  Globe,
  GlobeLock,
  PenLine,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Publicacion } from "@/types/publicaciones";

import { api } from "@/lib/axios";
import Link from "next/link";
import { toast } from "sonner";
export default function PublicacionCrudItem({
  publicacion,
  formatDate,
  mutate,
}: {
  publicacion: Publicacion;
  formatDate: (dateString: string) => string;
  mutate: () => void;
}) {
  function toggleActive(): void {
    const id = toast.loading("Actualizando estado de la publicación...");
    api
      .put(`/crud/publicar/${publicacion.id}/`, {
        activo: !publicacion.activo,
      })
      .then(() => {
        toast.success("Estado de la publicación actualizado", { id });
        mutate();
      })
      .catch((err) => {
        const message = "Error al actualizar publicación";
        toast.error(message, { id });
        if (err.response?.status === 400) {
          const errors = err.response.data;
          for (const key in errors) {
            toast.error(`${key}: ${errors[key]}`, { id });
          }
        }
      });
  }

  function deletepublicacion(): void {
    const id = toast.loading("Eliminando publicación...");
    api
      .delete(`/crud/publicaciones/${publicacion.id}/`)
      .then(() => {
        toast.success("Publicación eliminada", { id });
        mutate();
      })
      .catch((err) => {
        const message = "Error al eliminar publicación";
        const notificacion = toast.error(message);
        if (err.response?.status === 400) {
          const errors = err.response.data;
          for (const key in errors) {
            toast.error(`${key}: ${errors[key]}`, { id: notificacion });
          }
        }
      });
  }

  return (
    <Card key={publicacion.id} className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <CardContent className="flex-1 ">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold">{publicacion.titulo}</h3>
                <div className="flex items-center gap-2">
                  {publicacion.activo ? (
                    <Badge variant="default" className="bg-blue-500">
                      <Globe className="h-4 w-4" />
                      Publicado
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <GlobeLock className="h-4 w-4"></GlobeLock>
                      Oculto
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Publicado: {formatDate(publicacion.fecha_publicacion)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>Area: {publicacion.grupo}</span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-2 mt-4 justify-end">
              <Button size="sm">
                <Link
                  href={`/panel/publicaciones/${publicacion.grupo.replaceAll(
                    " ",
                    "-"
                  )}/${publicacion.id}`}
                  className="flex items-center gap-1"
                >
                  <PenLine className="h-4 w-4 mr-1" />
                  Editar
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleActive}
                className="cursor-pointer"
              >
                {publicacion.activo ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Publicar
                  </>
                )}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar eliminación</DialogTitle>
                    <DialogDescription>
                      ¿Estás seguro de que deseas eliminar la publicación &quot;
                      {publicacion.titulo}&quot;? Esta acción no se puede
                      deshacer.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="destructive" onClick={deletepublicacion}>
                        Eliminar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
