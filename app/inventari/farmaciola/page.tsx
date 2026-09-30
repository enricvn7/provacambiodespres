import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BriefcaseMedical,
  Clock3,
  Cross,
  Package,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import { firstAidUnits, type FirstAidUnit } from "@/data/mock-data";

export default function FirstAidPage() {
  const generalUnit = firstAidUnits[0];
  const branchUnits = firstAidUnits.slice(1);
  const totalMissing = firstAidUnits.reduce((total, unit) => total + unit.missing, 0);
  const totalExpiring = firstAidUnits.reduce((total, unit) => total + unit.expiring, 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Tornar a l’inici"
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <div>
            <p className="font-bold tracking-tight">Inventari del Cau</p>
            <p className="text-sm text-slate-500">Farmaciola</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-red-100 text-red-700">
              <Cross className="size-6" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Farmaciola</h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              Estat del magatzem general i dels botiquins de les branques.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Summary value={firstAidUnits.length} label="Dotacions" />
            <Summary value={totalMissing} label="Mancances" warning={totalMissing > 0} />
            <Summary value={totalExpiring} label="Caducitats" warning={totalExpiring > 0} />
          </div>
        </section>

        <section aria-labelledby="general-heading" className="mt-9">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-200 text-slate-700">
              <Warehouse className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="general-heading" className="text-xl font-extrabold tracking-tight">Magatzem general</h2>
              <p className="text-sm text-slate-500">Existències de referència del Cau.</p>
            </div>
          </div>
          <FirstAidCard unit={generalUnit} featured />
        </section>

        <section aria-labelledby="branches-heading" className="mt-9">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-red-100 text-red-700">
              <BriefcaseMedical className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="branches-heading" className="text-xl font-extrabold tracking-tight">Botiquins de branca</h2>
              <p className="text-sm text-slate-500">Un botiquí per a cada branca.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branchUnits.map((unit) => (
              <FirstAidCard key={unit.id} unit={unit} />
            ))}
          </div>
        </section>

        <p className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-500">
          Les quantitats són dades de demostració. Més endavant hi afegirem els productes, els lots, les caducitats i el contingut previst de cada botiquí.
        </p>
      </div>
    </main>
  );
}

function FirstAidCard({ unit, featured = false }: { unit: FirstAidUnit; featured?: boolean }) {
  const hasAlert = unit.missing > 0 || unit.expiring > 0;

  return (
    <article className={`rounded-3xl border bg-white p-5 shadow-sm ${featured ? "border-slate-300 sm:p-6" : "border-slate-200"}`}>
      <div className="flex items-start justify-between gap-4">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${featured ? "bg-slate-100 text-slate-700" : "bg-red-50 text-red-700"}`}>
          {featured ? <Warehouse className="size-6" aria-hidden="true" /> : <BriefcaseMedical className="size-6" aria-hidden="true" />}
        </span>
        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold ${hasAlert ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
          {hasAlert ? <AlertTriangle className="size-3.5" aria-hidden="true" /> : <ShieldCheck className="size-3.5" aria-hidden="true" />}
          {hasAlert ? "Cal revisar" : "Complet"}
        </span>
      </div>

      <p className="mt-5 text-sm font-bold text-red-700">{unit.kind}</p>
      <h3 className="mt-1 text-xl font-extrabold tracking-tight">{unit.name}</h3>

      <div className={`mt-5 grid gap-3 ${featured ? "sm:grid-cols-4" : "grid-cols-2"}`}>
        <Metric icon={Package} value={unit.products} label="Productes" />
        <Metric icon={BriefcaseMedical} value={unit.units} label="Unitats" />
        <Metric icon={AlertTriangle} value={unit.missing} label="Mancances" warning={unit.missing > 0} />
        <Metric icon={Clock3} value={unit.expiring} label="Prop de caducar" warning={unit.expiring > 0} />
      </div>
    </article>
  );
}

function Metric({ icon: Icon, value, label, warning = false }: { icon: typeof Package; value: number; label: string; warning?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 ${warning ? "bg-amber-50" : "bg-slate-50"}`}>
      <Icon className={`size-4 ${warning ? "text-amber-700" : "text-slate-400"}`} aria-hidden="true" />
      <p className={`mt-2 text-xl font-black ${warning ? "text-amber-900" : "text-slate-950"}`}>{value}</p>
      <p className={`mt-0.5 text-sm font-semibold ${warning ? "text-amber-700" : "text-slate-500"}`}>{label}</p>
    </div>
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
