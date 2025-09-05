import { Card, CardContent } from "@/components/ui/card";
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
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Imagen } from "@/types/publicaciones";
import {
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Imagen[];
}

function ImagenesHandler({ publicacion_pk }: { publicacion_pk: number }) {
  const {
    data: imagenes,
    isLoading,
    mutate,
  } = useSWR<ApiResponse>(
    `/crud/publicaciones/${publicacion_pk}/imagenes/`,
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
          toast.error("La imagen debe pesar menos de 3MB");
          return;
        }
        formData.append("imagen", file);
        formData.append("descripcion", file.name);
        formData.append("orden", (imagenes?.results.length || 0).toString());

        api
          .post(`/crud/publicaciones/${publicacion_pk}/imagenes/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(() => {
            toast.success("Imagen subida", { id: notificacion });
            mutate();
          })
          .catch((err) => {
            const message = "Error al subir imagen";
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
    [publicacion_pk, imagenes?.results.length, mutate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
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
      const oldIndex = imagenes?.results.findIndex(
        (img) => img.id.toString() === active.id
      );
      const newIndex = imagenes?.results.findIndex(
        (img) => img.id.toString() === over?.id
      );

      if (oldIndex !== undefined && newIndex !== undefined) {
        const updatedImages = [...(imagenes?.results || [])];
        const [movedImage] = updatedImages.splice(oldIndex, 1);
        updatedImages.splice(newIndex, 0, movedImage);

        updatedImages.forEach((img, index) => {
          img.orden = index;
        });

        mutate(
          {
            count: imagenes?.count || 0,
            next: imagenes?.next || null,
            previous: imagenes?.previous || null,
            results: updatedImages,
          },
          false
        );

        updatedImages.forEach((img) => {
          api
            .patch(
              `/crud/publicaciones/${publicacion_pk}/imagenes/${img.id}/`,
              {
                orden: img.orden,
              }
            )
            .then(() => {})
            .catch((err) => {
              const message = "Error al subir imagen";
              const notificacion = toast.error(message);
              if (err.response?.status === 400) {
                const errors = err.response.data;
                for (const key in errors) {
                  toast.error(`${key}: ${errors[key]}`, { id: notificacion });
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
        <Label>Galeria de imagenes</Label>
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
                imagenes?.results.map((imagen) => imagen.id.toString()) || []
              }
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {imagenes?.results
                  ?.sort((a, b) => a.orden - b.orden)
                  .map((imagen) => (
                    <ImagenDnDItem
                      key={imagen.id}
                      imagen={imagen}
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
                        ? "Suelta la imagen aquí"
                        : "Arrastra y suelta una imagen de hasta 3MB o haz clic para seleccionar"}
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

function ImagenDnDItem({
  imagen,
  publicacion_pk,
  mutate,
}: {
  imagen: Imagen;
  publicacion_pk: number;
  mutate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: imagen.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleDelete = () => {
    const notificacion = toast.loading("Eliminando imagen...");
    api
      .delete(`/crud/publicaciones/${publicacion_pk}/imagenes/${imagen.id}/`)
      .then(() => {
        toast.success("Imagen eliminada", { id: notificacion });
        mutate();
      })
      .catch((err) => {
        const message = "Error al eliminar imagen";
        toast.error(message, { id: notificacion });
        if (err.response?.status === 400) {
          const errors = err.response.data;
          for (const key in errors) {
            toast.error(`${key}: ${errors[key]}`, { id: notificacion });
          }
        }
      });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group min-h-64"
    >
      <Image
        src={imagen.imagen || "/placeholder.svg"}
        alt={imagen.descripcion || "Imagen del edificio"}
        className="object-cover rounded-xl z-0"
        sizes="100%"
        fill
      />

      <div className="absolute top-2 right-2 flex gap-2 z-20 opacity-50 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-background rounded-md">
        <Button variant="destructive" className="" onClick={handleDelete}>
          <Trash2 size={16} />
        </Button>
      </div>
    </Card>
  );
}

export { ImagenDnDItem, ImagenesHandler };
