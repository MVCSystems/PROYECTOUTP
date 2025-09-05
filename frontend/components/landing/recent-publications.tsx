import PublicacionCard from "@/components/publicaciones/publicacion-card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
// import { ApiResponse } from "@/types/public";
import Link from "next/link";

export default async function RecentPublications() {
  const res = await api.get("/publicaciones/?limit=4");
  // const data = res.data as ApiResponse;

  return (
    <section className="py-16 dark:bg-gray-900 bg-gray-100">
      <div className="container mx-auto flex flex-col gap-10">
        <h2 className="text-3xl font-bold text-center">
          Publicaciones Recientes
        </h2>
        {/* <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.results.map((publicacion) => (
            <PublicacionCard key={publicacion.id} publicacion={publicacion} />
          ))}
        </div> */}
        <div className="text-center">
          <Button asChild>
            <Link href="/publicaciones">Ver todas las publicaciones</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
