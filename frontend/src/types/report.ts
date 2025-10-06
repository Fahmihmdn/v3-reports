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
  keyword?: string;
}
