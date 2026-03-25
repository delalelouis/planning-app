"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/planning.html");
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
      Redirection...
    </div>
  );
}
