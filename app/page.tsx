import { Suspense } from 'react';
import { FilterPanel, FilterPanelSkeleton } from '@/components/FilterPanel';
import { SummaryCards, SummaryCardsSkeleton } from '@/components/SummaryCards';
import { UserGreeting, UserGreetingSkeleton } from '@/components/UserGreeting';
import { CategoryPieChart, CategoryChartSkeleton } from '@/components/charts/CategoryPieChart';
import { RevenueBarChart, RevenueChartSkeleton } from '@/components/charts/RevenueBarChart';
import { UnitsAreaChart, UnitsChartSkeleton } from '@/components/charts/UnitsAreaChart';
import { getCategoryData, getMonthlyData } from '@/data/queries/sales';
import type { FilterValues } from '@/types/filters';

export default function Page({ searchParams }: PageProps<'/'>) {
  return (
    <div className="group mx-auto flex max-w-7xl flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Sales Dashboard</h1>
        <Suspense fallback={<FilterPanelSkeleton />}>
          <FilterPanel />
        </Suspense>
      </div>
      <Suspense fallback={<UserGreetingSkeleton />}>
        <UserGreeting />
      </Suspense>
      <div className="flex flex-col gap-6 group-has-data-pending:animate-pulse">
        <Suspense fallback={<SummaryCardsSkeleton />}>
          <SummaryCards searchParams={searchParams} />
        </Suspense>
        <h2 className="text-lg font-semibold tracking-tight">Monthly Trends</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Suspense fallback={<RevenueChartSkeleton />}>
            <RevenueChartWrapper searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<UnitsChartSkeleton />}>
            <UnitsChartWrapper searchParams={searchParams} />
          </Suspense>
        </div>
        <h2 className="text-lg font-semibold tracking-tight">Breakdown</h2>
        <Suspense fallback={<CategoryChartSkeleton />}>
          <CategoryChartWrapper searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

type WrapperProps = {
  searchParams: PageProps<'/'>['searchParams'];
};

async function RevenueChartWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = (await searchParams) as FilterValues;
  const dataPromise = getMonthlyData({ category, city, country, region, subcategory });
  return <RevenueBarChart dataPromise={dataPromise} />;
}

async function UnitsChartWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = (await searchParams) as FilterValues;
  const dataPromise = getMonthlyData({ category, city, country, region, subcategory });
  return <UnitsAreaChart dataPromise={dataPromise} />;
}

async function CategoryChartWrapper({ searchParams }: WrapperProps) {
  const { category, city, country, region, subcategory } = (await searchParams) as FilterValues;
  const dataPromise = getCategoryData({ category, city, country, region, subcategory });
  return <CategoryPieChart dataPromise={dataPromise} />;
}
