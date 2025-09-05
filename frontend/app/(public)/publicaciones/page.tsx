"use client";
import CustomPagination from "@/components/custom-pagination";
import PublicacionCard from "@/components/publicaciones/publicacion-card";
import { fetcher } from "@/lib/axios";
import { ApiResponse } from "@/types/public";
import { useMemo, useState } from "react";
import useSWR from "swr";

export default function Page() {
  const limit = 30;
  const [offset, setOffset] = useState(0);
  const { data } = useSWR<ApiResponse>(
    `/publicaciones/?offset=${offset}&limit=${limit}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / limit) : 0;
  }, [data?.count, limit]);
  return (
    <div className="container mx-auto flex flex-col gap-6 py-10 flex-1 min-h-[90dvh]">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto">
        {data &&
          data.results.map((publicacion) => (
            <PublicacionCard key={publicacion.id} publicacion={publicacion} />
          ))}
      </div>
      <div className="mt-auto">
        {data && data?.count > 0 && (
          <CustomPagination
            total={pages}
            page={Math.floor(offset / limit) + 1}
            setPage={(page) => setOffset((page - 1) * limit)}
          />
        )}
      </div>
    </div>
  );
}
