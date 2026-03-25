"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    await supabase.auth.getSession();

    router.replace("/");
    router.refresh();

    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  }

  async function signUp() {
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Compte créé. Vérifie ton e-mail si la confirmation est activée.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto mt-16 max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6">
        <h1 className="text-3xl font-bold">Delale Bureau</h1>
        <p className="mt-2 text-sm text-slate-400">
          Connexion sécurisée pour retrouver ton planning et ton calculateur partout.
        </p>

        <form onSubmit={signIn} className="mt-6 grid gap-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3"
          />

          <button
            disabled={loading}
            className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Chargement..." : "Se connecter"}
          </button>

          <button
            type="button"
            onClick={signUp}
            disabled={loading}
            className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
          >
            Créer mon compte
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-amber-300">{message}</p> : null}
      </div>
    </main>
  );
}