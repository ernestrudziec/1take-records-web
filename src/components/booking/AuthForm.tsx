"use client";

import { CircleCheck, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  onAuthenticated: () => void;
};

function getRedirectUrl() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}/booking`;
}

export function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{
    title: string;
    description: string;
    kind: "success" | "info" | "error";
    afterClose?: "login" | "reload";
  } | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const redirectTo = getRedirectUrl();

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: {
              display_name: displayName.trim() || email.split("@")[0],
            },
          },
        });

        if (error) throw error;

        const needsConfirm = Boolean(data.user && !data.session);
        setModal({
          title: needsConfirm ? "Potwierdź e-mail" : "Konto utworzone",
          description: needsConfirm
            ? `Wysłaliśmy link na ${email}. Po kliknięciu wrócisz na tę samą domenę, na której się rejestrujesz.`
            : "Konto jest gotowe. Możesz od razu rezerwować studio.",
          kind: "success",
          afterClose: needsConfirm ? "login" : "reload",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setModal({
          title: "Zalogowano",
          description: "Witaj w systemie bookingu 1take.records.",
          kind: "success",
          afterClose: "reload",
        });
      }
    } catch (error) {
      setModal({
        title: mode === "login" ? "Nie udało się zalogować" : "Rejestracja nie powiodła się",
        description:
          error instanceof Error ? error.message : "Spróbuj ponownie za chwilę.",
        kind: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    const after = modal?.afterClose;
    setModal(null);
    if (after === "login") setMode("login");
    if (after === "reload") onAuthenticated();
  }

  return (
    <>
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          {mode === "login" ? "Logowanie" : "Rejestracja"}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Booking studia</h2>
        <p className="mt-3 text-sm text-zinc-500">
          Zaloguj się, żeby zobaczyć kalendarz i zarezerwować termin.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "register" && (
            <label className="block text-left">
              <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
                Imię / nick
              </span>
              <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-black px-4">
                <User className="h-4 w-4 text-zinc-500" strokeWidth={1.6} />
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-white outline-none"
                  placeholder="np. NATAN"
                />
              </span>
            </label>
          )}

          <label className="block text-left">
            <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
              Email
            </span>
            <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-black px-4">
              <Mail className="h-4 w-4 text-zinc-500" strokeWidth={1.6} />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent py-3 text-sm text-white outline-none"
                placeholder="twoj@email.com"
              />
            </span>
          </label>

          <label className="block text-left">
            <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
              Hasło
            </span>
            <span className="flex items-center gap-3 rounded-xl border border-white/10 bg-black px-4">
              <Lock className="h-4 w-4 text-zinc-500" strokeWidth={1.6} />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent py-3 text-sm text-white outline-none"
                placeholder="••••••••"
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
          >
            {loading
              ? "Proszę czekać..."
              : mode === "login"
                ? "Zaloguj się"
                : "Zarejestruj się"}
          </button>
        </form>

        <button
          type="button"
          onClick={() =>
            setMode((current) => (current === "login" ? "register" : "login"))
          }
          className="mt-6 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          {mode === "login"
            ? "Nie masz konta? Zarejestruj się"
            : "Masz konto? Zaloguj się"}
        </button>
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={closeModal}
        title={modal?.title ?? ""}
        description={modal?.description}
        icon={
          modal?.kind === "error" ? (
            <Mail className="h-5 w-5 text-red-300" strokeWidth={1.6} />
          ) : (
            <CircleCheck className="h-5 w-5 text-white" strokeWidth={1.6} />
          )
        }
      >
        <button
          type="button"
          onClick={closeModal}
          className="w-full rounded-xl bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-zinc-200"
        >
          OK
        </button>
      </Modal>
    </>
  );
}
