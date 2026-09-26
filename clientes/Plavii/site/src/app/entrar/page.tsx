import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function EntrarPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-neutral-800">Entrar</h1>
      <AuthForm mode="entrar" />
      <p className="mt-4 text-sm text-neutral-500">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-brand hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
