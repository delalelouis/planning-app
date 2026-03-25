"use client";

import { useMemo, useState } from "react";

type PricingData = {
  version: number;
  tonteSurfaceRates: { min: number; rate: number; label: string }[];
  forms: {
    tonte: {
      surface: number;
      terrain: string;
      herbe: string;
      zones: string;
      obstacles: string;
      acces: string;
      bordures: string;
      frequence: string;
      remise: string;
      evacuation: string;
      tempsEvac: number;
      tauxEvac: number;
      deplacement: number;
      minimum: number;
    };
  };
};

const terrainMap: Record<string, number> = {
  "Plat et dégagé": 1,
  "Pente douce": 1.08,
  "Talus / replat / pente": 1.15,
  "Terrain difficile": 1.25,
  "Très difficile": 1.38,
};

const herbeMap: Record<string, number> = {
  Basse: 0.95,
  Normale: 1,
  Moyenne: 1.05,
  Haute: 1.12,
  "Remise en état": 1.25,
};

const options = {
  terrain: Object.keys(terrainMap),
  herbe: Object.keys(herbeMap),
};

export function TarificationPage({
  initialData,
}: {
  initialData: PricingData;
}) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);

  const result = useMemo(() => {
    const form = data.forms.tonte;
    const tier =
      [...data.tonteSurfaceRates]
        .sort((a, b) => a.min - b.min)
        .reduce((acc, tier) => (form.surface >= tier.min ? tier : acc), data.tonteSurfaceRates[0]);

    const coeff = (terrainMap[form.terrain] ?? 1) * (herbeMap[form.herbe] ?? 1);
    const base = form.surface * tier.rate;
    const adjusted = base * coeff;
    const evac = form.evacuation === "Oui" ? form.tempsEvac * form.tauxEvac : 0;
    const total = Math.max(adjusted + evac + form.deplacement, form.minimum);

    return { tier, coeff, base, adjusted, evac, total };
  }, [data]);

  async function persist(next: PricingData) {
    setData(next);
    setSaving(true);
    await fetch("/api/tarification", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
  }

  function euro(value: number) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value || 0);
  }

  return (
    <div className="p-5 md:p-8">
      <div className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
        <h1 className="text-3xl font-bold">Calculateur de tarification</h1>
        <p className="mt-1 text-sm text-slate-400">
          Sauvegarde en ligne automatique. {saving ? "Enregistrement..." : "À jour."}
        </p>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Tonte</h2>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-slate-400">Surface (m²)</span>
              <input
                type="number"
                value={data.forms.tonte.surface}
                onChange={(e) =>
                  persist({
                    ...data,
                    forms: {
                      ...data.forms,
                      tonte: { ...data.forms.tonte, surface: Number(e.target.value || 0) },
                    },
                  })
                }
                className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-slate-400">Terrain</span>
              <select
                value={data.forms.tonte.terrain}
                onChange={(e) =>
                  persist({
                    ...data,
                    forms: {
                      ...data.forms,
                      tonte: { ...data.forms.tonte, terrain: e.target.value },
                    },
                  })
                }
                className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3"
              >
                {options.terrain.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-slate-400">Herbe</span>
              <select
                value={data.forms.tonte.herbe}
                onChange={(e) =>
                  persist({
                    ...data,
                    forms: {
                      ...data.forms,
                      tonte: { ...data.forms.tonte, herbe: e.target.value },
                    },
                  })
                }
                className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3"
              >
                {options.herbe.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-slate-400">Évacuation</span>
              <select
                value={data.forms.tonte.evacuation}
                onChange={(e) =>
                  persist({
                    ...data,
                    forms: {
                      ...data.forms,
                      tonte: { ...data.forms.tonte, evacuation: e.target.value },
                    },
                  })
                }
                className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3"
              >
                <option>Non</option>
                <option>Oui</option>
              </select>
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm text-slate-400">Temps évac (h)</span>
                <input
                  type="number"
                  step="0.25"
                  value={data.forms.tonte.tempsEvac}
                  onChange={(e) =>
                    persist({
                      ...data,
                      forms: {
                        ...data.forms,
                        tonte: { ...data.forms.tonte, tempsEvac: Number(e.target.value || 0) },
                      },
                    })
                  }
                  className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-400">Taux évac (€)</span>
                <input
                  type="number"
                  value={data.forms.tonte.tauxEvac}
                  onChange={(e) =>
                    persist({
                      ...data,
                      forms: {
                        ...data.forms,
                        tonte: { ...data.forms.tonte, tauxEvac: Number(e.target.value || 0) },
                      },
                    })
                  }
                  className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-slate-400">Minimum (€)</span>
                <input
                  type="number"
                  value={data.forms.tonte.minimum}
                  onChange={(e) =>
                    persist({
                      ...data,
                      forms: {
                        ...data.forms,
                        tonte: { ...data.forms.tonte, minimum: Number(e.target.value || 0) },
                      },
                    })
                  }
                  className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Résultat</h2>
          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
              Tarif base : <strong>{result.tier.rate.toFixed(2)} €/m²</strong>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
              Coefficient global : <strong>{result.coeff.toFixed(2)}</strong>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
              Base surface : <strong>{euro(result.base)}</strong>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
              Prix ajusté : <strong>{euro(result.adjusted)}</strong>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-800 p-4">
              Évacuation : <strong>{euro(result.evac)}</strong>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-lg">
              Total HT : <strong>{euro(result.total)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}