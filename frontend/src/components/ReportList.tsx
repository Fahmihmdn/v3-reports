import type { ReportDefinition } from '../types/report';

interface ReportListProps {
  reports: ReportDefinition[];
  selectedReportId: string | null;
  onSelect: (reportId: string) => void;
}

export function ReportList({ reports, selectedReportId, onSelect }: ReportListProps) {
  return (
    <div className="space-y-3" role="list">
      {reports.map((report) => {
        const isActive = report.id === selectedReportId;

        return (
          <button
            key={report.id}
            type="button"
            onClick={() => onSelect(report.id)}
            className={`w-full rounded-xl border px-5 py-4 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:px-6
              ${
                isActive
                  ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-md'
                  : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/40'
              }`}
            aria-current={isActive}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">{report.category}</p>
                <h2 className="text-lg font-semibold text-slate-900">{report.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{report.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {report.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ReportList;
