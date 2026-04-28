# wolvrene-os

wolvrene-os is a Next.js trading workspace UI prototype with a dark, panel-based layout and centralized client-side app state.

## Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Current UI architecture
- `app/page.tsx`: app entry and store provider wiring.
- `components/layout/*`: shell primitives (top controls, chart workspace, right panel, dock).
- `components/chart/*`: chart canvas and presentation logic.
- `modules/*`: reusable feature panels (watchlist, orders, AI, signals, journal).
- `store/*` + `types/*`: shared application state and domain model types.
