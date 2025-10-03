import type { ReportSummary } from '../types/report';

interface SummaryCardsProps {
  metrics: ReportSummary;
  isLoading: boolean;
}

const formatter = new Intl.NumberFormat('en-US');

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-200 bg-slate-100 p-6">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="mt-4 h-8 w-32 rounded bg-slate-200" />
      <div className="mt-6 h-3 w-20 rounded bg-slate-200" />
    </div>
  );
}

function SummaryCards({ metrics, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <section className="grid gap-4 md:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Reports</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{formatter.format(metrics.totalReports)}</p>
        <p className="mt-2 text-xs text-slate-500">Across all statuses for the selected period</p>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Avg. Resolution Time</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{metrics.averageResolutionTime}</p>
        <p className="mt-2 text-xs text-slate-500">Time to close resolved reports</p>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">On-time Delivery</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{metrics.onTimePercentage}%</p>
        <p className="mt-2 text-xs text-slate-500">Reports completed before their due date</p>
      </article>
    </section>
  );
}

export default SummaryCards;
