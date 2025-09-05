import { ImageCarousel } from "@/components/publicaciones/image-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { PublicacionDetail } from "@/types/public";
import { Download, FileText } from "lucide-react";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const res = await api.get(`/publicaciones/${id}`);
  const publicacion: PublicacionDetail = res.data;
  const sortedArchivos = [...publicacion.archivos].sort(
    (a, b) => a.orden - b.orden
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="overflow-hidden w-full flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2 font-medium">
              {publicacion.titulo}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{publicacion.fecha.replaceAll("-", "/")}</span>
              <span className="">•</span>
              <Badge>{publicacion.area}</Badge>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[40dvh]">
          <Image
            src={publicacion.portada || "/placeholder.svg"}
            alt={publicacion.titulo}
            sizes="(min-width: 640px) 640px, 100vw"
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-8">
          {/* Contenido */}
          <div>
            <div
              className="prose max-w-none tiptap"
              dangerouslySetInnerHTML={{ __html: publicacion.contenido }}
            />
          </div>

          {/* Imágenes */}
          {publicacion.imagenes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Imágenes</h3>
              <ImageCarousel imagenes={publicacion.imagenes} />
            </div>
          )}

          {/* Archivos */}
          {sortedArchivos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Archivos</h3>
              <div className="space-y-4">
                {sortedArchivos.map((archivo) => (
                  <div
                    key={archivo.id}
                    className="flex items-start p-4 border rounded-lg"
                  >
                    <div className="bg-primary/10 p-2 rounded-lg mr-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{archivo.nombre}</h4>
                      <p className="text-sm text-muted-foreground">
                        {archivo.descripcion}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={archivo.archivo}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
