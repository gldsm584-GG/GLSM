"use client";

import { useState, type FormEvent } from "react";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/lib/auth-context";
import { formatPhone, isValidPhone } from "@/lib/profile";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 outline-none focus:border-brand";

type Message = { type: "ok" | "erro"; text: string } | null;

function Feedback({ message }: { message: Message }) {
  if (!message) return null;
  return (
    <p className={`text-sm ${message.type === "ok" ? "text-green-600" : "text-red-500"}`}>
      {message.text}
    </p>
  );
}

export default function DadosPage() {
  const { user } = useAuth();
  const meta = user?.user_metadata ?? {};

  const [nome, setNome] = useState<string>(meta.nome ?? "");
  const [sobrenome, setSobrenome] = useState<string>(meta.sobrenome ?? "");
  const [telefone, setTelefone] = useState<string>(meta.telefone ?? "");
  const [telefone2, setTelefone2] = useState<string>(meta.telefone2 ?? "");
  const [savingData, setSavingData] = useState(false);
  const [dataMessage, setDataMessage] = useState<Message>(null);

  const [password, setPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message>(null);

  const handleSaveData = async (event: FormEvent) => {
    event.preventDefault();
    setDataMessage(null);
    if (!isValidPhone(telefone)) {
      setDataMessage({ type: "erro", text: "Confere o celular: use DDD + número." });
      return;
    }
    if (telefone2 && !isValidPhone(telefone2)) {
      setDataMessage({ type: "erro", text: "Confere o segundo número: use DDD + número." });
      return;
    }
    setSavingData(true);
    const { error } = await supabase.auth.updateUser({
      data: { nome, sobrenome, telefone, telefone2, full_name: `${nome} ${sobrenome}`.trim() },
    });
    setSavingData(false);
    setDataMessage(
      error
        ? { type: "erro", text: "Não deu pra salvar. Tenta de novo." }
        : { type: "ok", text: "Dados atualizados." }
    );
  };

  const handleSavePassword = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordMessage(null);
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      setPasswordMessage({ type: "erro", text: error.message });
      return;
    }
    setPassword("");
    setPasswordMessage({ type: "ok", text: "Senha alterada." });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-800">Meus dados</h1>

      <form
        onSubmit={handleSaveData}
        className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
      >
        <h2 className="font-bold text-neutral-800">Dados pessoais</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="d-nome" className="text-sm font-medium text-neutral-700">
              Nome
            </label>
            <input
              id="d-nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="d-sobrenome" className="text-sm font-medium text-neutral-700">
              Sobrenome
            </label>
            <input
              id="d-sobrenome"
              required
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="d-tel" className="text-sm font-medium text-neutral-700">
              Celular / WhatsApp
            </label>
            <input
              id="d-tel"
              type="tel"
              required
              inputMode="numeric"
              placeholder="(61) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(formatPhone(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="d-tel2" className="text-sm font-medium text-neutral-700">
              Segundo número <span className="font-normal text-neutral-400">(opcional)</span>
            </label>
            <input
              id="d-tel2"
              type="tel"
              inputMode="numeric"
              placeholder="(61) 3333-4444"
              value={telefone2}
              onChange={(e) => setTelefone2(formatPhone(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="d-email" className="text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              id="d-email"
              value={user?.email ?? ""}
              disabled
              className={`${inputClass} bg-neutral-50 text-neutral-500`}
            />
            <p className="text-xs text-neutral-400">O email é o seu login e não pode ser alterado aqui.</p>
          </div>
        </div>
        <Feedback message={dataMessage} />
        <button
          type="submit"
          disabled={savingData}
          className="w-fit rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {savingData ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <form
        onSubmit={handleSavePassword}
        className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
      >
        <h2 className="font-bold text-neutral-800">Alterar senha</h2>
        <div className="flex max-w-sm flex-col gap-1">
          <label htmlFor="nova-senha" className="text-sm font-medium text-neutral-700">
            Nova senha (mínimo 6 caracteres)
          </label>
          <PasswordInput
            id="nova-senha"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
        </div>
        <Feedback message={passwordMessage} />
        <button
          type="submit"
          disabled={savingPassword}
          className="w-fit rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {savingPassword ? "Salvando..." : "Alterar senha"}
        </button>
      </form>
    </div>
  );
}
