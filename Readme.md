# LoanApp v3 Reports Prototype

This repository contains a standalone loan servicing dashboard that will later be integrated into the main LoanApp v3 product. It is composed of a modern TypeScript frontend and a lightweight PHP backend that serves aggregated portfolio data.

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

The backend responds to `GET http://localhost:8080/api/reports`. If a database connection cannot be established the API returns demo data so the dashboard continues to function.

### Database seed

Run the SQL migration in `backend/database/migrations` to create the borrower, application, disbursement, repayment, payment schedule, call log, and audit log tables along with sample seed data.

```sql
$(cat backend/database/migrations/001_create_reports_table.sql)
```

Once applied, update the `.env` file with your database credentials so the API can compute real metrics from the seeded data.

## Next steps

- Integrate authentication and authorization.
- Replace demo data with live production queries.
- Wire the module into the primary LoanApp v3 application shell.
