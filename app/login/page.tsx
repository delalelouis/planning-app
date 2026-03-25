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

    if (!email || !password) {
      setMessage("Renseigne ton e-mail et ton mot de passe.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage("Connexion impossible : " + error.message);
        setLoading(false);
        return;
      }

      router.replace("/planning.html");
      router.refresh();
    } catch (err) {
      console.error(err);
      setMessage("Une erreur est survenue pendant la connexion.");
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto mt-10 max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Delale Bureau</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Connecte-toi pour accéder à ton planning et à ton calculateur.
          </p>
        </div>

        <form onSubmit={signIn} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm text-slate-300">E-mail</label>
            <input
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        {message ? (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {message}
          </div>
        ) : null}
      </div>
    </main>
  );
}