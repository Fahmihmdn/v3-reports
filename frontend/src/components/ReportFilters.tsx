import type { ChangeEvent } from 'react';
import type { ReportFiltersState } from '../types/report';

interface ReportFiltersProps {
  filters: ReportFiltersState;
  onChange: (filters: ReportFiltersState) => void;
}

const periods: Record<ReportFiltersState['period'], string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days'
};

const statuses: Array<{ value: ReportFiltersState['status']; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'blocked', label: 'Blocked' }
];

function ReportFilters({ filters, onChange }: ReportFiltersProps) {
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: event.target.value });
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, status: event.target.value as ReportFiltersState['status'] });
  };

  const handlePeriodChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, period: event.target.value as ReportFiltersState['period'] });
  };

  return (
    <form className="grid gap-4 md:grid-cols-4">
      <div className="md:col-span-2">
        <label htmlFor="search" className="block text-sm font-medium text-slate-700">
          Search
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
            Keyword
          </span>
          <input
            id="search"
            type="search"
            placeholder="Search by report title, owner, or tag"
            value={filters.search}
            onChange={handleTextChange}
            className="block w-full min-w-0 flex-1 rounded-r-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          id="status"
          value={filters.status}
          onChange={handleStatusChange}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="period" className="block text-sm font-medium text-slate-700">
          Period
        </label>
        <select
          id="period"
          value={filters.period}
          onChange={handlePeriodChange}
          className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          {Object.entries(periods).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

export default ReportFilters;
