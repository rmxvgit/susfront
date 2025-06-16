"use client";

import {
  get_laudos,
  get_single_hospital,
  HP_info,
  LD_info,
  mock_csv_download_url,
  pdf_download_url,
} from "@/lib/requests";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function HospitalPage({
  params,
}: {
  params: Promise<{ cnes: string }>;
}) {
  const [err, set_err] = useState<string | null>(null);
  const [loading, set_loading] = useState<boolean>(true);
  const [laudos_data, set_laudos_data] = useState<LD_info[]>([]);
  const [hp_data, set_hp_data] = useState<HP_info>({
    cnes: "",
    name: "",
    estado: "",
  });
  const router = useRouter();

  useEffect(() => {
    params.then(({ cnes }) => {
      get_single_hospital(cnes)
        .then((hospital_data) => {
          set_hp_data(hospital_data);
          set_loading(false);
          set_err(null);
        })
        .catch((err) => {
          if (err.message == "403") {
            router.push("/login");
          }
          set_err(
            `Ocorreu um erro ao carregar as informações relativas ao hospital ${cnes}: ${err.message}`,
          );
          return;
        });

      get_laudos(cnes)
        .then((laudos) => {
          set_laudos_data(laudos);
        })
        .catch((err) => {
          set_err(
            `Erro ao carregar laudos relativas ao hospital ${cnes}: ${err.message} `,
          );
        });
    });
  }, [router, set_err, set_hp_data, set_loading, set_laudos_data, params]);

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

  params.then().catch();

  return (
    <div className="min-h-screen">
      <header className="h-20 bg-blue-500 flex justify-between p-3">
        <Image
          src="/logo.svg"
          alt="logo app"
          width={291}
          height={69}
          className="h-full aspect-square"
        />
        <button
          className="h-full aspect-square"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <Image
            src="/house.svg"
            alt="house icon"
            width={800}
            height={800}
            className="h-full"
          />
        </button>
      </header>
      <div className="flex flex-col p-10 gap-8">
        <h1 className="xl:text-5xl lg:text-4xl md:3xl text-xl font-bold">
          Hospital: {hp_data.name}
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex">
            <p className="text-2xl font-bold">CNES: </p>
            <p className="text-2xl">{hp_data.cnes}</p>
          </div>
          <div className="flex">
            <p className="text-2xl font-bold">UF: </p>
            <p className="text-2xl">{hp_data.estado}</p>
          </div>
        </div>
        <button className="w-fit bg-red-500 p-1 rounded-lg font-bold mb-8">
          remover hospital
        </button>
        <div className="border" />
        <div className="flex flex-wrap gap-4">
          <button className="h-60 aspect-square border shadow-xl/20 border-blue-500 rounded-lg p-3 text-9xl font-bold">
            +
          </button>
          {laudos_data.map(make_laudo_card)}
        </div>
      </div>
    </div>
  );
}

function make_laudo_card(laudo: LD_info) {
  return (
    <div
      key={laudo.id}
      className="h-60 aspect-square flex flex-col justify-between border shadow-xl/20 border-blue-500 rounded-lg p-3"
    >
      <div>
        <h2 className="text-lg overflow-y-scroll font-bold max-h-16">
          {laudo.file_name}
        </h2>
        <p className="overflow-ellipsis">registros de: {laudo.data_inicio}</p>
        <p className="overflow-ellipsis">registros até: {laudo.data_fim}</p>
        <div className="flex">
          <p>estado: </p>
          {laudo.ready ? (
            <p className="text-green-400">concluído</p>
          ) : (
            <p className="text-yellow-400">processando</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <a
            href={pdf_download_url(laudo.id)}
            className="bg-red-700 text-white p-1 rounded-lg font-bold"
          >
            PDF
          </a>
          <a
            href={mock_csv_download_url(laudo.id)}
            className="bg-green-500 text-white p-1 rounded-lg font-bold"
          >
            CSV
          </a>
        </div>
        <button className="w-fit p-1 rounded-lg aspect-square text-center">
          ❌
        </button>
      </div>
    </div>
  );
}
