"use client";
import { Formik, Form, Field } from "formik";
import { login_request } from "@/lib/requests";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setTimeout } from "node:timers";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [formErr, setFormErr] = useState<string>("");

  function form_submit(values: LoginData) {
    login_request(values)
      .then(() => {
        router.push("/dashboard");
      })
      .catch((err) => {
        if (err instanceof Error) {
          if (err.message === "401") {
            setFormErr("credenciais inválidas");
          }

          setFormErr("erro ao fazer login: " + err.message);
        }

        setTimeout(() => {
          setFormErr("");
        }, 1500);
      });
  }

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <Formik onSubmit={form_submit} initialValues={{ email: "", senha: "" }}>
        <Form className="min-w-60 w-1/2 flex flex-col border border-blue-400 p-6 self-center rounded-2xl gap-6">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Image
              src={"/logo.svg"}
              alt="logo advogasus"
              height={69}
              width={291}
            ></Image>
          </div>
          <label id="login" className="text-2xl font-bold">
            Login:
          </label>
          <Field
            name="email"
            type="text"
            placeholder="nome"
            required
            className="bg-gray-300 rounded h-10 border border-blue-400 p-2"
          />
          <Field
            name="senha"
            type="password"
            placeholder="senha"
            required
            className="bg-gray-300 rounded h-10 border border-blue-400 p-2"
          />
          <p className="text-sm text-red-500">{formErr}</p>
          <button className="bg-blue-300 w-fit p-2 rounded">Enviar</button>
        </Form>
      </Formik>
    </div>
  );
}

interface LoginData {
  email: string;
  senha: string;
}
