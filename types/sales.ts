export type MonthlyData = {
  month: string;
  revenue: number;
  units: number;
};

export type CategoryData = {
  category: string;
  revenue: number;
};

export type SummaryData = {
  totalRevenue: number;
  totalUnits: number;
};

export type SalesData = {
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
};
