"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Backpack,
  BadgeCheck,
  Box,
  Check,
  ChevronRight,
  Clock3,
  Cross,
  PackageOpen,
  PackagePlus,
  RotateCcw,
  Search,
  UserRound,
} from "lucide-react";
import {
  areas,
  badgeInventory,
  consumableInventory,
  firstAidUnits,
  generalInventory,
  inventoryItems,
  notices,
} from "@/data/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const areaIcons = {
  farmaciola: Cross,
  general: Backpack,
  fungible: PackageOpen,
  insignies: BadgeCheck,
};

type BorrowCategoryId = keyof typeof areaIcons;

type BorrowOption = {
  id: string;
  name: string;
  detail: string;
  available: number | null;
};

type BorrowedItem = {
  id: string;
  inventoryId: string;
  name: string;
  category: string;
  borrowedOn: string;
};

const borrowCategories: {
  id: BorrowCategoryId;
  label: string;
  description: string;
}[] = [
  { id: "general", label: "Material general", description: "Tendes, cuina i acampada" },
  { id: "farmaciola", label: "Farmaciola", description: "Farmacioles generals i de branca" },
  { id: "fungible", label: "Material fungible", description: "Papereria, manualitats i neteja" },
  { id: "insignies", label: "Insígnies", description: "Insígnies, camises i foulards" },
];

const borrowCatalog: Record<BorrowCategoryId, BorrowOption[]> = {
  general: generalInventory
    .filter((item) => item.available > 0)
    .map((item) => ({
      id: `general:${item.id}`,
      name: item.name,
      detail: item.category,
      available: item.available,
    })),
  farmaciola: firstAidUnits.map((item) => ({
    id: `farmaciola:${item.id}`,
    name: item.kind === "Botiquí de branca" ? `Farmaciola ${item.name}` : item.name,
    detail: item.kind,
    available: null,
  })),
  fungible: consumableInventory
    .filter((item) => !item.isOut)
    .map((item) => ({
      id: `fungible:${item.id}`,
      name: item.name,
      detail: item.category,
      available: null,
    })),
  insignies: badgeInventory
    .filter((item) => item.stock > 0)
    .map((item) => ({
      id: `insignies:${item.id}`,
      name: item.name,
      detail: `${item.category} · ${item.kind}`,
      available: item.stock,
    })),
};

const initialLoans: BorrowedItem[] = [
  {
    id: "prestec-inicial-tenda",
    inventoryId: "general:tenda-4-places",
    name: "Tendes",
    category: "Material general",
    borrowedOn: "30 de setembre",
  },
  {
    id: "prestec-inicial-fogonet",
    inventoryId: "general:fogonet-gas",
    name: "Fogonet de gas",
    category: "Material general",
    borrowedOn: "30 de setembre",
  },
];

const loansStorageKey = "inventari-cau-prestecs-marta";

