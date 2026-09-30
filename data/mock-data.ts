export const areas = [
  { id: "farmaciola" as const, name: "Farmaciola", summary: "Lots, caducitats i botiquins", items: 38, iconStyle: "bg-red-50 text-red-600" },
  { id: "general" as const, name: "Material general", summary: "Tendes, cuina i activitats", items: 74, iconStyle: "bg-sky-50 text-sky-700" },
  { id: "fungible" as const, name: "Material fungible", summary: "Material que es va consumint", items: 26, iconStyle: "bg-amber-50 text-amber-700" },
  { id: "insignies" as const, name: "Insígnies", summary: "Insígnies, camises i foulards", items: 78, iconStyle: "bg-violet-50 text-violet-700" },
];

export const inventoryItems = [
  { id: 1, name: "Tenda de 4 places", area: "Material general", location: "Magatzem · Prestatgeria A", available: 3 },
  { id: 2, name: "Fogonet de gas", area: "Material general", location: "Magatzem · Cuina", available: 4 },
  { id: 3, name: "Farmaciola Ròvers", area: "Farmaciola", location: "Armari de farmaciola", available: 1 },
  { id: 4, name: "Benes elàstiques", area: "Farmaciola", location: "Farmaciola general", available: 12 },
  { id: 5, name: "Cartolines A3", area: "Material fungible", location: "Sala de material", available: 18 },
  { id: 6, name: "Insígnia de promesa", area: "Insígnies", location: "Despatx", available: 7 },
];

export const notices = [
  { id: 1, title: "Guants d’un sol ús", detail: "Queden 8 unitats. El mínim establert és 10.", dotStyle: "bg-amber-400" },
  { id: 2, title: "Sèrum fisiològic", detail: "Un lot caduca d’aquí a 23 dies.", dotStyle: "bg-red-400" },
];

export type GeneralInventoryItem = {
  id: string;
  name: string;
  code: string;
  category: "Acampada" | "Cuina";
  total: number;
  available: number;
  review: number;
};

export const generalInventory: GeneralInventoryItem[] = [
  {
    id: "tenda-4-places",
    name: "Tendes",
    code: "TEN-04",
    category: "Acampada",
    total: 5,
    available: 3,
    review: 0,
  },
  {
    id: "fogonet-gas",
    name: "Fogonet de gas",
    code: "FOG-02",
    category: "Cuina",
    total: 6,
    available: 4,
    review: 1,
  },
  {
    id: "olla-gran",
    name: "Olla gran de 20 litres",
    code: "OLL-20",
    category: "Cuina",
    total: 2,
    available: 2,
    review: 0,
  },
  {
    id: "corda-20m",
    name: "Corda de 20 metres",
    code: "COR-20",
    category: "Acampada",
    total: 4,
    available: 3,
    review: 0,
  },
  {
    id: "piques-tenda",
    name: "Piquetes de tenda",
    code: "PIQ-01",
    category: "Acampada",
    total: 48,
    available: 42,
    review: 0,
  },
];

export type BadgeCategory =
  | "Castors i Llúdrigues"
  | "Llops i Daines"
  | "Ràngers i Guies"
  | "Pioners i Caravel·les"
  | "Ròvers"
  | "Socis i col·laboradors"
  | "Altres";

export type BadgeInventoryItem = {
  id: string;
  name: string;
  kind: "Insígnia" | "Foulard" | "Camisa" | "Escut";
  category: BadgeCategory;
  stock: number;
};

const shirtSizes = [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50] as const;

function makeShirts(
  idPrefix: string,
  branchName: string,
  category: BadgeCategory,
  stockBySize: Partial<Record<(typeof shirtSizes)[number], number>>,
): BadgeInventoryItem[] {
  return shirtSizes.map((size) => ({
    id: `${idPrefix}-talla-${size}`,
    name: `Camisa ${branchName} talla ${size}`,
    kind: "Camisa",
    category,
    stock: stockBySize[size] ?? 0,
  }));
}

