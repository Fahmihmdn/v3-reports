# Reports API Prototype

This lightweight PHP API powers the loan servicing dashboard prototype. It exposes a single `GET /api/reports` endpoint that returns borrower-level repayment progress, portfolio summary metrics, and demo data when a database connection is unavailable.

## Requirements

- PHP 8.2+
- Composer
- MySQL or MariaDB

## Getting started

```bash
cd backend
composer install
cp .env.example .env
php -S localhost:8080 -t public
```

The API will be available at `http://localhost:8080/api/reports`. If the database connection fails the API falls back to deterministic demo data so the frontend remains functional.

### Database setup

Run the migration to create the schema used by the dashboard:

```sql
$(cat database/migrations/001_create_reports_table.sql)
```

This creates the following tables populated with realistic seed data:

- `borrowers` – borrower profile and contact details.
- `applications` – loan applications linked to borrowers.
- `disbursements` – cash out events for each application.
- `payment_schedule` – expected instalments.
- `repayments` – payments received.
- `calls` – follow-up call log entries.
- `vt_audit_log` – sample audit trail rows.

The `GET /api/reports` endpoint aggregates these tables to produce portfolio status, outstanding balances, and summary metrics consumed by the frontend.

## Project structure

- `public/index.php` – minimal front controller and routing.
- `src/Database.php` – PDO connection wrapper using environment variables.
- `src/ReportRepository.php` – query logic for fetching loan health data and aggregating metrics.
- `database/migrations` – SQL schema migrations and seed data.
