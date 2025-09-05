import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api, fetcher } from "@/lib/axios";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Archivo } from "@/types/publicaciones";
import {
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { File, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Archivo[];
}

function ArchivosHandler({ publicacion_pk }: { publicacion_pk: number }) {
  const {
    data: archivos,
    isLoading,
    mutate,
  } = useSWR<ApiResponse>(
    `/crud/publicaciones/${publicacion_pk}/archivos/`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const notificacion = toast.loading("Actualizando imágenes...");
      acceptedFiles.forEach((file) => {
        const formData = new FormData();
        if (file.size > 3 * 1024 * 1024) {
          toast.error("El archivo debe pesar menos de 3MB");
          return;
        }
        formData.append("archivo", file);
        formData.append("descripcion", file.name);
        formData.append("nombre", file.name);
        formData.append("orden", (archivos?.results.length || 0).toString());

        api
          .post(`/crud/publicaciones/${publicacion_pk}/archivos/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(() => {
            toast.success("archivo subido", { id: notificacion });
            mutate();
          })
          .catch((err) => {
            const message = "Error al subir archivo";
            toast.error(message, { id: notificacion });
            if (err.response?.status === 400) {
              const errors = err.response.data;
              for (const key in errors) {
                toast.error(`${key}: ${errors[key]}`, { id: notificacion });
              }
            }
          });
      });
    },
    [publicacion_pk, archivos?.results.length, mutate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    })
  );

  const HandleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("active:", active);
    console.log("over:", over);

    if (active.id !== over?.id) {
      const oldIndex = archivos?.results.findIndex(
        (img) => img.id.toString() === active.id
      );
      const newIndex = archivos?.results.findIndex(
        (img) => img.id.toString() === over?.id
      );

      if (oldIndex !== undefined && newIndex !== undefined) {
        const updatedImages = [...(archivos?.results || [])];
        const [movedImage] = updatedImages.splice(oldIndex, 1);
        updatedImages.splice(newIndex, 0, movedImage);

        updatedImages.forEach((img, index) => {
          img.orden = index;
        });

        mutate(
          {
            count: archivos?.count || 0,
            next: archivos?.next || null,
            previous: archivos?.previous || null,
            results: updatedImages,
          },
          false
        );

        updatedImages.forEach((img) => {
          api
            .patch(
              `/crud/publicaciones/${publicacion_pk}/archivos/${img.id}/`,
              {
                orden: img.orden,
              }
            )
            .then(() => {})
            .catch((err) => {
              const message = "Error al actualizar archivo";
              const id = toast.error(message);
              if (err.response?.status === 400) {
                const errors = err.response.data;
                for (const key in errors) {
                  toast.error(`${key}: ${errors[key]}`, { id });
                }
              }
            });
        });
      }
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <Label>Archivos</Label>
        {isLoading ? (
          <div className="w-14 h-14 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={HandleDragEnd}
          >
            <SortableContext
              items={
                archivos?.results.map((archivo) => archivo.id.toString()) || []
              }
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {archivos?.results
                  ?.sort((a, b) => a.orden - b.orden)
                  .map((archivo) => (
                    <ArchivoDnDItem
                      key={archivo.id}
                      archivo={archivo}
                      mutate={mutate}
                      publicacion_pk={publicacion_pk}
                    />
                  ))}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl h-64 flex items-center justify-center cursor-pointer transition-colors p-6 ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-gray-300 hover:border-primary/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="text-center text-gray-500">
                    <Plus className="mx-auto mb-2" />
                    <p>
                      {isDragActive
                        ? "Suelta el archivo aquí"
                        : "Arrastra y suelta un archivo de hasta 3MB o haz clic para seleccionar"}
                    </p>
                  </div>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}

function ArchivoDnDItem({
  archivo,
  publicacion_pk,
  mutate,
}: {
  archivo: Archivo;
  publicacion_pk: number;
  mutate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: archivo.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleDelete = () => {
    const notificacion = toast.loading("Eliminando archivo...");
    api
      .delete(`/crud/publicaciones/${publicacion_pk}/archivos/${archivo.id}/`)
      .then(() => {
        toast.success("archivo eliminada", { id: notificacion });
        mutate();
      })
      .catch((err) => {
        const message = "Error al actualizar archivo";
        toast.error(message, { id: notificacion });
        if (err.response?.status === 400) {
          const errors = err.response.data;
          for (const key in errors) {
            toast.error(`${key}: ${errors[key]}`, { id: notificacion });
          }
        }
      });
  };

  const [nombre, setNombre] = useState(archivo.nombre);
  useEffect(() => {
    const initialNombre = archivo.nombre;
    if (nombre !== initialNombre) {
      const timer = setTimeout(() => {
        const id = toast.loading("Actualizando archivo...");
        api
          .patch(
            `/crud/publicaciones/${publicacion_pk}/archivos/${archivo.id}/`,
            {
              nombre,
            }
          )
          .then(() => {
            toast.success("Nombre de archivo actualizado", { id });
          })
          .catch((err) => {
            const message = "Error al actualizar archivo";
            toast.error(message, { id });
            if (err.response?.status === 400) {
              const errors = err.response.data;
              for (const key in errors) {
                toast.error(`${key}: ${errors[key]}`, { id });
              }
            }
          });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [nombre, archivo.nombre, archivo.id, publicacion_pk]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group flex min-h-64"
    >
      <CardContent className="h-3/4">
        <div className="border-2 h-full rounded-xl flex flex-col items-center justify-center">
          <File size={40} strokeWidth={1}></File>
          <Link
            target="_blank"
            href={archivo.archivo}
            className="cursor-pointer underline-offset-4 hover:underline"
          >
            Descargar Archivo
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Input
          placeholder="descripcion"
          aria-label="descripcion"
          defaultValue={archivo.descripcion}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => setNombre(e.target.value)}
        ></Input>
      </CardFooter>
      <div className="absolute top-2 right-2 flex gap-2 z-20 opacity-50 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-background rounded-md">
        <Button variant="destructive" className="" onClick={handleDelete}>
          <Trash2 size={16} />
        </Button>
      </div>
    </Card>
  );
}

export { ArchivoDnDItem, ArchivosHandler };
