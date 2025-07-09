"use client";
import { mock_list_all_users } from "@/lib/requests";
import { is_token_expired } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [loading, set_loading] = useState<boolean>(true);
  const [err, set_err] = useState<null | string>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    let admin = false;
    if (localStorage.getItem("admin") === "true") {
      admin = true;
    }

    if (!token || is_token_expired(token)) {
      router.push("/login");
    }

    if (!admin) {
      router.push("/dashboard");
    }

    set_loading(true);

    mock_list_all_users()
      .then(() => {
        set_loading(false);
      })
      .catch(() => {
        set_err("Erro ao carregar usuários");
      });
  }, [set_loading, set_err, router]);

  if (err != null) {
    return (
      <div className="flex flex-col justify-center min-h-screen">
        <div className="flex justify-center">
          <h1 className="h-fit w-fit p-6 text-3xl bg-blue-400 rounded-2xl">
            {err} Tente atualizar a página
          </h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center min-h-screen">
        <div className="flex justify-center">
          <h1 className="h-fit w-fit p-6 text-3xl bg-blue-400 rounded-2xl">
            carregando...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen">
      <div className="flex flex-col justify-center">
        <div>adicionar usuario</div>
        <div>lista de usuarios</div>
        <div>resetar dados do programa</div>
      </div>
    </div>
  );
}
