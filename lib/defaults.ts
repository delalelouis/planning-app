export const defaultPlanningData = {
  clients: [],
  seasonStart: "2026-03-02",
  seasonEnd: "2026-11-04",
  version: 1,
};

export const defaultPricingData = {
  version: 1,
  tonteSurfaceRates: [
    { min: 0, rate: 0.75, label: "micro-surface" },
    { min: 101, rate: 0.55, label: "petite surface" },
    { min: 251, rate: 0.27, label: "surface standard" },
    { min: 501, rate: 0.19, label: "surface moyenne" },
    { min: 1001, rate: 0.15, label: "grande surface" },
    { min: 2001, rate: 0.14, label: "très grande surface" }
  ],
  forms: {
    tonte: {
      surface: 0,
      terrain: "Plat et dégagé",
      herbe: "Normale",
      zones: "1 zone",
      obstacles: "Faible",
      acces: "Facile",
      bordures: "Non",
      frequence: "Ponctuel / hors contrat",
      remise: "Non",
      evacuation: "Non",
      tempsEvac: 0,
      tauxEvac: 40,
      deplacement: 0,
      minimum: 80
    }
  }
};