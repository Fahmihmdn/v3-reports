// <<<<<<< codex/add-report-page-to-web-application-kw600w
// export interface ReportDefinition {
//   id: string;
//   name: string;
//   category: string;
//   description: string;
//   longDescription?: string;
//   tags?: string[];
//   defaultRangeInDays?: number;
// }

// export interface ReportParameterState {
//   startDate: string;
//   endDate: string;
//   keyword?: string;
// =======
// export type PortfolioStatus = 'current' | 'due_soon' | 'overdue' | 'completed';

// export interface ReportRow {
//   id: string;
//   borrowerId: number;
//   borrowerName: string;
//   accountNumber: string;
//   loanAmount: number;
//   disbursedAmount: number;
//   totalRepaid: number;
//   outstandingBalance: number;
//   nextPaymentDue: string | null;
//   lastPaymentDate: string | null;
//   lastPaymentAmount: number | null;
//   status: PortfolioStatus;
//   statusLabel: string;
//   delinquencyDays: number;
//   contact: {
//     phone: string | null;
//     email: string | null;
//   };
// }

// export interface ReportSummary {
//   totalBorrowers: number;
//   portfolioBalance: number;
//   upcomingPayments: number;
//   onTrackPercentage: number;
// }

// export interface ReportResponse {
//   rows: ReportRow[];
//   totalCount: number;
//   lastUpdated: string;
//   summary: ReportSummary;
// }

// export interface ReportFiltersState {
//   search: string;
//   status: PortfolioStatus | 'all';
//   period: '7d' | '30d' | '90d';
// >>>>>>> main
// }
