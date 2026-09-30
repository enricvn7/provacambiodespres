"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Backpack,
  Box,
  PackageCheck,
  PackageOpen,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { generalInventory } from "@/data/mock-data";

const categories = ["Totes", "Acampada", "Cuina"] as const;
const availabilityFilters = ["Tot", "Disponible", "Prestat", "Revisió"] as const;

type CategoryFilter = (typeof categories)[number];
type AvailabilityFilter = (typeof availabilityFilters)[number];

export default function GeneralInventoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("Totes");
  const [availability, setAvailability] = useState<AvailabilityFilter>("Tot");

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ca");

    return generalInventory.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.name, item.code, item.category]
          .join(" ")
          .toLocaleLowerCase("ca")
          .includes(normalized);
      const matchesCategory = category === "Totes" || item.category === category;
      const matchesAvailability =
        availability === "Tot" ||
        (availability === "Disponible" && item.available > 0) ||
        (availability === "Prestat" && item.available < item.total) ||
        (availability === "Revisió" && item.review > 0);

      return matchesQuery && matchesCategory && matchesAvailability;
    });
  }, [availability, category, query]);

  const borrowed = generalInventory.reduce((total, item) => total + item.total - item.available - item.review, 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="Tornar a l’inici"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
            <div className="min-w-0">
              <p className="truncate font-bold tracking-tight">Inventari del Cau</p>
              <p className="truncate text-sm text-slate-500">Material general</p>
            </div>
          </div>

          <button
            type="button"
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-sky-600 px-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 sm:px-4"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Proposar material</span>
            <span className="sm:hidden">Proposar</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-sky-100 text-sky-700">
              <Backpack className="size-6" aria-hidden="true" />
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Material general</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              Consulta què tenim, on es troba i quina quantitat està disponible.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Summary value={generalInventory.length} label="Elements" />
            <Summary value={borrowed} label="Prestats" />
            <Summary value={1} label="A revisar" warning />
          </div>
        </section>

        <section aria-label="Cerca i filtres" className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <label htmlFor="general-search" className="sr-only">Cerca material general</label>
            <input
              id="general-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca per nom, codi o categoria..."
              className="h-13 w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 text-base outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <FilterGroup label="Categoria" options={categories} value={category} onChange={(value) => setCategory(value as CategoryFilter)} />
            <FilterGroup label="Disponibilitat" options={availabilityFilters} value={availability} onChange={(value) => setAvailability(value as AvailabilityFilter)} />
          </div>
        </section>

        <section aria-labelledby="results-heading" className="mt-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="results-heading" className="text-lg font-extrabold">
              {filteredItems.length} {filteredItems.length === 1 ? "resultat" : "resultats"}
            </h2>
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Dades de demostració
            </span>
          </div>

          {filteredItems.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredItems.map((item) => {
                const borrowedQuantity = Math.max(0, item.total - item.available - item.review);
                const state = item.available === 0 ? "Tot prestat" : borrowedQuantity > 0 ? "Parcialment prestat" : "Disponible";

                return (
                  <article key={item.id} className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                        <Box className="size-6" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-600">{item.code}</span>
                          <StatusBadge state={state} />
                          {item.review > 0 && (
                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-bold text-amber-800">
                              <AlertTriangle className="size-3.5" aria-hidden="true" />
                              {item.review} a revisar
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 text-lg font-extrabold tracking-tight">{item.name}</h3>
                        <p className="mt-1 text-sm font-semibold text-sky-700">{item.category}</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                      <div>
                        <p className="text-sm text-slate-500">Disponibles</p>
                        <p className="mt-1 text-2xl font-black tracking-tight">
                          {item.available}<span className="text-base font-bold text-slate-400"> / {item.total}</span>
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <PackageOpen className="mx-auto size-10 text-slate-400" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-extrabold">No hi ha cap resultat</h3>
              <p className="mt-1 text-slate-500">Prova una altra cerca o treu algun filtre.</p>
              <button
                type="button"
                onClick={() => { setQuery(""); setCategory("Totes"); setAvailability("Tot"); }}
                className="mt-5 min-h-11 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Netejar filtres
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Summary({ value, label, warning = false }: { value: number; label: string; warning?: boolean }) {
  return (
    <div className={`min-w-24 rounded-2xl border p-3 text-center ${warning ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
      <p className={`text-2xl font-black ${warning ? "text-amber-800" : "text-slate-950"}`}>{value}</p>
      <p className={`text-sm font-semibold ${warning ? "text-amber-700" : "text-slate-500"}`}>{label}</p>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (value: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold text-slate-700">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={`min-h-10 rounded-xl px-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${value === option ? "bg-sky-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function StatusBadge({ state }: { state: string }) {
  const style = state === "Disponible" ? "bg-emerald-100 text-emerald-800" : state === "Tot prestat" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";
  return (
    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold ${style}`}>
      <PackageCheck className="size-3.5" aria-hidden="true" />
      {state}
    </span>
  );
}
