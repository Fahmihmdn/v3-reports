import { useMemo, useState } from 'react';
import ReportList from './components/ReportList';
import ReportParameters from './components/ReportParameters';
import type { ReportDefinition, ReportParameterState } from './types/report';

const reports: ReportDefinition[] = [
  {
    id: 'portfolio-performance',
    name: 'Portfolio performance summary',
    category: 'Portfolio',
    description: 'Understand balances, repayments, and delinquencies across your loan book.',
    longDescription:
      'Track how your overall portfolio is performing with period-over-period comparisons, delinquency rates, and repayments by loan cohort.',
    tags: ['Overview', 'Executive']
  },
  {
    id: 'repayment-activity',
    name: 'Repayment activity',
    category: 'Collections',
    description: 'Review all repayments received within a period, grouped by borrower and payment method.',
    longDescription:
      'Export a detailed ledger of repayments, including payer details, transaction references, and outstanding balances before and after each payment.',
    tags: ['Payments']
  },
  {
    id: 'upcoming-disbursements',
    name: 'Upcoming disbursements',
    category: 'Operations',
    description: 'Plan your cash flow by seeing every loan scheduled to disburse soon.',
    longDescription:
      'List approved applications and expected release dates so operations can double-check banking details, collateral documents, and compliance tasks before funds go out.',
    tags: ['Scheduling']
  },
  {
    id: 'arrears-management',
    name: 'Accounts in arrears',
    category: 'Risk',
    description: 'Prioritise borrowers with overdue payments and coordinate follow-up actions.',
    longDescription:
      'Filter down to severely overdue accounts, view their latest contact attempts, and prepare the data you need for call lists or legal escalations.',
    tags: ['Delinquency']
  }
];

const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

const createDefaultParameters = (): ReportParameterState => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 30);

  return {
    startDate: formatDateForInput(start),
    endDate: formatDateForInput(today)
  };
};

function App() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(reports[0]?.id ?? null);
  const [parameters, setParameters] = useState<ReportParameterState>(createDefaultParameters());
  const [lastRunSummary, setLastRunSummary] = useState<string | null>(null);

  const selectedReport = useMemo<ReportDefinition | null>((): ReportDefinition | null => {
    return reports.find((report) => report.id === selectedReportId) ?? null;
  }, [selectedReportId]);

  const isInvalidRange = useMemo(() => {
    if (!parameters.startDate || !parameters.endDate) {
      return false;
    }

    return new Date(parameters.startDate) > new Date(parameters.endDate);
  }, [parameters.endDate, parameters.startDate]);

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setParameters(createDefaultParameters());
    setLastRunSummary(null);
  };

  const handleParameterChange = (update: Partial<ReportParameterState>) => {
    setParameters((previous) => ({ ...previous, ...update }));
  };

  const handleReset = () => {
    setParameters(createDefaultParameters());
    setLastRunSummary(null);
  };

  const handleRunReport = () => {
    if (!selectedReport || isInvalidRange) {
      return;
    }

    const { startDate, endDate } = parameters;
    const keyword = parameters.keyword?.trim();
    const summaryParts = [`Date range: ${startDate || '—'} to ${endDate || '—'}`];

    if (keyword) {
      summaryParts.push(`Filter: "${keyword}"`);
    }

    setLastRunSummary(`Prepared "${selectedReport.name}" with ${summaryParts.join(', ')}.`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Reports</p>
            <h1 className="text-3xl font-bold text-slate-900">Operational report library</h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Browse the available operational reports, configure the date range and filters you need, then export the dataset for
              further analysis.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Available reports</h2>
            <ReportList reports={reports} selectedReportId={selectedReportId} onSelect={handleSelectReport} />
          </div>

          <div className="min-h-[20rem]">
            <ReportParameters
              report={selectedReport}
              parameters={parameters}
              isInvalidRange={isInvalidRange}
              onChange={handleParameterChange}
              onRun={handleRunReport}
              onReset={handleReset}
            />
          </div>
        </section>

        {lastRunSummary && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {lastRunSummary}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
