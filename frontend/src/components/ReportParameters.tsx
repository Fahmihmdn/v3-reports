import type { ReportDefinition, ReportParameterState } from '../types/report';

interface ReportParametersProps {
  report: ReportDefinition | null;
  parameters: ReportParameterState;
  isInvalidRange: boolean;
  onChange: (update: Partial<ReportParameterState>) => void;
  onRun: () => void;
  onReset: () => void;
}

export function ReportParameters({ report, parameters, isInvalidRange, onChange, onRun, onReset }: ReportParametersProps) {
  if (!report) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        <h2 className="text-lg font-semibold text-slate-700">Select a report</h2>
        <p className="max-w-sm text-sm text-slate-500">
          Choose one of the reports from the list to configure filters and run the export.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">{report.category}</p>
        <h2 className="text-2xl font-semibold text-slate-900">{report.name}</h2>
        <p className="text-sm text-slate-600">{report.longDescription ?? report.description}</p>
      </header>

      <form className="grid gap-6 lg:grid-cols-2" aria-describedby={isInvalidRange ? 'date-range-error' : undefined}>
        <fieldset className="grid gap-4 rounded-lg border border-slate-200 p-4">
          <legend className="text-sm font-medium text-slate-700">Date range</legend>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Start date</span>
            <input
              type="date"
              value={parameters.startDate}
              onChange={(event) => onChange({ startDate: event.target.value })}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>End date</span>
            <input
              type="date"
              value={parameters.endDate}
              onChange={(event) => onChange({ endDate: event.target.value })}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </label>
          {isInvalidRange && (
            <p id="date-range-error" className="text-sm text-amber-600">
              The start date must be before the end date.
            </p>
          )}
        </fieldset>

        <fieldset className="grid gap-4 rounded-lg border border-slate-200 p-4">
          <legend className="text-sm font-medium text-slate-700">Filters</legend>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Keyword filter</span>
            <input
              type="text"
              placeholder="Search by borrower, account number, or tag"
              value={parameters.keyword ?? ''}
              onChange={(event) => onChange({ keyword: event.target.value || undefined })}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </label>
          <p className="text-xs text-slate-500">
            Leave blank to run the report for all records within the selected dates.
          </p>
        </fieldset>
      </form>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <div className="text-sm text-slate-500">
          Configure your parameters and choose "Run report" to download the latest data snapshot.
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            onClick={onReset}
          >
            Reset filters
          </button>
          <button
            type="button"
            onClick={onRun}
            disabled={isInvalidRange}
            className="inline-flex items-center justify-center rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Run report
          </button>
        </div>
      </footer>
    </div>
  );
}

export default ReportParameters;
