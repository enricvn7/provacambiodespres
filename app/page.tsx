"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Backpack,
  BadgeCheck,
  Box,
  ChevronRight,
  Clock3,
  Cross,
  PackageOpen,
  Search,
  UserRound,
} from "lucide-react";
import { areas, inventoryItems, notices } from "@/data/mock-data";

const areaIcons = {
  farmaciola: Cross,
  general: Backpack,
  fungible: PackageOpen,
  insignies: BadgeCheck,
};

export default function Home() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ca");
    if (!normalized) return [];

    return inventoryItems.filter((item) =>
      [item.name, item.area, item.location]
        .join(" ")
        .toLocaleLowerCase("ca")
        .includes(normalized),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-sky-600 text-sm font-black text-white shadow-sm">
              CAU
            </div>
            <div>
              <p className="font-bold tracking-tight">Inventari del Cau</p>
              <p className="text-sm text-slate-500">AE Albada · Rubí</p>
            </div>
          </div>

          <button
            type="button"
            className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <span className="grid size-7 place-items-center rounded-full bg-slate-100">
              <UserRound className="size-4" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">Marta Soler</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section aria-labelledby="welcome-heading" className="max-w-3xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] text-sky-700">
            Dimecres, 30 de setembre
          </p>
          <h1 id="welcome-heading" className="text-3xl font-black tracking-tight sm:text-4xl">
            Bon dia, Marta
          </h1>
          <p className="mt-2 text-base leading-7 text-slate-600 sm:text-lg">
            Què necessites consultar o gestionar avui?
          </p>

          <div className="relative mt-6">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <label htmlFor="inventory-search" className="sr-only">
              Cerca a tot l&apos;inventari
            </label>
            <input
              id="inventory-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca material, ubicació o àmbit..."
              className="h-14 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-4 text-base shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />

            {query && (
              <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                {results.length ? (
                  <ul className="divide-y divide-slate-100">
                    {results.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-sky-50 focus-visible:bg-sky-50 focus-visible:outline-none"
                        >
                          <span>
                            <span className="block font-semibold">{item.name}</span>
                            <span className="block text-sm text-slate-500">
                              {item.area} · {item.location}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-semibold text-slate-600">
                            {item.available} disponibles
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-sm text-slate-600">
                    No hem trobat cap element amb aquest nom.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="areas-heading" className="mt-10">
          <div className="mb-4">
            <h2 id="areas-heading" className="text-xl font-extrabold tracking-tight">
              Àmbits de l&apos;inventari
            </h2>
            <p className="mt-1 text-sm text-slate-500">Tria on vols entrar.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => {
              const Icon = areaIcons[area.id];
              const content = (
                <>
                  <span className={`grid size-12 place-items-center rounded-2xl ${area.iconStyle}`}>
                    <Icon className="size-6" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <span className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-lg font-extrabold">{area.name}</span>
                    <ChevronRight
                      className="size-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-600"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-slate-500">{area.summary}</span>
                  <span className="mt-4 block text-sm font-bold text-slate-700">
                    {area.items} elements
                  </span>
                </>
              );

              const href =
                area.id === "farmaciola"
                  ? "/inventari/farmaciola"
                  : area.id === "general"
                    ? "/inventari/general"
                    : area.id === "fungible"
                      ? "/inventari/fungible"
                      : area.id === "insignies"
                        ? "/inventari/insignies"
                        : null;

              return href ? (
                <Link
                  href={href}
                  key={area.id}
                  className="group min-h-48 rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  key={area.id}
                  className="group min-h-48 rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section
            aria-labelledby="loans-heading"
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="loans-heading" className="text-xl font-extrabold tracking-tight">
                  Els meus préstecs
                </h2>
                <p className="mt-1 text-sm text-slate-500">Material que tens ara mateix.</p>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-800">
                2 actius
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <LoanItem name="Tenda de 4 places" code="T-04" date="Retorn previst: 4 d’octubre" />
              <LoanItem name="Fogonet de gas" code="FG-02" date="Sense data de retorn" />
            </div>

            <button
              type="button"
              className="mt-5 min-h-11 w-full rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:border-sky-400 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Veure tots els préstecs
            </button>
          </section>

          <section
            aria-labelledby="notices-heading"
            className="rounded-3xl bg-slate-900 p-5 text-white shadow-sm sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="notices-heading" className="text-xl font-extrabold tracking-tight">
                  Avisos
                </h2>
                <p className="mt-1 text-sm text-slate-300">Situacions que cal revisar.</p>
              </div>
              <AlertTriangle className="size-6 text-amber-400" aria-hidden="true" />
            </div>

            <ul className="mt-5 space-y-3">
              {notices.map((notice) => (
                <li key={notice.id} className="rounded-2xl bg-white/8 p-4">
                  <div className="flex gap-3">
                    <span className={`mt-1 size-2.5 shrink-0 rounded-full ${notice.dotStyle}`} />
                    <div>
                      <p className="font-bold">{notice.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-300">{notice.detail}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

function LoanItem({ name, code, date }: { name: string; code: string; date: string }) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-700">
        <Box className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2">
          <h3 className="font-bold">{name}</h3>
          <span className="text-sm font-semibold text-slate-400">{code}</span>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <Clock3 className="size-4" aria-hidden="true" />
          {date}
        </p>
      </div>
      <ChevronRight className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
    </article>
  );
}
