"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { get_hospitals_request, HP_info } from "@/lib/requests";
import { is_token_expired } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [hp_data, set_hp_data] = useState<HP_info[]>([]);
  const [loading, set_loading] = useState<boolean>(true);
  const [err, set_err] = useState<null | string>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || is_token_expired(token)) {
      router.push("/login");
    }

    set_loading(true);
    get_hospitals_request()
      .then((data) => {
        set_hp_data(data);
        set_loading(false);
        set_err(null);
      })
      .catch((err) => {
        if (err instanceof Error) {
          set_err(`Erro ao carregar os dados dos hospitais: ${err.message}.`);
          set_loading(false);
        }
      });
  }, [router, set_hp_data, set_loading, set_err]);

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
    <div className="min-h-screen">
      <header className="h-20 bg-blue-500 flex justify-between">
        <div>logo</div>
        <div>gerente</div>
      </header>
      <div className="flex flex-col p-10 gap-8">
        <h1 className="text-4xl font-bold">Hospitais:</h1>
        <div className="flex flex-wrap gap-4">
          <button className="h-60 aspect-square border shadow-xl/20 border-blue-500 rounded-lg p-3 text-9xl font-bold">
            +
          </button>
          {hp_data.map(make_hospital_card)}
        </div>
      </div>
    </div>
  );
}

function make_hospital_card(info: HP_info) {
  return (
    <Link
      href={`/hospital/${info.cnes}`}
      key={info.cnes}
      className="h-60 aspect-square flex flex-col gap-2 border shadow-xl/20 border-blue-500 rounded-lg p-3"
    >
      <h2 className="text-lg overflow-y-scroll font-bold max-h-16">
        {info.name}
      </h2>
      <p className="overflow-ellipsis">cnes: {info.cnes}</p>
      <p className="overflow-ellipsis">estado: {info.estado}</p>
    </Link>
  );
}
