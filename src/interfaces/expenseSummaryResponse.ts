import { SummaryByCategory } from "./summaryByCategory";

export interface ExpenseSummaryResponse {
  summaryByCategory: SummaryByCategory;
  topCategory: {
    name: string;
    total: number;
  };
  totalExpenses: number;
  friendlyMessage: string;
}