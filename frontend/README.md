# Reports Dashboard Frontend

A Vite + React + TypeScript SPA that renders a reports dashboard with filters, summary cards, and a detailed table. Styling is provided by Tailwind CSS. The app consumes the `/api/reports` endpoint from the PHP backend.

## Getting started

```bash
cd frontend
npm install
npm run dev
```

By default the dev server runs on `http://localhost:5173` and proxies API requests to `http://localhost:8080`.

## Available scripts

- `npm run dev` – start the development server with hot module replacement.
- `npm run build` – generate a production build.
- `npm run preview` – preview the production build locally.

## Project structure

- `src/App.tsx` – layout composition for the page.
- `src/components` – stateless UI building blocks.
- `src/hooks/useReports.ts` – data fetching + demo fallback logic.
- `src/types` – shared TypeScript types for report data.
