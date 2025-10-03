export type ReportStatus = 'open' | 'in_progress' | 'resolved' | 'blocked';

export interface ReportRow {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  statusLabel: string;
  dueDate: string;
  progress: number;
  owner: {
    name: string;
    role: string;
  };
}

export interface ReportSummary {
  totalReports: number;
  averageResolutionTime: string;
  onTimePercentage: number;
}

export interface ReportResponse {
  rows: ReportRow[];
  totalCount: number;
  lastUpdated: string;
  summary: ReportSummary;
}

export interface ReportFiltersState {
  search: string;
  status: ReportStatus | 'all';
  period: '7d' | '30d' | '90d';
}
