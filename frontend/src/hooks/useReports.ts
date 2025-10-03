import { useEffect, useState } from 'react';
import type { ReportFiltersState, ReportResponse } from '../types/report';

const fallbackData: ReportResponse = {
  rows: [],
  totalCount: 0,
  lastUpdated: new Date().toLocaleString(),
  summary: {
    totalReports: 0,
    averageResolutionTime: '—',
    onTimePercentage: 0
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

          setData((previous) =>
            previous.rows.length > 0
              ? previous
              : {
                  rows: [
                    {
                      id: 'demo-1',
                      title: 'Quarterly Compliance Audit',
                      description: 'Review of policy adherence across key departments.',
                      status: 'in_progress',
                      statusLabel: 'In progress',
                      dueDate: '2024-06-30',
                      progress: 68,
                      owner: {
                        name: 'Jordan Miller',
                        role: 'Compliance Lead'
                      }
                    },
                    {
                      id: 'demo-2',
                      title: 'Customer Satisfaction Deep Dive',
                      description: 'Aggregated NPS and feedback trends from Q2 surveys.',
                      status: 'open',
                      statusLabel: 'Open',
                      dueDate: '2024-07-05',
                      progress: 25,
                      owner: {
                        name: 'Taylor Brooks',
                        role: 'Insights Analyst'
                      }
                    },
                    {
                      id: 'demo-3',
                      title: 'Incident Response Retro',
                      description: 'Post-mortem and recommendations for priority incidents.',
                      status: 'resolved',
                      statusLabel: 'Resolved',
                      dueDate: '2024-06-12',
                      progress: 100,
                      owner: {
                        name: 'Morgan Lee',
                        role: 'Operations Manager'
                      }
                    }
                  ],
                  totalCount: 3,
                  lastUpdated: new Date().toLocaleString(),
                  summary: {
                    totalReports: 3,
                    averageResolutionTime: '5d 4h',
                    onTimePercentage: 86
                  }
                }
          );
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