export default function Home() {
  const [query, setQuery] = useState("");
  const [borrowOpen, setBorrowOpen] = useState(false);
  const [borrowCategory, setBorrowCategory] = useState<BorrowCategoryId | null>(null);
  const [selectedBorrowItem, setSelectedBorrowItem] = useState<string | null>(null);
  const [borrowQuery, setBorrowQuery] = useState("");
  const [loans, setLoans] = useState<BorrowedItem[]>(initialLoans);
  const [loansLoaded, setLoansLoaded] = useState(false);

  useEffect(() => {
    const savedLoans = window.localStorage.getItem(loansStorageKey);

    if (savedLoans) {
      try {
        const parsed = JSON.parse(savedLoans);
        if (Array.isArray(parsed)) setLoans(parsed);
      } catch {
        window.localStorage.removeItem(loansStorageKey);
      }
    }

    setLoansLoaded(true);
  }, []);

  useEffect(() => {
    if (loansLoaded) {
      window.localStorage.setItem(loansStorageKey, JSON.stringify(loans));
    }
  }, [loans, loansLoaded]);

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

  const borrowOptions = useMemo(() => {
    if (!borrowCategory) return [];
    const normalized = borrowQuery.trim().toLocaleLowerCase("ca");

    return borrowCatalog[borrowCategory].filter(
      (item) =>
        !normalized ||
        [item.name, item.detail].join(" ").toLocaleLowerCase("ca").includes(normalized),
    );
  }, [borrowCategory, borrowQuery]);

  const selectedOption = borrowCategory
    ? borrowCatalog[borrowCategory].find((item) => item.id === selectedBorrowItem)
    : undefined;

  function resetBorrowFlow() {
    setBorrowCategory(null);
    setSelectedBorrowItem(null);
    setBorrowQuery("");
  }

  function handleBorrowOpenChange(open: boolean) {
    setBorrowOpen(open);
    if (!open) resetBorrowFlow();
  }

  function confirmBorrow() {
    if (!borrowCategory || !selectedOption) return;

    const category = borrowCategories.find((item) => item.id === borrowCategory);
    const borrowedOn = new Intl.DateTimeFormat("ca-ES", {
      day: "numeric",
      month: "long",
    }).format(new Date());

    setLoans((current) => [
      ...current,
      {
        id: `${selectedOption.id}-${Date.now()}`,
        inventoryId: selectedOption.id,
        name: selectedOption.name,
        category: category?.label ?? "",
        borrowedOn,
      },
    ]);
    handleBorrowOpenChange(false);
  }

  function markReturned(loanId: string) {
    setLoans((current) => current.filter((loan) => loan.id !== loanId));
  }

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

          <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-sky-600 p-5 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15">
                <PackagePlus className="size-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-black tracking-tight">Necessites agafar material?</h2>
                <p className="mt-1 text-sm leading-6 text-sky-100">
                  Tria la categoria i l&apos;article. Quedarà apuntat al teu usuari.
                </p>
              </div>
            </div>

            <Dialog open={borrowOpen} onOpenChange={handleBorrowOpenChange}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="min-h-12 shrink-0 rounded-2xl bg-white px-5 text-base font-black text-sky-700 shadow-sm transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Agafar material
                </button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black tracking-tight">
                    {borrowCategory ? "Què vols agafar?" : "Tria una categoria"}
                  </DialogTitle>
                  <DialogDescription className="text-base leading-6">
                    {borrowCategory
                      ? "Selecciona un article i confirma el préstec."
                      : "Primer indica de quin àmbit és el material."}
                  </DialogDescription>
                </DialogHeader>

                {!borrowCategory ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {borrowCategories.map((category) => {
                      const Icon = areaIcons[category.id];

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setBorrowCategory(category.id)}
                          className="group flex min-h-28 items-start gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-sky-400 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                        >
                          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <span>
                            <span className="block font-black text-slate-950">{category.label}</span>
                            <span className="mt-1 block text-sm leading-5 text-slate-500">
                              {category.description}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={resetBorrowFlow}
                      className="flex min-h-10 w-fit items-center gap-2 rounded-xl px-2 text-sm font-bold text-sky-700 transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      Canviar categoria
                    </button>

                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                      />
                      <label htmlFor="borrow-search" className="sr-only">
                        Cercar un article
                      </label>
                      <input
                        id="borrow-search"
                        value={borrowQuery}
                        onChange={(event) => setBorrowQuery(event.target.value)}
                        placeholder="Cerca dins la categoria..."
                        className="h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 pl-12 pr-4 text-base outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      />
                    </div>

                    <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                      {borrowOptions.length ? (
                        borrowOptions.map((item) => {
                          const isSelected = selectedBorrowItem === item.id;
                          const alreadyBorrowed = loans.some((loan) => loan.inventoryId === item.id);

                          return (
                            <button
                              key={item.id}
                              type="button"
                              disabled={alreadyBorrowed}
                              aria-pressed={isSelected}
                              onClick={() => setSelectedBorrowItem(item.id)}
                              className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50 ${
                                isSelected
                                  ? "border-sky-600 bg-sky-50"
                                  : "border-slate-200 bg-white hover:border-sky-300"
                              }`}
                            >
                              <span>
                                <span className="block font-bold text-slate-950">{item.name}</span>
                                <span className="mt-1 block text-sm text-slate-500">
                                  {alreadyBorrowed ? "Ja ho tens prestat" : item.detail}
                                </span>
                              </span>
                              <span className="flex shrink-0 items-center gap-2">
                                {item.available !== null && (
                                  <span className="text-sm font-bold text-slate-500">
                                    {item.available} disp.
                                  </span>
                                )}
                                <span
                                  className={`grid size-7 place-items-center rounded-full border ${
                                    isSelected
                                      ? "border-sky-600 bg-sky-600 text-white"
                                      : "border-slate-300 text-transparent"
                                  }`}
                                >
                                  <Check className="size-4" aria-hidden="true" />
                                </span>
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <p className="rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center text-slate-500">
                          No hi ha cap article disponible amb aquest nom.
                        </p>
                      )}
                    </div>
                  </>
                )}

                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => handleBorrowOpenChange(false)}
                    className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  >
                    Cancel·lar
                  </button>
                  {borrowCategory && (
                    <button
                      type="button"
                      disabled={!selectedOption}
                      onClick={confirmBorrow}
                      className="min-h-11 rounded-xl bg-sky-600 px-5 text-sm font-black text-white transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Confirmar préstec
                    </button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

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
                  Material agafat en préstec
                </h2>
                <p className="mt-1 text-sm text-slate-500">El que té ara mateix Marta Soler.</p>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-800">
                {loans.length} {loans.length === 1 ? "actiu" : "actius"}
              </span>
            </div>

            {loans.length ? (
              <div className="mt-5 space-y-3">
                {loans.map((loan) => (
                  <LoanItem key={loan.id} loan={loan} onReturn={() => markReturned(loan.id)} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-5 py-8 text-center">
                <Box className="mx-auto size-9 text-slate-400" aria-hidden="true" />
                <p className="mt-3 font-bold">No tens cap material prestat</p>
                <p className="mt-1 text-sm text-slate-500">Utilitza el botó d&apos;inici per agafar-ne.</p>
              </div>
            )}
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
              {loans.map((loan) => (
                <li key={`return-${loan.id}`} className="rounded-2xl bg-amber-400/12 p-4">
                  <div className="flex gap-3">
                    <span className="mt-1 size-2.5 shrink-0 rounded-full bg-amber-400" />
                    <div>
                      <p className="font-bold">Cal retornar: {loan.name}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-300">
                        {loan.category} · prestat a Marta Soler
                      </p>
                    </div>
                  </div>
                </li>
              ))}
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

function LoanItem({ loan, onReturn }: { loan: BorrowedItem; onReturn: () => void }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-700">
        <Box className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold">{loan.name}</h3>
        <p className="mt-0.5 text-sm font-semibold text-sky-700">{loan.category}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <Clock3 className="size-4" aria-hidden="true" />
          Agafat el {loan.borrowedOn} · pendent de devolució
        </p>
      </div>
      <button
        type="button"
        onClick={onReturn}
        className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 text-sm font-bold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Marcar retornat
      </button>
    </article>
  );
}

