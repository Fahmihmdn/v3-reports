import type { ReportRow } from '../types/report';

interface ReportTableProps {
  rows: ReportRow[];
  totalCount: number;
  lastUpdated: string;
  isLoading: boolean;
}

const statusColors: Record<ReportRow['status'], string> = {
  open: 'bg-amber-100 text-amber-800',
  in_progress: 'bg-sky-100 text-sky-800',
  resolved: 'bg-emerald-100 text-emerald-800',
  blocked: 'bg-rose-100 text-rose-800'
};

function ReportTable({ rows, totalCount, lastUpdated, isLoading }: ReportTableProps) {
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Detailed Breakdown</h2>
          <p className="text-xs text-slate-500">Last updated {lastUpdated}</p>
        </div>
        <span className="text-xs font-medium text-slate-500">{totalCount} records</span>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
          </div>
        )}

        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Report</th>
              <th className="px-6 py-3 font-semibold">Owner</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Due date</th>
              <th className="px-6 py-3 font-semibold">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{row.title}</div>
                  <p className="text-xs text-slate-500">{row.description}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{row.owner.name}</div>
                  <p className="text-xs text-slate-500">{row.owner.role}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[row.status]}`}>
                    {row.statusLabel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{row.dueDate}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${row.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{row.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && !isLoading && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No records match the selected filters. Try adjusting the search criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportTable;
