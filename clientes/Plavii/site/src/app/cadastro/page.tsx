import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function CadastroPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800">
        Criar conta
      </h1>
      <p className="mb-6 mt-1 text-neutral-500">
        Preencha seus dados pra agilizar suas compras e o envio dos pedidos.
      </p>
      <AuthForm mode="cadastro" />
      <p className="mt-4 text-sm text-neutral-500">
        Já tem conta?{" "}
        <Link href="/entrar" className="font-medium text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
