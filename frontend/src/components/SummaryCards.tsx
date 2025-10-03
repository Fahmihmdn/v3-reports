import type { ReportSummary } from '../types/report';

interface SummaryCardsProps {
  metrics: ReportSummary;
  isLoading: boolean;
}

const numberFormatter = new Intl.NumberFormat('en-SG');
const currencyFormatter = new Intl.NumberFormat('en-SG', {
  style: 'currency',
  currency: 'SGD',
  maximumFractionDigits: 0
});

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
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active Borrowers</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{numberFormatter.format(metrics.totalBorrowers)}</p>
        <p className="mt-2 text-xs text-slate-500">Unique borrowers with open applications</p>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Outstanding Portfolio</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{currencyFormatter.format(metrics.portfolioBalance)}</p>
        <p className="mt-2 text-xs text-slate-500">Remaining principal across disbursed loans</p>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Upcoming Payments</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{numberFormatter.format(metrics.upcomingPayments)}</p>
        <p className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>Scheduled in the next 30 days</span>
          <span className="text-emerald-600">{metrics.onTrackPercentage}% on track</span>
        </p>
      </article>
    </section>
  );
}

export default SummaryCards;
