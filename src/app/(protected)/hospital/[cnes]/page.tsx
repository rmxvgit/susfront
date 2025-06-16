"use client";

import {
  HP_info,
  LD_info,
  mock_csv_download_url,
  pdf_download_url,
} from "@/lib/requests";

export default function HospitalPage() {
  return (
    <div className="min-h-screen">
      <header className="h-20 bg-blue-500 flex justify-between">
        <div>logo</div>
        <div>hospitais</div>
      </header>
      <div className="flex flex-col p-10 gap-8">
        <h1 className="xl:text-5xl lg:text-4xl md:3xl text-xl font-bold">
          Hospital: {mock_hp.name}
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex">
            <p className="text-2xl font-bold">CNES: </p>
            <p className="text-2xl">{mock_hp.cnes}</p>
          </div>
          <div className="flex">
            <p className="text-2xl font-bold">UF: </p>
            <p className="text-2xl">{mock_hp.estado}</p>
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
          {mock_laudos.map(make_laudo_card)}
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

const mock_hp: HP_info = {
  name: "nome",
  cnes: "221112",
  estado: "RS",
};

const mock_laudos: LD_info[] = [
  {
    id: 3,
    ready: true,
    data_fim: "15-07-2005",
    data_inicio: "13-11-27",
    file_name: "arquivo",
    estado: "RS",
  },
];