export const badgeInventory: BadgeInventoryItem[] = [
  { id: "castor", name: "Castor", kind: "Insígnia", category: "Castors i Llúdrigues", stock: 9 },
  { id: "lludriga", name: "Llúdriga", kind: "Insígnia", category: "Castors i Llúdrigues", stock: 10 },
  { id: "riu-amunt", name: "Riu Amunt", kind: "Insígnia", category: "Castors i Llúdrigues", stock: 35 },
  { id: "fulard-castors", name: "Foulard Castors", kind: "Foulard", category: "Castors i Llúdrigues", stock: 16 },
  ...makeShirts("camisa-castors", "Castors", "Castors i Llúdrigues", { 36: 2 }),

  { id: "llop", name: "Llop", kind: "Insígnia", category: "Llops i Daines", stock: 0 },
  { id: "daina", name: "Daina", kind: "Insígnia", category: "Llops i Daines", stock: 11 },
  { id: "estel-llop", name: "Estel Llop / Estel de Pilot", kind: "Insígnia", category: "Llops i Daines", stock: 15 },
  { id: "fulard-llops", name: "Foulard Llops", kind: "Foulard", category: "Llops i Daines", stock: 11 },
  ...makeShirts("camisa-llops", "Llops", "Llops i Daines", { 32: 2, 36: 1, 38: 2 }),

  { id: "cercle-progres", name: "Cercle del Progrés", kind: "Insígnia", category: "Ràngers i Guies", stock: 7 },
  { id: "cep-verd", name: "Cep Verd", kind: "Insígnia", category: "Ràngers i Guies", stock: 3 },
  { id: "estel-operacio", name: "Estel d’Operació", kind: "Insígnia", category: "Ràngers i Guies", stock: 9 },
  { id: "estil-ranger", name: "Estil Ranger", kind: "Insígnia", category: "Ràngers i Guies", stock: 48 },
  { id: "fulard-rangers", name: "Foulard Rangers", kind: "Foulard", category: "Ràngers i Guies", stock: 8 },
  ...makeShirts("camisa-rangers", "Rangers", "Ràngers i Guies", { 34: 1, 36: 2, 38: 3, 40: 3 }),

  { id: "promesa-pioners", name: "Promesa (Pioners)", kind: "Insígnia", category: "Pioners i Caravel·les", stock: 0 },
  { id: "servei", name: "Servei", kind: "Insígnia", category: "Pioners i Caravel·les", stock: 19 },
  { id: "animacio", name: "Animació", kind: "Insígnia", category: "Pioners i Caravel·les", stock: 20 },
  { id: "fulard-pioners", name: "Foulard Pioners", kind: "Foulard", category: "Pioners i Caravel·les", stock: 11 },
  ...makeShirts("camisa-pioners", "Pioners", "Pioners i Caravel·les", { 42: 2 }),

  { id: "promesa-rovers", name: "Promesa (Rovers)", kind: "Insígnia", category: "Ròvers", stock: 14 },
  { id: "fulard-rovers", name: "Foulard Rovers", kind: "Foulard", category: "Ròvers", stock: 5 },
  ...makeShirts("camisa-rovers", "Rovers", "Ròvers", { 42: 1, 44: 1 }),

  { id: "fulard-socis", name: "Foulard Socis", kind: "Foulard", category: "Socis i col·laboradors", stock: 16 },

  { id: "escut-albada", name: "Escut A.E. Albada", kind: "Escut", category: "Altres", stock: 1200 },
  { id: "flor-lis", name: "Flor de Lis", kind: "Insígnia", category: "Altres", stock: 3 },
  { id: "fulard-altres", name: "Foulard Altres", kind: "Foulard", category: "Altres", stock: 5 },
];

export type FirstAidUnit = {
  id: string;
  name: string;
  kind: "Magatzem general" | "Botiquí de branca";
  products: number;
  units: number;
  missing: number;
  expiring: number;
};

export const firstAidUnits: FirstAidUnit[] = [
  { id: "general", name: "Farmaciola general", kind: "Magatzem general", products: 24, units: 146, missing: 0, expiring: 2 },
  { id: "castors", name: "Castors i Llúdrigues", kind: "Botiquí de branca", products: 12, units: 38, missing: 0, expiring: 0 },
  { id: "llops", name: "Llops i Daines", kind: "Botiquí de branca", products: 12, units: 35, missing: 1, expiring: 0 },
  { id: "rangers", name: "Ràngers i Guies", kind: "Botiquí de branca", products: 13, units: 42, missing: 0, expiring: 1 },
  { id: "pioners", name: "Pioners i Caravel·les", kind: "Botiquí de branca", products: 11, units: 31, missing: 2, expiring: 0 },
  { id: "rovers", name: "Ròvers", kind: "Botiquí de branca", products: 10, units: 28, missing: 0, expiring: 0 },
];

export type ConsumableItem = {
  id: string;
  name: string;
  category: "Papereria" | "Manualitats" | "Neteja";
  isOut: boolean;
};

export const consumableInventory: ConsumableItem[] = [
  { id: "cartolines", name: "Cartolines A3", category: "Papereria", isOut: true },
  { id: "paper-a4", name: "Paper A4", category: "Papereria", isOut: false },
  { id: "retoladors", name: "Retoladors permanents", category: "Manualitats", isOut: false },
  { id: "cinta", name: "Cinta adhesiva", category: "Manualitats", isOut: false },
  { id: "bosses", name: "Bosses d’escombraries", category: "Neteja", isOut: true },
  { id: "paper-higienic", name: "Paper higiènic", category: "Neteja", isOut: true },
  { id: "sabo", name: "Sabó de mans", category: "Neteja", isOut: false },
];
