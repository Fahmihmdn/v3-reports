# LoanApp v3 Reports Prototype

This repository contains a standalone reports experience that will later be integrated into the main LoanApp v3 product. It is composed of a modern TypeScript frontend and a lightweight PHP backend.

## Project structure

- `frontend/` – Vite + React + Tailwind dashboard experience.
- `backend/` – PHP 8.2 API that exposes `/api/reports`.

## Quick start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend.

### Backend

```bash
cd backend
composer install
cp .env.example .env
php -S localhost:8080 -t public
```

The backend will respond to `GET http://localhost:8080/api/reports`. If a database connection cannot be established the API returns demo data so the dashboard continues to function.

### Database (optional)

Use the SQL migration in `backend/database/migrations` to create the `reports` table. Populate it with your own data to drive the dashboard.

## Next steps

- Integrate authentication and authorization.
- Replace demo data with live database queries.
- Wire the module into the primary LoanApp v3 application shell.
