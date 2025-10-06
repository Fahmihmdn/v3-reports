export type PortfolioStatus = 'current' | 'due_soon' | 'overdue' | 'completed';

export interface ReportDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  tags?: string[];
}

export interface ReportParameterState {
  startDate: string;
  endDate: string;
  status: PortfolioStatus | 'all';
  includeFees: boolean;
  minimumAmount?: number;
  keyword?: string;
}
