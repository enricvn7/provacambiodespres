"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  PackageOpen,
  Search,
  ShoppingBasket,
} from "lucide-react";
import { consumableInventory } from "@/data/mock-data";

const filters = ["Tot", "Encara n’hi ha", "S’ha acabat"] as const;
type Filter = (typeof filters)[number];

export default function ConsumablesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("Tot");

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ca");
    return consumableInventory.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.name, item.category].join(" ").toLocaleLowerCase("ca").includes(normalized);
      const matchesFilter =
        filter === "Tot" ||
        (filter === "S’ha acabat" && item.isOut) ||
        (filter === "Encara n’hi ha" && !item.isOut);
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  const outOfStock = consumableInventory.filter((item) => item.isOut).length;
  const available = consumableInventory.length - outOfStock;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Tornar a l’inici"
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <div>
            <p className="font-bold tracking-tight">Inventari del Cau</p>
            <p className="text-sm text-slate-500">Material fungible</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <PackageOpen className="size-6" aria-hidden="true" />
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Material fungible</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              Consulta ràpidament si encara queda material o si ja s’ha acabat.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Summary value={consumableInventory.length} label="Materials" />
            <Summary value={available} label="Disponibles" />
            <Summary value={outOfStock} label="Acabats" warning={outOfStock > 0} />
          </div>
        </section>

        <section aria-label="Cerca i filtres" className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <label htmlFor="consumables-search" className="sr-only">Cerca material fungible</label>
            <input
              id="consumables-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca material..."
              className="h-13 w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 text-base outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-bold text-slate-700">Estat</legend>
            <div className="flex flex-wrap gap-2">
              {filters.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={filter === option}
                  onClick={() => setFilter(option)}
                  className={`min-h-10 rounded-xl px-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${filter === option ? "bg-amber-500 text-slate-950" : "border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:bg-amber-50"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        </section>

        <section aria-labelledby="consumables-results" className="mt-7">
          <h2 id="consumables-results" className="mb-4 text-lg font-extrabold">
            {results.length} {results.length === 1 ? "resultat" : "resultats"}
          </h2>

          {results.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => (
                <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                      <ShoppingBasket className="size-6" aria-hidden="true" />
                    </span>
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold ${item.isOut ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
                      {item.isOut ? <AlertTriangle className="size-3.5" aria-hidden="true" /> : <CheckCircle2 className="size-3.5" aria-hidden="true" />}
                      {item.isOut ? "S’ha acabat" : "Encara n’hi ha"}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-bold text-amber-700">{item.category}</p>
                  <h3 className="mt-1 text-lg font-extrabold tracking-tight">{item.name}</h3>

                  <div className={`mt-5 rounded-2xl p-4 ${item.isOut ? "bg-red-50" : "bg-slate-50"}`}>
                    <p className={`text-lg font-extrabold ${item.isOut ? "text-red-800" : "text-slate-800"}`}>
                      {item.isOut ? "Cal reposar-lo" : "Disponible per utilitzar"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <PackageOpen className="mx-auto size-10 text-slate-400" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-extrabold">No hi ha cap resultat</h3>
              <p className="mt-1 text-slate-500">Prova una altra cerca o estat.</p>
            </div>
          )}
        </section>

        <p className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-500">
          Els materials mostrats són dades de demostració. No es controla cap quantitat ni estoc numèric.
        </p>
      </div>
    </main>
  );
}

function Summary({ value, label, warning = false }: { value: number; label: string; warning?: boolean }) {
  return (
    <div className={`min-w-24 rounded-2xl border p-3 text-center ${warning ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
      <p className={`text-2xl font-black ${warning ? "text-red-800" : "text-slate-950"}`}>{value}</p>
      <p className={`text-sm font-semibold ${warning ? "text-red-700" : "text-slate-500"}`}>{label}</p>
    </div>
  );
}
