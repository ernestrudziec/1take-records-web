"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  onAuthenticated: () => void;
};

export function AuthForm({ onAuthenticated }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName.trim() || email.split("@")[0],
            },
          },
        });

        if (error) throw error;
        setMessage("Konto utworzone. Możesz się zalogować.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onAuthenticated();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Wystąpił błąd logowania",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md border border-white/10 bg-zinc-950 p-8">
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
        {mode === "login" ? "Logowanie" : "Rejestracja"}
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        Booking studia
      </h2>
      <p className="mt-3 text-sm text-zinc-500">
        Zaloguj się, żeby zarezerwować termin w 1take.records.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === "register" && (
          <label className="block text-left">
            <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
              Imię / nick
            </span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
              placeholder="np. NATAN"
            />
          </label>
        )}

        <label className="block text-left">
          <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
            placeholder="twoj@email.com"
          />
        </label>

        <label className="block text-left">
          <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
            Hasło
          </span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-white/30"
            placeholder="••••••••"
          />
        </label>

        {message && (
          <p className="text-sm text-zinc-400">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
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
  );
}
