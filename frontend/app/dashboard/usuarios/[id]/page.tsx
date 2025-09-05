"use client";

import UsuarioEditForm from "@/components/users/user-edit-form";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/axios";
import type { Usuario } from "@/types/usuarios";

export default function UsuarioEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: usuario } = useSWR<Usuario>(
    params.id !== "nuevo" ? `/usuario/${params.id}` : null,
    fetcher
  );

  return (
    <div className="h-screen bg-background">
      <UsuarioEditForm
        usuario={params.id !== "nuevo" ? usuario : undefined}
        onSuccess={() => router.push("/dashboard/usuarios")}
        onCancel={() => router.push("/dashboard/usuarios")}
      />
    </div>
  );
}