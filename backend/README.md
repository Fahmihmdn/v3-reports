# Reports API Prototype

This lightweight PHP API powers the reports dashboard prototype. It exposes a single `GET /api/reports` endpoint that returns tabular report data, summary metrics, and demo data when a database connection is unavailable.

## Requirements

- PHP 8.2+
- Composer
- MySQL or MariaDB (optional for demo mode)

## Getting started

```bash
cd backend
composer install
cp .env.example .env
php -S localhost:8080 -t public
```

The API will be available at `http://localhost:8080/api/reports`. If the database connection fails the API falls back to deterministic demo data so the frontend remains functional.

### Database setup

Run the migration against your database to create the `reports` table:

```sql
$(cat database/migrations/001_create_reports_table.sql)
```

Populate the table with your data or insert sample rows for testing. The repository expects the following columns: `title`, `description`, `status`, `status_label`, `due_date`, `progress`, `owner_name`, `owner_role`, `created_at`, `resolved_at`, and `on_time` (0 or 1).

## Project structure

- `public/index.php` – minimal front controller and routing.
- `src/Database.php` – PDO connection wrapper using environment variables.
- `src/ReportRepository.php` – query logic for fetching reports and aggregating metrics.
- `database/migrations` – SQL schema migrations.
