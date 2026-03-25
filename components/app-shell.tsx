"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Calculator, LogOut } from "lucide-react";

const links = [
  { href: "/", label: "Planning", icon: CalendarDays },
  { href: "/tarification", label: "Tarification", icon: Calculator },
];

export function AppShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-slate-900/90 p-5">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <div className="text-2xl font-bold">Delale Bureau</div>
            <p className="mt-2 text-sm text-slate-300">
              Planning + calculateur en ligne, synchronisés sur tous tes appareils.
            </p>
          </div>

          <nav className="mt-6 grid gap-2">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition",
                    active
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700",
                  ].join(" ")}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800 p-4 text-sm text-slate-300">
            Connecté avec
            <div className="mt-1 break-all font-semibold text-white">{email}</div>
            <form action="/auth/signout" method="post" className="mt-4">
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-700 px-3 py-2 text-white hover:bg-slate-600">
                <LogOut size={16} />
                Se déconnecter
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 bg-slate-950">{children}</main>
      </div>
    </div>
  );
}