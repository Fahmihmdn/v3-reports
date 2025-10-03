import type { ReportRow } from '../types/report';

interface ReportTableProps {
  rows: ReportRow[];
  totalCount: number;
  lastUpdated: string;
  isLoading: boolean;
}

const statusColors: Record<ReportRow['status'], string> = {
  current: 'bg-emerald-100 text-emerald-700',
  due_soon: 'bg-amber-100 text-amber-800',
  overdue: 'bg-rose-100 text-rose-800',
  completed: 'bg-slate-200 text-slate-700'
};

const currency = new Intl.NumberFormat('en-SG', {
  style: 'currency',
  currency: 'SGD',
  maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat('en-SG', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

function formatDate(value: string | null) {
  if (!value) {
    return '—';
  }

  return dateFormatter.format(new Date(value));
}

function ReportTable({ rows, totalCount, lastUpdated, isLoading }: ReportTableProps) {
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Loan Portfolio Detail</h2>
          <p className="text-xs text-slate-500">Last updated {formatDate(lastUpdated)}</p>
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
              <th className="px-6 py-3 font-semibold">Borrower</th>
              <th className="px-6 py-3 font-semibold">Disbursed / Repaid</th>
              <th className="px-6 py-3 font-semibold">Outstanding</th>
              <th className="px-6 py-3 font-semibold">Next payment</th>
              <th className="px-6 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
            {rows.map((row) => {
              const progress = row.disbursedAmount === 0 ? 0 : Math.min(100, Math.round((row.totalRepaid / row.disbursedAmount) * 100));
              const outstanding = currency.format(row.outstandingBalance);
              const nextPayment = formatDate(row.nextPaymentDue);
              const lastPayment = row.lastPaymentDate ? `${formatDate(row.lastPaymentDate)} · ${currency.format(row.lastPaymentAmount ?? 0)}` : 'No payments recorded';

              return (
                <tr key={row.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{row.borrowerName}</div>
                    <div className="text-xs text-slate-500">{row.accountNumber}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {row.contact.phone ?? 'No phone'} · {row.contact.email ?? 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{currency.format(row.disbursedAmount)}</div>
                    <div className="text-xs text-slate-500">Repaid {currency.format(row.totalRepaid)}</div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{outstanding}</div>
                    <div className="text-xs text-slate-500">{lastPayment}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{nextPayment}</div>
                    {row.status === 'overdue' && (
                      <p className="text-xs text-rose-600">Overdue by {row.delinquencyDays} days</p>
                    )}
                    {row.status === 'due_soon' && (
                      <p className="text-xs text-amber-600">Due within 7 days</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[row.status]}`}>
                      {row.statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
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
