"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, BadgeCheck, Check, ChevronDown, Search, Shirt } from "lucide-react";
import { badgeInventory, type BadgeCategory } from "@/data/mock-data";

const categoryOrder: BadgeCategory[] = [
  "Castors i Llúdrigues",
  "Llops i Daines",
  "Ràngers i Guies",
  "Pioners i Caravel·les",
  "Ròvers",
  "Socis i col·laboradors",
  "Altres",
];
const categories: ("Totes" | BadgeCategory)[] = ["Totes", ...categoryOrder];
type Category = (typeof categories)[number];

export default function BadgesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Totes");
  const [openShirtGroup, setOpenShirtGroup] = useState<BadgeCategory | null>(null);
  const [selectedShirt, setSelectedShirt] = useState<string | null>(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ca");

    return badgeInventory.filter((item) => {
      const matchesQuery =
        !normalized ||
        [item.name, item.kind, item.category]
          .join(" ")
          .toLocaleLowerCase("ca")
          .includes(normalized);
      const matchesCategory = category === "Totes" || item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  const groupedResults = useMemo(
    () =>
      categoryOrder
        .map((branch) => ({
          branch,
          items: results.filter((item) => item.category === branch),
        }))
        .filter((group) => group.items.length > 0),
    [results],
  );

  const totalStock = badgeInventory.reduce((total, item) => total + item.stock, 0);
  const outOfStock = badgeInventory.filter((item) => item.stock === 0).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Tornar a l’inici"
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <div>
            <p className="font-bold tracking-tight">Inventari del Cau</p>
            <p className="text-sm text-slate-500">Insígnies</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-violet-100 text-violet-700">
              <BadgeCheck className="size-6" aria-hidden="true" />
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Insígnies</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              Insígnies, camises i foulards del curs 2026–2027.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Summary value={badgeInventory.length} label="Articles" />
            <Summary value={totalStock} label="Unitats" />
            <Summary value={outOfStock} label="Sense estoc" warning />
          </div>
        </section>

        <section aria-label="Cerca i filtres" className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <label htmlFor="badges-search" className="sr-only">Cerca insígnies</label>
            <input
              id="badges-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca per nom, tipus o branca..."
              className="h-13 w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 text-base outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-bold text-slate-700">Branca</legend>
            <div className="flex flex-wrap gap-2">
              {categories.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={category === option}
                  onClick={() => setCategory(option)}
                  className={`min-h-10 rounded-xl px-3 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${category === option ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        </section>

        <section aria-labelledby="badges-results" className="mt-7">
          <h2 id="badges-results" className="mb-4 text-lg font-extrabold">
            {results.length} {results.length === 1 ? "resultat" : "resultats"}
          </h2>

          {groupedResults.length ? (
            <div className="space-y-5">
              {groupedResults.map((group) => {
                const shirts = group.items.filter((item) => item.kind === "Camisa");
                const otherItems = group.items.filter((item) => item.kind !== "Camisa");
                const shirtName = shirts[0]?.name.replace(/ talla \d+$/, "");
                const shirtStock = shirts.reduce((total, item) => total + item.stock, 0);
                const shirtsAreOpen = openShirtGroup === group.branch;

                return (
                <article key={group.branch} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <header className="flex flex-col gap-2 border-b border-violet-100 bg-violet-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-violet-700 shadow-sm">
                        <Award className="size-5" aria-hidden="true" />
                      </span>
                      <h3 className="text-lg font-black tracking-tight text-violet-950">{group.branch}</h3>
                    </div>
                    <p className="text-sm font-bold text-violet-700">
                      {group.items.length} {group.items.length === 1 ? "article" : "articles"}
                    </p>
                  </header>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[34rem] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-sm text-slate-500">
                          <th scope="col" className="px-5 py-3 font-bold">Nom</th>
                          <th scope="col" className="w-40 px-5 py-3 font-bold">Tipus</th>
                          <th scope="col" className="w-28 px-5 py-3 text-right font-bold">Estoc</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {otherItems.map((item) => {
                          const isOut = item.stock === 0;
                          const isLow = item.stock > 0 && item.stock <= 5;

                          return (
                            <tr key={item.id} className="transition hover:bg-slate-50">
                              <th scope="row" className="px-5 py-3.5 text-base font-bold text-slate-900">{item.name}</th>
                              <td className="px-5 py-3.5 text-sm font-semibold text-slate-500">{item.kind}</td>
                              <td className="px-5 py-3.5 text-right">
                                <span className={`inline-flex min-w-12 justify-center rounded-full px-3 py-1 text-sm font-black ${isOut ? "bg-red-50 text-red-700" : isLow ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>
                                  {item.stock}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        {shirts.length > 0 && (
                          <>
                            <tr className="transition hover:bg-violet-50/50">
                              <th scope="row" className="p-0 text-base font-bold text-slate-900">
                                <button
                                  type="button"
                                  aria-expanded={shirtsAreOpen}
                                  onClick={() => setOpenShirtGroup(shirtsAreOpen ? null : group.branch)}
                                  className="flex w-full items-center gap-3 px-5 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-violet-600"
                                >
                                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">
                                    <Shirt className="size-5" aria-hidden="true" />
                                  </span>
                                  <span>
                                    <span className="block">{shirtName}</span>
                                    <span className="mt-0.5 block text-sm font-semibold text-violet-700">Clica per escollir la talla</span>
                                  </span>
                                  <ChevronDown className={`ml-auto size-5 shrink-0 text-violet-600 transition ${shirtsAreOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                                </button>
                              </th>
                              <td className="px-5 py-3.5 text-sm font-semibold text-slate-500">Camisa</td>
                              <td className="px-5 py-3.5 text-right">
                                <span className={`inline-flex min-w-12 justify-center rounded-full px-3 py-1 text-sm font-black ${shirtStock === 0 ? "bg-red-50 text-red-700" : shirtStock <= 5 ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}>
                                  {shirtStock}
                                </span>
                              </td>
                            </tr>
                            {shirtsAreOpen && (
                              <tr>
                                <td colSpan={3} className="bg-violet-50/60 px-5 py-5">
                                  <p className="mb-3 text-sm font-bold text-violet-950">Escull una talla</p>
                                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                                    {shirts.map((shirt) => {
                                      const size = shirt.name.match(/talla (\d+)$/)?.[1];
                                      const isSelected = selectedShirt === shirt.id;

                                      return (
                                        <button
                                          key={shirt.id}
                                          type="button"
                                          aria-pressed={isSelected}
                                          onClick={() => setSelectedShirt(shirt.id)}
                                          className={`min-h-20 rounded-2xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${isSelected ? "border-violet-600 bg-violet-600 text-white shadow-sm" : "border-violet-200 bg-white text-slate-900 hover:border-violet-400"}`}
                                        >
                                          <span className="flex items-center justify-between gap-2">
                                            <span className="text-base font-black">Talla {size}</span>
                                            {isSelected && <Check className="size-4" aria-hidden="true" />}
                                          </span>
                                          <span className={`mt-1 block text-sm font-semibold ${isSelected ? "text-violet-100" : shirt.stock === 0 ? "text-red-600" : "text-slate-500"}`}>
                                            Estoc: {shirt.stock}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <Award className="mx-auto size-10 text-slate-400" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-extrabold">No hi ha cap resultat</h3>
              <p className="mt-1 text-slate-500">Prova una altra cerca o categoria.</p>
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
