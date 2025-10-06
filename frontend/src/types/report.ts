export interface ReportDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  tags?: string[];
  defaultRangeInDays?: number;
}

export interface ReportParameterState {
  startDate: string;
  endDate: string;
  keyword?: string;
}
