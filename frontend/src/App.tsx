import { useMemo, useState } from 'react';
import ReportFilters from './components/ReportFilters';
import SummaryCards from './components/SummaryCards';
import ReportTable from './components/ReportTable';
import type { ReportFiltersState, ReportRow } from './types/report';
import { useReports } from './hooks/useReports';

const initialFilters: ReportFiltersState = {
  search: '',
  status: 'all',
  period: '30d'
};

function App() {
  const [filters, setFilters] = useState<ReportFiltersState>(initialFilters);
  const { data, isLoading, error } = useReports(filters);

  const filteredRows = useMemo<ReportRow[]>(() => data.rows, [data.rows]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Operations</p>
            <h1 className="text-3xl font-bold text-slate-900">Monthly Reporting Overview</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Monitor key performance indicators, statuses, and anomalies in a single, customizable view.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-md bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500">
            Export Report
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <ReportFilters filters={filters} onChange={setFilters} />
        </section>

        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <SummaryCards metrics={data.summary} isLoading={isLoading} />

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <ReportTable
            rows={filteredRows}
            isLoading={isLoading}
            lastUpdated={data.lastUpdated}
            totalCount={data.totalCount}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
