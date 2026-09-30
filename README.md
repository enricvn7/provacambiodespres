# Inventari del Cau

Proposta web senzilla per consultar l’inventari de l’A.E. Albada. Inclou les pantalles de material general, farmaciola, material fungible i insígnies.

## Obrir el projecte en un altre ordinador

Cal tenir instal·lat [Node.js](https://nodejs.org/) i Git.

```bash
git clone https://github.com/enricvn7/provacambiodespres.git
cd provacambiodespres
npm install -g pnpm@11.19.0
pnpm install
pnpm dev
```

Després, obre al navegador:

```text
http://localhost:5173
```

Per aturar la web, prem `Ctrl + C` al terminal.

## Comprovar que tot funciona

```bash
pnpm build
```

## Contingut principal

- `app/`: pàgines de la web.
- `components/`: components reutilitzables.
- `data/`: dades de demostració de l’inventari.
- `public/`: recursos públics.

Les carpetes generades (`node_modules`, `dist`, `.next`, `.vinext` i similars) no s’han de pujar al repositori.
