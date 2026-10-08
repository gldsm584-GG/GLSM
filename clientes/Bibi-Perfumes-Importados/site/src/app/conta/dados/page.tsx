"use client";

import type { User } from "@supabase/supabase-js";
import { useState, type FormEvent } from "react";
import PasswordInput from "@/components/PasswordInput";
import ProfileFields, { inputClass } from "@/components/ProfileFields";
import { useAuth } from "@/lib/auth-context";
import { fullName, onlyDigits, profileFromMeta, type Profile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";

type Message = { type: "ok" | "erro"; text: string } | null;

function Feedback({ message }: { message: Message }) {
  if (!message) return null;
  return (
    <p className={`text-sm ${message.type === "ok" ? "text-green-600" : "text-red-500"}`}>
      {message.text}
    </p>
  );
}

const buttonClass =
  "w-fit rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60";

function DadosForms({ user }: { user: User }) {
  const [profile, setProfile] = useState<Profile>(() => profileFromMeta(user.user_metadata));
  const [savingData, setSavingData] = useState(false);
  const [dataMessage, setDataMessage] = useState<Message>(null);

  const [password, setPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message>(null);

  const handleSaveData = async (event: FormEvent) => {
    event.preventDefault();
    setDataMessage(null);
    if (onlyDigits(profile.cep).length !== 8) {
      setDataMessage({ type: "erro", text: "Confere o CEP: são 8 números." });
      return;
    }
    setSavingData(true);
    const clean = { ...profile, nome: profile.nome.trim(), sobrenome: profile.sobrenome.trim() };
    const { error } = await supabase.auth.updateUser({
      data: { ...clean, full_name: fullName(clean) },
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
      setPasswordMessage({
        type: "erro",
        text: error.message.toLowerCase().includes("different")
          ? "A nova senha precisa ser diferente da atual."
          : "Não deu pra trocar a senha. Tenta de novo.",
      });
      return;
    }
    setPassword("");
    setPasswordMessage({ type: "ok", text: "Senha alterada." });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl font-bold text-brand-dark">Meus dados</h1>

      <form onSubmit={handleSaveData} className="flex flex-col gap-5">
        <ProfileFields profile={profile} setProfile={setProfile} />
        <div className="flex flex-col gap-1 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <label htmlFor="d-email" className="text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="d-email"
            value={user.email ?? ""}
            disabled
            className={`${inputClass} bg-neutral-50 text-neutral-500`}
          />
          <p className="text-xs text-neutral-400">O email é o seu login e não pode ser alterado aqui.</p>
        </div>
        <Feedback message={dataMessage} />
        <button type="submit" disabled={savingData} className={buttonClass}>
          {savingData ? "Salvando..." : "Salvar meus dados"}
        </button>
      </form>

      <form
        onSubmit={handleSavePassword}
        className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
      >
        <h2 className="text-sm font-bold uppercase tracking-wide text-brand">Alterar senha</h2>
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
        <button type="submit" disabled={savingPassword} className={buttonClass}>
          {savingPassword ? "Salvando..." : "Alterar senha"}
        </button>
      </form>
    </div>
  );
}

export default function DadosPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <DadosForms key={user.id} user={user} />;
}
