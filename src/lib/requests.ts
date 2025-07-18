"use client";
import axios, { HttpStatusCode } from "axios";
import { validate_date } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const local_backend = "http://localhost:3005";

const remote_backend = "https://backsus-production.up.railway.app";

const backendURL = remote_backend;

// USAR BARRA NO INÍCIO DA STRING
function get_back_url(page_relative_path: string): string {
  return `${backendURL}${page_relative_path}`;
}

export function pdf_download_url(id: string | number): string {
  return get_back_url(`/laudo/dowload${id}`);
}

export function pa_csv_download_url(id: string | number): string {
  return get_back_url(`/laudo/download-csv-pa${id}`);
}

export function sp_csv_download_url(id: string | number): string {
  return get_back_url(`/laudo/download-csv-sp${id}`);
}

function bearer_token(): string {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("no token found");
  }

  return `Bearer ${token}`;
}

export async function login_request(values: { email: string; senha: string }) {
  const result = await axios.post(get_back_url("/auth/login"), values);
  console.log(result.data);

  if (
    result.status === HttpStatusCode.Created &&
    "user" in result.data &&
    "admin" in result.data
  ) {
    localStorage.setItem("token", result.data.user);
    localStorage.setItem("admin", result.data.admin ? "true" : "false");
    return;
  }

  throw new Error(`${result.status}`);
}

export async function mock_login_request(values: {
  email: string;
  senha: string;
}) {
  if (values.email == "a") {
    return Promise<null>;
  }

  throw new Error("err");
}

export interface HP_info {
  name: string;
  cnes: string;
  estado: string;
}

export async function get_hospitals_request() {
  const result = await axios.get(get_back_url("/hospital"), {
    headers: { Authorization: bearer_token() },
  });

  if (result.status != HttpStatusCode.Ok) {
    throw new Error(`${result.status}`);
  }

  const data: HP_info[] = result.data;

  return data;
}

export async function get_single_hospital(cnes: string) {
  const result = await axios.get(get_back_url(`/hospital/${cnes}`), {
    headers: { Authorization: bearer_token() },
  });

  if (result.status != HttpStatusCode.Ok) {
    throw new Error(`${result.status}`);
  }

  const data: HP_info = result.data;
  return data;
}

// informações referêntes a um laudo
export interface LD_info {
  id: number;
  ready: boolean;
  data_fim: string;
  data_inicio: string;
  file_name: string;
  estado: string;
}

export async function get_laudos(cnes: string) {
  const result = await axios.get(get_back_url(`/laudo/hospital${cnes}`), {
    headers: { Authorization: bearer_token() },
  });

  if (result.status != HttpStatusCode.Ok) {
    throw new Error(`${result.status}`);
  }

  const data: LD_info[] = result.data;
  return data;
}

export interface MK_LD_info {
  cnes: string;
  nome_fantasia: string;
  data_inicio: string;
  data_fim: string;
  cidade: string;
  numero_processo: string;
  data_distribuicao: string;
  data_citacao: string;
  data_fim_correcao: string;
  razao_social: string;
  cnpj: string;
  ivr_tunep: string;
}

export async function mock_make_laudo_request(info: MK_LD_info) {
  if (info.cidade == "a") {
    throw new Error("cidade errada");
  }

  return Promise<null>;
}

export async function make_laudo_request(info: MK_LD_info) {
  const data_inicio = validate_date(info.data_inicio);
  const data_fim = validate_date(info.data_fim);

  info.data_inicio = `${data_inicio?.m}-${data_inicio?.y}`;
  info.data_fim = `${data_fim?.m}-${data_fim?.y}`;
  info.data_citacao.replace("/", "-");
  info.data_fim_correcao.replace("/", "-");
  info.data_distribuicao.replace("/", "-");

  const result = await axios.post(get_back_url("/laudo/make"), info, {
    headers: { Authorization: bearer_token() },
  });

  if (result.status != HttpStatusCode.Created) {
    throw new Error(`${result.status}`);
  }

  return Promise<null>;
}

export interface USR_info {
  email: string;
  senha: string;
  admin: boolean;
}

export async function mock_list_all_users(): Promise<USR_info[]> {
  return Promise.resolve([
    { email: "John Doe", senha: "b", admin: true },
    { email: "Jane Doe", senha: "a", admin: false },
  ]);
}

export async function list_all_users_request(): Promise<USR_info[]> {
  const result = await axios.get(get_back_url("/auth/usuarios"), {
    headers: { Authorization: bearer_token() },
  });

  const data: USR_info[] = result.data;
  return data;
}

export async function delete_laudo_request(id: number) {
  await axios.delete(get_back_url(`/laudo/${id}`), {
    headers: { Authorization: bearer_token() },
  });
  return Promise<null>;
}

export async function remove_hospital_request(cnes: string) {
  await axios.delete(get_back_url(`/hospital/${cnes}`), {
    headers: { Authorization: bearer_token() },
  });
  return Promise<null>;
}

// TODO: escrever as funções abaixo
export async function mock_reset_server_request() {}

export async function remove_user_request(email: string) {
  await axios.delete(get_back_url(`/auth/usuarios/email/${email}`), {
    headers: { Authorization: bearer_token() },
  });
  return Promise<null>;
}

export async function add_user_request(info: USR_info) {
  await axios.post(get_back_url(`/auth/usuarios`), info, {
    headers: { Authorization: bearer_token() },
  });
  return Promise<null>;
}

export async function give_admin_request(email: string, admin: boolean) {
  await axios.post(
    get_back_url(`/auth/giveadmin${email}`),
    { admin: admin },
    { headers: { Authorization: bearer_token() } },
  );
  return Promise<null>;
}

export async function reset_server_request() {}

export async function add_hospital_request(data: {
  name: string;
  cnes: string;
  estado: string;
}) {
  await axios.post(get_back_url(`/hospital`), data, {
    headers: { Authorization: bearer_token() },
  });
  return Promise<null>;
}
