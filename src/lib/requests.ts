"use client";
import axios, { HttpStatusCode } from "axios";
const backendURL = "http://localhost:3001";

export async function login_request(values: { email: string; senha: string }) {
  const result = await axios.post(`${backendURL}/auth/login`, values);
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
