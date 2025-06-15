"use client";
import { is_token_expired } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || is_token_expired(token)) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  }, [router]);

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
