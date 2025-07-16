"use client";

import {
  get_laudos,
  delete_laudo_request,
  get_single_hospital,
  HP_info,
  LD_info,
  make_laudo_request,
  MK_LD_info,
  pdf_download_url,
  sp_csv_download_url,
  pa_csv_download_url,
  remove_hospital_request,
} from "@/lib/requests";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { Modal } from "@/ui/modal";
import { Formik, Form, Field } from "formik";
import { validate_date } from "@/lib/utils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function HospitalPage({
  params,
}: {
  params: Promise<{ cnes: string }>;
}) {
  const [err, set_err] = useState<string | null>(null);
  const [form_err, set_form_err] = useState<string | null>(null);
  const [loading, set_loading] = useState<boolean>(true);
  const [modal, set_modal] = useState<boolean>(false);
  const [laudos_data, set_laudos_data] = useState<LD_info[]>([]);
  const [hp_data, set_hp_data] = useState<HP_info>({
    cnes: "",
    name: "",
    estado: "",
  });
  const router = useRouter();

  function submit_new_laudo_request(data: {
    cidade: string;
    cnpj: string;
    numero_processo: string;
    ivr_tunep: string;
    razao_social: string;
    data_inicio: string;
    data_fim: string;
    data_fim_correcao: string;
    data_citacao: string;
    data_distribuicao: string;
  }) {
    const err = validate_new_laudo_data(data);
    if (err !== null) {
      set_form_err(err);
      setTimeout(() => {
        set_form_err(null);
      }, 3000);
      return;
    }

    const request_data: MK_LD_info = {
      ...data,
      cnes: hp_data.cnes,
      nome_fantasia: hp_data.name,
    };

    make_laudo_request(request_data)
      .then(() => {
        set_form_err(null);
        set_modal(false);
        router.refresh();
      })
      .catch(() => {
        set_err("Erro ao criar laudo");
      });
  }

  function remove_hospital() {
    remove_hospital_request(hp_data.cnes)
      .then(() => {
        set_loading(false);
        router.push("/dashboard");
      })
      .catch(() => {
        set_loading(false);
        set_err("Erro ao remover hospital");
      });

    set_loading(true);
  }

  useEffect(() => {
    console.log("batata");
    params.then(({ cnes }) => {
      get_single_hospital(cnes)
        .then((hospital_data) => {
          set_hp_data(hospital_data);
          set_loading(false);
          set_err(null);
        })
        .catch((err) => {
          if (err.status == "403") {
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
  }, [
    router,
    set_err,
    set_hp_data,
    set_loading,
    set_laudos_data,
    params,
    set_modal,
    set_form_err,
  ]);

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
      <Modal state={modal}>
        <Formik
          onSubmit={submit_new_laudo_request}
          initialValues={{
            cidade: "",
            cnpj: "",
            numero_processo: "",
            ivr_tunep: "IVR",
            razao_social: "",
            data_inicio: "",
            data_fim: "",
            data_fim_correcao: "",
            data_citacao: "",
            data_distribuicao: "",
          }}
        >
          <Form className="self-center min-w-80 w-fit bg-white flex flex-col p-4 gap-8 rounded-lg">
            <h2 className="text-3xl font-bold">Novo Laudo:</h2>
            <p className="text-red-500 font-bold">{form_err}</p>

            <div className="flex justify-between gap-8">
              <div className="flex flex-col">
                <label htmlFor="cidade">Cidade:</label>
                <Field
                  name="cidade"
                  className="bg-gray-300 rounded h-8 w-60 p-2"
                ></Field>
              </div>

              <div className="flex flex-col">
                <label htmlFor="cnpj">CNPJ:</label>
                <Field
                  name="cnpj"
                  className="bg-gray-300 rounded h-8 w-60 p-2"
                ></Field>
              </div>

              <div className="flex flex-col">
                <label htmlFor="numero_processo">Numero processo:</label>
                <Field
                  name="numero_processo"
                  className="bg-gray-300 rounded h-8 w-60 p-2"
                ></Field>
              </div>

              <div className="flex flex-col">
                <label htmlFor="ivr_tunep">IVR/TUNEP:</label>
                <Field
                  component="select"
                  name="ivr_tunep"
                  className="bg-gray-300 rounded h-8 p-2"
                >
                  <option value="IVR">IVR</option>
                  <option value="TUNEP">TUNEP</option>
                  <option value="Ambos">AMBOS</option>
                </Field>
              </div>
            </div>

            <div className="flex flex-col mb-3">
              <label htmlFor="razao_social">Razão social:</label>
              <Field
                name="razao_social"
                className="bg-gray-300 rounded h-8 p-2"
              />
            </div>

            <div className="flex justify-evenly gap-5">
              <div className="flex flex-col">
                <label htmlFor="data_inicio">Data de início:</label>
                <Field
                  name="data_inicio"
                  className="bg-gray-300 h-8 rounded p-2"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="data_fim">Data de fim:</label>
                <Field
                  name="data_fim"
                  className="bg-gray-300 h-8 rounded p-2"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="data_fim_correcao">
                  Data de fim de correção:
                </label>
                <Field
                  name="data_fim_correcao"
                  className="bg-gray-300 h-8 rounded p-2"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="data_citacao">Data de citação:</label>
                <Field
                  name="data_citacao"
                  className="bg-gray-300 h-8 rounded p-2"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="data_distribuicao">Data de distribuição:</label>
                <Field
                  name="data_distribuicao"
                  className="bg-gray-300 h-8 rounded p-2"
                />
              </div>
            </div>

            <div className="flex justify gap-8">
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
        <button
          className="w-fit bg-red-500 p-1 rounded-lg font-bold mb-8 hover:bg-red-300"
          onClick={remove_hospital}
        >
          remover hospital
        </button>
        <div className="border" />
        <div className="flex flex-wrap gap-4">
          <button
            className="h-60 aspect-square border shadow-xl/20 border-blue-500 rounded-lg p-3 text-9xl font-bold"
            onClick={() => set_modal(true)}
          >
            +
          </button>
          {laudos_data.map((laudo) => make_laudo_card(laudo, router, set_err))}
        </div>
      </div>
    </div>
  );
}

function make_laudo_card(
  laudo: LD_info,
  router: AppRouterInstance,
  set_err: Dispatch<SetStateAction<string | null>>,
) {
  function delete_laudo(id: number) {
    delete_laudo_request(id)
      .then(() => {
        router.refresh();
      })
      .catch(() => {
        set_err("Erro ao deletar laudo");
      });
  }

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
            className="bg-red-700 text-white p-1 rounded-lg font-bold hover:bg-red-500"
          >
            PDF
          </a>
          <a
            href={pa_csv_download_url(laudo.id)}
            className="bg-green-500 text-white p-1 rounded-lg font-bold hover:bg-green-600"
          >
            CSV PA
          </a>
          <a
            href={sp_csv_download_url(laudo.id)}
            className="bg-green-500 text-white p-1 rounded-lg font-bold hover:bg-green-600"
          >
            CSV SP
          </a>
        </div>
        <button
          className="w-fit p-1 rounded-lg aspect-square text-center hover:bg-gray-400"
          onClick={() => {
            delete_laudo(laudo.id);
          }}
        >
          ❌
        </button>
      </div>
    </div>
  );
}

function validate_new_laudo_data(data: {
  cidade: string;
  cnpj: string;
  numero_processo: string;
  ivr_tunep: string;
  razao_social: string;
  data_inicio: string;
  data_fim: string;
  data_fim_correcao: string;
  data_citacao: string;
  data_distribuicao: string;
}): string | null {
  if (!data.cidade.trim()) {
    return "O campo Cidade é obrigatório";
  }
  if (!data.cnpj.trim()) {
    return "O campo CNPJ é obrigatório";
  }
  if (!data.numero_processo.trim()) {
    return "O campo Número do processo é obrigatório";
  }
  if (!data.razao_social.trim()) {
    return "O campo Razão social é obrigatório";
  }

  const data_inicio_parsed = validate_date(data.data_inicio);
  if (!data_inicio_parsed) {
    return "Data de início inválida";
  }

  const data_fim_parsed = validate_date(data.data_fim);
  if (!data_fim_parsed) {
    return "Data de fim inválida";
  }

  const data_fim_correcao_parsed = validate_date(data.data_fim_correcao);
  if (!data_fim_correcao_parsed) {
    return "Data de fim de correção inválida";
  }

  if (validate_date(data.data_citacao) === null) {
    return "Data de citação inválida";
  }
  if (validate_date(data.data_distribuicao) === null) {
    return "Data de distribuição inválida";
  }

  const data_inicio = new Date(
    data_inicio_parsed.y,
    data_inicio_parsed.m - 1,
    data_inicio_parsed.d,
  );
  const data_fim = new Date(
    data_fim_parsed.y,
    data_fim_parsed.m - 1,
    data_fim_parsed.d,
  );

  if (data_inicio >= data_fim) {
    return "A data de início deve ser anterior à data de fim";
  }

  const data_fim_correcao = new Date(
    data_fim_correcao_parsed.y,
    data_fim_correcao_parsed.m - 1,
    data_fim_correcao_parsed.d,
  );
  const hoje = new Date();
  const umMesAtras = new Date(
    hoje.getFullYear(),
    hoje.getMonth() - 1,
    hoje.getDate(),
  );

  if (data_fim_correcao > umMesAtras) {
    return "A data de fim de correção deve ter pelo menos um mês.";
  }

  return null;
}
