"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <header className="h-20 bg-blue-500 flex justify-between">
        <div>logo</div>
        <div>gerente</div>
      </header>
      <div className="flex flex-col p-10 gap-8">
        <h1 className="text-4xl font-bold">Hospitais:</h1>
        <div className="flex flex-wrap gap-4">
          {mock_hospitals.map((data: HP_info) => make_hospital_card(data))}
        </div>
      </div>
    </div>
  );
}

interface HP_info {
  name: string;
  cnes: string;
  estado: string;
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

const mock_hospitals: HP_info[] = [
  {
    name: "Santa casa uruguaiana",
    estado: "RS",
    cnes: "1234567",
  },
];
