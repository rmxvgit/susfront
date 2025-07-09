"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { get_hospitals_request, HP_info } from "@/lib/requests";
import { is_token_expired } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import { Modal } from "@/ui/modal";
import Image from "next/image";

export default function Dashboard() {
  const [hp_data, set_hp_data] = useState<HP_info[]>([]);
  const [loading, set_loading] = useState<boolean>(true);
  const [err, set_err] = useState<null | string>(null);
  const [modal, set_modal] = useState<boolean>(false);
  const [admin, set_admin] = useState<boolean>(false);
  const router = useRouter();

  function submit_new_hospital_form() {}

  useEffect(() => {
    const token = localStorage.getItem("token");

    const admin = localStorage.getItem("admin");
    if (admin === "true") {
      set_admin(true);
    } else {
      set_admin(false);
    }

    set_err(localStorage.getI);

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
  }, [router, set_hp_data, set_loading, set_err, set_admin]);

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
      <Modal state={modal}>
        <Formik
          onSubmit={submit_new_hospital_form}
          initialValues={{ name: "", cnes: "", estado: "" }}
        >
          <Form className="self-center w-1/2 min-w-80 bg-white flex flex-col p-4 gap-3 rounded-lg">
            <h2 className="text-3xl font-bold">Novo Hospital:</h2>
            <label htmlFor="name">Nome:</label>
            <Field
              name="name"
              className="bg-gray-300 border h-10 rounded-lg p-2"
              required
            />
            <label htmlFor="cnes">CNES:</label>
            <Field
              name="cnes"
              className="bg-gray-300 border h-10 rounded-lg p-2"
              required
            />
            <label htmlFor="estado">Estado:</label>
            <Field
              name="estado"
              className="bg-gray-300 border h-10 rounded-lg p-2 mb-4"
              required
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="p-3 rounded-lg font-bold bg-blue-400"
              >
                enviar
              </button>
              <button
                className="p-3 rounded-lg font-bold text-white bg-red-500"
                onClick={() => set_modal(false)}
              >
                cancelar
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>
      <header className="h-20 p-2 bg-blue-500 flex justify-between">
        <Image
          src="/logo.svg"
          alt="logo app"
          width={291}
          height={69}
          className="h-full aspect-square"
        />
        {admin ? (
          <Link href={"/admin"}>
            <Image
              src={"/admin.svg"}
              alt="vercel logo"
              width={80}
              height={80}
              className="h-full p-1"
            />
          </Link>
        ) : (
          <></>
        )}
      </header>
      <div className="flex flex-col p-10 gap-8">
        <h1 className="text-4xl font-bold">Hospitais:</h1>
        <div className="flex flex-wrap gap-4">
          <button
            className="h-60 aspect-square border shadow-xl/20 border-blue-500 rounded-lg p-3 text-9xl font-bold"
            onClick={() => set_modal(true)}
          >
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
