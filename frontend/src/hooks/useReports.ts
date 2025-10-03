import { useEffect, useState } from 'react';
import type { ReportFiltersState, ReportResponse } from '../types/report';

const fallbackData: ReportResponse = {
  rows: [
    {
      id: 'demo-1001',
      borrowerId: 1,
      borrowerName: 'Demo Borrower One',
      accountNumber: 'ACC-1001',
      loanAmount: 5000,
      disbursedAmount: 5000,
      totalRepaid: 3000,
      outstandingBalance: 2000,
      nextPaymentDue: '2024-06-15',
      lastPaymentDate: '2024-05-20',
      lastPaymentAmount: 1500,
      status: 'due_soon',
      statusLabel: 'Due soon',
      delinquencyDays: 0,
      contact: {
        phone: '+65 8000 0001',
        email: 'borrower.one@example.com'
      }
    }
  ],
  totalCount: 1,
  lastUpdated: new Date().toISOString(),
  summary: {
    totalBorrowers: 1,
    portfolioBalance: 2000,
    upcomingPayments: 1,
    onTrackPercentage: 100
  }
};

export function useReports(filters: ReportFiltersState) {
  const [data, setData] = useState<ReportResponse>(fallbackData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReports() {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        search: filters.search,
        status: filters.status,
        period: filters.period
      });

      try {
        const response = await fetch(`/api/reports?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as ReportResponse;
        setData(payload);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Failed to load reports', err);
          setError('Unable to load reports from the server. Displaying cached data.');

          setData((previous) => previous ?? fallbackData);
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadReports();

    return () => controller.abort();
  }, [filters]);

  return { data, isLoading, error };
}
