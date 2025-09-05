/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicacionListItem } from "@/types/public";
import Link from "next/link";

export default function PublicacionCard({
  publicacion,
}: {
  publicacion: PublicacionListItem;
}) {
  return (
    <Card>
      <div className="relative h-32 overflow-hidden rounded-lg mx-4 mt-4 flex justify-center items-center border">
        <img
          src={publicacion.portada}
          alt={publicacion.titulo}
          className="rounded-lg object-cover"
        />
      </div>
      <CardContent className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{publicacion.titulo}</h3>
        <div className="">
          <p className="text-muted-foreground">{publicacion.area}</p>
          <p className="text-muted-foreground">
            {new Date(publicacion.fecha).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/publicaciones/${publicacion.id}`}>Ver publicación</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
