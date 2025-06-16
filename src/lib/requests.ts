"use client";
import axios, { HttpStatusCode } from "axios";

const backendURL = "https://backsus-production.up.railway.app";

// USAR BARRA NO INÍCIO DA STRING
function get_back_url(page_relative_path: string): string {
  return `${backendURL}${page_relative_path}`;
}

export function pdf_download_url(id: string | number): string {
  return get_back_url(`/laudo/dowload${id}`);
}

export function csv_download_url(id: string | number): string {
  return get_back_url(`/laudo/getcsv${id}`);
}

export function mock_csv_download_url(id: string | number): string {
  return pdf_download_url(id);
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
  if (
    result.status === HttpStatusCode.Created &&
    typeof result.data == "string"
  ) {
    localStorage.setItem("token", result.data);
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

export async function get_single_hospital(cnes: string) {}

// informações referêntes a um laudo
export interface LD_info {
  id: number;
  ready: boolean;
  data_fim: string;
  data_inicio: string;
  file_name: string;
  estado: string;
}

export async function get_laudos(cnes: string) {}
