# Reports Dashboard Frontend

A Vite + React + TypeScript single-page app that renders the loan servicing control tower with borrower filters, portfolio summary cards, and a detailed repayment table. Styling is provided by Tailwind CSS. The app consumes the `/api/reports` endpoint from the PHP backend.

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

- `src/App.tsx` – layout composition for the control tower page.
- `src/components` – stateless UI building blocks.
- `src/hooks/useReports.ts` – data fetching and offline fallback logic.
- `src/types` – shared TypeScript types for portfolio data.
