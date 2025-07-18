"use client";
import {
  list_all_users_request,
  add_user_request,
  give_admin_request,
  mock_reset_server_request,
  remove_user_request,
  USR_info,
} from "@/lib/requests";
import { is_token_expired } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import Image from "next/image";

export default function AdminPage() {
  const [loading, set_loading] = useState<boolean>(true);
  const [users, set_users] = useState<USR_info[]>([]);
  const [err, set_err] = useState<null | string>(null);
  const router = useRouter();

  function remove_user(email: string) {
    remove_user_request(email)
      .then(() => {
        list_all_users_request()
          .then((users) => {
            set_users(users);
          })
          .catch(() => {
            set_err("Erro ao carregar usuários.");
          });
      })
      .catch(() => {
        set_loading(false);
        set_err("Erro ao remover usuário");
      });
  }

  function add_user(values: { email: string; senha: string }) {
    if (!values.email || !values.senha) {
      set_err("valores inseridos são inválidos.");
      return;
    }
    const req_vals = { admin: false, ...values };
    add_user_request(req_vals)
      .then(() => {
        list_all_users_request()
          .then((users) => {
            set_users(users);
          })
          .catch(() => {
            set_err("Erro ao carregar usuários.");
          });
      })
      .catch(() => {
        set_loading(false);
        set_err("Erro ao adicionar usuário.");
      });
  }

  function toggle_admin(user: USR_info) {
    give_admin_request(user.email, !user.admin)
      .then(() => {
        set_loading(false);
        set_users(
          users.map((usr) => {
            if (usr.email === user.email) {
              usr.admin = !user.admin;
            }
            return usr;
          }),
        );
      })
      .catch((exp) => {
        set_loading(false);
        console.log(exp);
        set_err("Erro ao dar admin");
      });
  }

  function reset_server_data() {
    mock_reset_server_request()
      .then(() => {
        set_loading(false);
        router.push("/dashboard");
      })
      .catch(() => {
        set_loading(false);
        set_err("Erro ao reiniciar servidor");
      });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    let admin = false;
    if (localStorage.getItem("admin") === "true") {
      admin = true;
    }

    if (!token || is_token_expired(token)) {
      router.push("/login");
    }

    if (!admin) {
      router.push("/dashboard");
    }

    set_loading(true);

    list_all_users_request()
      .then((users) => {
        set_users(users);
        set_loading(false);
      })
      .catch(() => {
        set_err("Erro ao carregar usuários");
      });
  }, [set_loading, set_err, router, set_users]);

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
    <div className="flex flex-col min-h-screen w-full">
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
      <div className="flex flex-col justify-center min-w-fit w-1/2 gap-4 self-center mt-20">
        <h1 className="text-2xl font-bold">Página de administrador:</h1>
        <div className="border border-blue-500 rounded-lg p-2">
          <p className="font-bold text-lg mb-2">adicionar usuario:</p>
          <Formik initialValues={{ email: "", senha: "" }} onSubmit={add_user}>
            <Form className="flex justify-between">
              <Field
                type="text"
                name="email"
                placeholder="Email"
                className="rounded-lg p-1 bg-gray-300 w-64"
              />
              <Field
                type="password"
                name="senha"
                placeholder="Senha"
                className="rounded-lg p-1 bg-gray-300 w-64"
              />
              <button
                type="submit"
                className="self-end p-1 bg-blue-500 rounded-lg text-white hover:bg-blue-300"
              >
                Adicionar
              </button>
            </Form>
          </Formik>
        </div>
        <div className="border border-blue-500 rounded-lg p-2">
          <p className="font-bold text-lg mb-2">gerenciar usuários:</p>
          <div className="flex flex-col gap-2">
            {users.map((user) => {
              return (
                <div
                  key={user.email}
                  className="flex gap-10 p-2 bg-blue-100 rounded-lg justify-between"
                >
                  <div className="flex gap-10">
                    <div className="flex gap-2 min-w-60">
                      <p className="font-bold">email:</p>
                      <p>{user.email}</p>
                    </div>
                    <div className="flex gap-2 min-w-52">
                      <p className="font-bold">senha:</p>
                      <p>{user.senha}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="font-bold">é admin:</p>
                      <p>{user.admin ? "sim" : "não"}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="bg-blue-400 px-1 py-0.5 rounded hover:bg-blue-500"
                      onClick={() => {
                        toggle_admin(user);
                      }}
                    >
                      {user.admin ? "tirar admin" : "dar admin"}
                    </button>
                    <button
                      className="bg-red-400 py-0.5 px-1 rounded self-end hover:bg-red-500"
                      onClick={() => remove_user(user.email)}
                    >
                      remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border border-blue-500 rounded-lg p-2">
          <p className="font-bold text-lg mb-2">ações:</p>
          <div className="flex justify-between gap-4">
            <button
              className="bg-red-400 p-2 rounded font-bold hover:bg-red-500 h-fit"
              onClick={reset_server_data}
            >
              RESETAR DADOS DO SERVIDOR
            </button>
            <p className="font-mono text-gray-400 w-96 text-wrap">
              Essa ação apaga todos os dados referentes aos hospitais e aos
              laudos. Pode ser útil caso a memória do servidor esteja cheia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
