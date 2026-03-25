"use client";

import { useMemo, useState } from "react";

type PlanningClient = {
  id: string;
  name: string;
  checks: string[];
  comments: Record<string, string>;
  clientComment: string;
};

type PlanningData = {
  clients: PlanningClient[];
  seasonStart: string;
  seasonEnd: string;
  version: number;
};

function buildDates(start: string, end: string) {
  const out: string[] = [];
  const current = new Date(start + "T12:00:00");
  const last = new Date(end + "T12:00:00");
  while (current <= last) {
    out.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return out;
}

function monthLabel(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

function dayShort(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", {
    weekday: "short",
  });
}

export function PlanningPage({
  initialData,
}: {
  initialData: PlanningData;
}) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);

  const dates = useMemo(
    () => buildDates(data.seasonStart, data.seasonEnd),
    [data.seasonStart, data.seasonEnd]
  );

  const monthStarts = useMemo(() => new Set(dates.filter((d) => d.endsWith("-01"))), [dates]);

  async function persist(next: PlanningData) {
    setData(next);
    setSaving(true);
    await fetch("/api/planning", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
  }

  async function addClient() {
    const name = window.prompt("Nom du client ?");
    if (!name?.trim()) return;
    const next = {
      ...data,
      clients: [
        ...data.clients,
        {
          id: crypto.randomUUID(),
          name: name.trim(),
          checks: [],
          comments: {},
          clientComment: "",
        },
      ],
    };
    await persist(next);
  }

  async function renameClient(id: string) {
    const client = data.clients.find((c) => c.id === id);
    if (!client) return;
    const name = window.prompt("Modifier le client", client.name);
    if (!name?.trim()) return;
    await persist({
      ...data,
      clients: data.clients.map((c) => (c.id === id ? { ...c, name: name.trim() } : c)),
    });
  }

  async function editClientComment(id: string) {
    const client = data.clients.find((c) => c.id === id);
    if (!client) return;
    const comment = window.prompt("Commentaire client", client.clientComment || "");
    if (comment === null) return;
    await persist({
      ...data,
      clients: data.clients.map((c) =>
        c.id === id ? { ...c, clientComment: comment.trim() } : c
      ),
    });
  }

  async function removeClient(id: string) {
    if (!window.confirm("Supprimer ce client ?")) return;
    await persist({ ...data, clients: data.clients.filter((c) => c.id !== id) });
  }

  async function toggleDate(clientId: string, iso: string) {
    const client = data.clients.find((c) => c.id === clientId);
    if (!client) return;

    const checks = new Set(client.checks);
    const comments = { ...client.comments };

    if (checks.has(iso)) {
      checks.delete(iso);
      delete comments[iso];
    } else {
      checks.add(iso);
      const value = window.prompt("Commentaire du passage", comments[iso] || "");
      if (value !== null && value.trim()) comments[iso] = value.trim();
    }

    await persist({
      ...data,
      clients: data.clients.map((c) =>
        c.id === clientId
          ? { ...c, checks: Array.from(checks).sort(), comments }
          : c
      ),
    });
  }

  async function editPassageComment(clientId: string, iso: string) {
    const client = data.clients.find((c) => c.id === clientId);
    if (!client) return;
    const value = window.prompt(
      "Modifier le commentaire du passage",
      client.comments[iso] || ""
    );
    if (value === null) return;

    const comments = { ...client.comments };
    if (value.trim()) comments[iso] = value.trim();
    else delete comments[iso];

    await persist({
      ...data,
      clients: data.clients.map((c) => (c.id === clientId ? { ...c, comments } : c)),
    });
  }

  return (
    <div className="p-5 md:p-8">
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Planning</h1>
            <p className="mt-1 text-sm text-slate-400">
              Sauvegarde en ligne automatique. {saving ? "Enregistrement..." : "À jour."}
            </p>
          </div>
          <button
            onClick={addClient}
            className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-400"
          >
            + Ajouter client
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-auto rounded-3xl border border-white/10 bg-slate-900">
        <table className="min-w-max border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-30 min-w-[320px] border-b border-r border-white/10 bg-slate-950 p-4 text-left">
                Clients
              </th>
              {dates.map((iso) => (
                <th
                  key={iso}
                  className={[
                    "min-w-[42px] border-b border-white/10 p-2 text-center text-slate-400",
                    monthStarts.has(iso) ? "border-l-4 border-l-emerald-500" : "",
                  ].join(" ")}
                  title={monthLabel(iso)}
                >
                  <div>{dayShort(iso)}</div>
                  <div className="font-bold text-white">
                    {new Date(iso + "T12:00:00").getDate()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.clients.map((client) => (
              <tr key={client.id}>
                <td className="sticky left-0 z-20 border-r border-white/10 bg-slate-950 p-3 align-top">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{client.name}</div>
                      <div className="mt-1 text-xs text-slate-400">
                        {client.clientComment || "Aucun commentaire client"}
                      </div>
                    </div>
                    <details className="relative">
                      <summary className="cursor-pointer list-none rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-white">
                        ⋯
                      </summary>
                      <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-slate-800 p-2 shadow-2xl">
                        <button
                          onClick={() => renameClient(client.id)}
                          className="block w-full rounded-xl px-3 py-2 text-left hover:bg-slate-700"
                        >
                          Modifier le client
                        </button>
                        <button
                          onClick={() => editClientComment(client.id)}
                          className="block w-full rounded-xl px-3 py-2 text-left hover:bg-slate-700"
                        >
                          Ajouter un commentaire
                        </button>
                        <button
                          onClick={() => editClientComment(client.id)}
                          className="block w-full rounded-xl px-3 py-2 text-left hover:bg-slate-700"
                        >
                          Modifier un commentaire
                        </button>
                        <button
                          onClick={() => removeClient(client.id)}
                          className="block w-full rounded-xl px-3 py-2 text-left text-red-300 hover:bg-slate-700"
                        >
                          Supprimer le client
                        </button>
                      </div>
                    </details>
                  </div>
                </td>

                {dates.map((iso) => {
                  const checked = client.checks.includes(iso);
                  const hasComment = Boolean(client.comments[iso]);
                  return (
                    <td
                      key={iso}
                      className={[
                        "border-b border-white/5 p-0 text-center",
                        monthStarts.has(iso) ? "border-l-4 border-l-emerald-500" : "",
                      ].join(" ")}
                      title={client.comments[iso] || ""}
                    >
                      <button
                        onClick={() => toggleDate(client.id, iso)}
                        onDoubleClick={() => editPassageComment(client.id, iso)}
                        className="relative h-11 w-11"
                      >
                        <span
                          className={[
                            "inline-block h-4 w-4 rounded-md border",
                            checked
                              ? "border-emerald-400 bg-emerald-500"
                              : "border-slate-500 bg-slate-800",
                          ].join(" ")}
                        />
                        {hasComment ? (
                          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400" />
                        ) : null}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}